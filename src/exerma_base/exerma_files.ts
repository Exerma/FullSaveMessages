/*----------------------------
 *  (c) Patrick Seuret, 2023  
 *----------------------------
 *  exerma_files.js
 *----------------------------
 *
 * Versions:
 *   2023-08-20: Chg: Make this module an export class with static functions
 *   2023-07-20: First version
 * 
 */

//---------- Imports
import { EventNames, cNullString } from "./exerma_consts";
import { exDom } from "./exerma_dom";
import "./exerma_types";

//---------- Exported class
// Export object
export class exFiles  {

//============================================================================
// Files and directory management
//---------------------------------------------------------------------------
// Source: 
//   https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Working_with_files
//   https://github.com/mdn/webextensions-examples/blob/main/imagify/sidebar/choose_file.js
//   https://stackoverflow.com/questions/16215771/how-to-open-select-file-dialog-via-js

    public static async AskUserForFile(params: {
                                            allowMultiSelect?:boolean|undefined, 
                                            contentType?:string|undefined, 
                                            timeoutDelay?:number|undefined, //15*60*1000)
                                            useInputBox?:HTMLInputElement|undefined
                                        }) 
                                : Promise<nFileList> {

        // Consts
        const cSourceName:string = "exerma_files::AskUserForFile";


        try {
            console.log(cSourceName + " has started");
            
            // Build temporary DOM entry if necessary
            let inputBox:HTMLInputElement=params.useInputBox??document.createElement('input');
            inputBox.multiple = params.allowMultiSelect??false;
            inputBox.type = 'file';
            inputBox.accept=params.contentType??cNullString;

            // Use the input box
            console.log(cSourceName+" opens input box");
            
            const promiseInput:Promise<nFileList> =
                    new Promise<nFileList>((resolve) => {
                        inputBox.addEventListener("change", () => {
                            console.log(cSourceName+":inputBox: Changed");
                            //resolve(inputBox.files);
                        });
                        inputBox.addEventListener("ended", () => {
                            console.log(cSourceName+":inputBox: Ended");
                            //resolve(inputBox.files);
                        });
                        inputBox.addEventListener("input", () => {
                            console.log(cSourceName+":inputBox: Input");
                            resolve(inputBox.files);
                        });
                        inputBox.addEventListener("click", (event) => {
                            console.log(cSourceName+":inputBox: Click");
                            //resolve(inputBox.files);
                        });
                        inputBox.addEventListener("close", () => {
                            console.log(cSourceName+":inputBox: Closed");
                            //resolve(inputBox.files);
                        });
                        inputBox.addEventListener("cancel", () => {
                            console.log(cSourceName+":inputBox: Cancel");
                            resolve(inputBox.files);
                        });

                        console.log(cSourceName+" last command before click");
                        inputBox.click(); //nothing happens with: dispatchEvent(new Event(EventNames.cEventClick));
                        console.log(cSourceName+" input box started");
                    
                    });

            if (params.timeoutDelay) {
                const promiseTimeout:Promise<nFileList> =
                new Promise<nFileList>((resolve) => { 
                    setTimeout(() => {
                        console.log(cSourceName+" timeout");
                        resolve(null);
                }, params.timeoutDelay)});
                return Promise.race([promiseTimeout, promiseInput]);
            } else {
                return promiseInput;
            }

        } catch (error) {
            console.log(cSourceName+":Error: " + error);
            throw error;            
        }

    }

}

