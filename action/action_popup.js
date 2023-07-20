/*----------------------------
 *  (c) Patrick Seuret, 2023  
 *----------------------------
 *  action_popup.js
 *----------------------------
 *
 * Versions:
 *   2023-07-17: First version
 * 
 */

import {exMessages} from "../exerma_base/exerma_messages.js";
import {exFiles}    from "../exerma_base/exerma_files.js";

try {
    
    // Load messages by chunks (about 100 per chunk)
    let selection = exMessages.LoadSelectedMessages();
    
    for await (let message of selection) {

        console.log(message.subject);
        //exFiles.openFileDialog();

    };


} catch (error) {

    selection = null;
    
}

