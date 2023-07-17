/*----------------------------
 *  (c) Patrick Seuret, 2023  
 *----------------------------
 *  common.js
 *----------------------------
 *
 * Versions:
 *   2023-07-17: First version
 * 
 */

//============================================================================
// Manage messages
//---------------------------------------------------------------------------
// Source: https://webextension-api.thunderbird.net/en/latest/how-to/messageLists.html
//
// Example of use
//
////let messages = listMessages(folder);
//for await (let message of messages) {
//  // Do something with the message.
//  let full = await messenger.messages.getFull(message.id);
//}
//

// Retrieve the selected messages in a folder
// \param folder is the 
// Return [MessageHeader] an array with all currently selected messages
async function* LoadSelectedMessages(tabId) {

    let page = await messenger.mailTabs.getSelectedMessages(tabId);
    for (let message of page.messages) {
        yield message;
    }
  
    while (page.id) {
        page = await messenger.messages.continueList(page.id);
        for (let message of page.messages) {
            yield message;
        }
    }

}



// Retrieve all messages in a folder
// Return [MessageHeader] an array with all messages in tabId
async function* LoadAllMessages(tabId) {

    let page = await messenger.mailTabs.query(tabId);
    for (let message of page.messages) {
        yield message;
    }
  
    while (page.id) {
        page = await messenger.messages.continueList(page.id);
        for (let message of page.messages) {
            yield message;
        }
    }

}

