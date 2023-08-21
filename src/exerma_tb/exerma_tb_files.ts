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
import "../exerma_base/exerma_types";

//---------- Exported class
// Export object
export class exTbFiles  {

//============================================================================
// Files and directory management
//---------------------------------------------------------------------------
// Source: 
//   https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Working_with_files
//   https://github.com/mdn/webextensions-examples/blob/main/imagify/sidebar/choose_file.js
//

    public static async *AskUserForFile(allowMultiSelect: boolean = false) {

        // Local consts
        let idDOMInputFile:string = "exerma_input_file";
        let idDOMInputFileMulti:string = "exerma_input_file_multi";

        // Local variables
        let inputBox: nHTMLElement;
        let createInputBox:string = '';

        // Build DOM entry on demand
        if (allowMultiSelect) {
            inputBox = document.getElementById(idDOMInputFileMulti);
            if (inputBox===null) {
                createInputBox = '<input type="file" style="display: none;" id="' 
                               + idDOMInputFileMulti 
                               + '" multiple />'
            }
        } else {
            inputBox = document.getElementById(idDOMInputFile);
            if (inputBox===null) {
                createInputBox = '<input type="file" style="display: none;" id="' 
                               + idDOMInputFile 
                               + '" />'
            }
        }
        if (inputBox!==null) {
            inputBox = document.createElement(createInputBox);
            document.body.appendChild(inputBox);
        }



    }


}; // End of exTbFiles


