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

try {
    
    // Load first chunk of messages (about 100)
    let selection = LoadSelectedMessages();

    for await (let message of selection) {

        console.log(message.subject)

    };


} catch (error) {

    selection = null;
    
}

