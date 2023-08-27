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
import { EventNames } from "./exerma_consts";
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

    public static async AskUserForFile(allowMultiSelect:boolean = false, 
                                       contentType:string = '', 
                                       timeoutDelay:number = 10000) //15*60*1000)
                                : Promise<nFileList> {

        // Consts
        const cSourceName:string = "exerma_files::AskUserForFile";

        // Local variables
        var inputBox:HTMLInputElement; 

        try {
            console.log("AskUserForFile has started");
            
            // Build temporary DOM entry
            inputBox = <HTMLInputElement>document.getElementById("exerma_input_file")??document.createElement('input');
            inputBox.multiple = allowMultiSelect;
            inputBox.type = 'file';
            inputBox.accept=contentType;

            // Use the input box
            console.log(cSourceName+" opens input box");

            
            const promiseTimeout:Promise<nFileList> =
                    new Promise<nFileList>((resolve) => { 
                        setTimeout(() => {
                            console.log(cSourceName+" timeout");
                            resolve(null);
                    }, timeoutDelay)});

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
                            (<HTMLInputElement>event.target).value='';
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
                        //inputBox.click(); // No effect with: dispatchEvent(new Event(EventNames.cEventClick));
                        console.log(cSourceName+" input box started");
                    
                    });
            return Promise.race([promiseTimeout, promiseInput]);
            //return promiseInput;
            

        } catch (error) {
            console.log(cSourceName+":Error: " + error);
            throw error;            
        }

    }

}

