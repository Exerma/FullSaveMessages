/*----------------------------
 *  (c) Patrick Seuret, 2023  
 *----------------------------
 *  exerma_messages.js
 *----------------------------
 *
 * Versions:
 *   2023-08-20: Chg: Make this module an export class with static functions
 *   2023-07-17: First version
 * 
 */

//---------- Import
import "../exerma_base/exerma_types";
import "../exerma_tb/exerma_tb_types";
 

//---------- Export object
export class exTbMessages {

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
public static async *LoadSelectedMessages (tabId:number|undefined = undefined) {

    let page:tb.nMessageList = await messenger.mailTabs.getSelectedMessages(tabId);
    
    if (page != null) { // != tests if not null nor undefined; !== will test only null (or undefined)
        for (let message of page.messages) {
            yield message;
        }
    }
  
    while ((page  != null) && (page.id != null)) {
        page = await messenger.messages.continueList(page.id);
        if (page != null) {
            for (let message of page.messages) {
                yield message;
            }
        }
    }

}



// Retrieve all messages in a folder
// Return [MessageHeader] an array with all messages in tabId
public static async *LoadAllMessages(tabId:number|undefined = undefined) {

    const tabs:tb.mailTab[]|null = await messenger.mailTabs.query({windowId: tabId});
    const folder:tb.uMailFolder  = tabs?.at(0)?.displayedFolder;

    if (folder != null) {

        let page:tb.nMessageList = await messenger.messages.list(folder);
    
        if (page != null) { // != tests if not null nor undefined; !== will test only null (or undefined)
            for (let message of page.messages) {
                yield message;
            }
        }
    
        while ((page != null) && (page.id != null)) {
            page = await messenger.messages.continueList(page.id);
            if (page !=null) {
                for (let message of page.messages) {
                    yield message;
                }
            }
        }
    }

}



}; // End of export object "exTbMessages"


