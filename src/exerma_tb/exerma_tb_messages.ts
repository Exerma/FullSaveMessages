/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023  
 * ---------------------------------------------------------------------------
 *  exerma_messages.js
 * ---------------------------------------------------------------------------
 * 
 * Versions:
 *   2023-08-20: Chg: Make this module an export class with static functions
 *   2023-07-17: First version
 * 
 */

    // --------------- Import
    import type * as ex from '../exerma_base/exerma_types'
    import type * as tb from '../exerma_tb/exerma_tb_types'
    

    // ============================================================================
    // Manage messages
    // ---------------------------------------------------------------------------
    // Source: https://webextension-api.thunderbird.net/en/latest/how-to/messageLists.html
    //
    // Example of use
    //
    // //let messages = listMessages(folder);
    // for await (let message of messages) {
    //  // Do something with the message.
    //  let full = await messenger.messages.getFull(message.id);
    // }
    //


    /**
     * Retrieve the selected messages in a folder
     * @param {ex.uNumber} tabId is the ID of the tab the caller want to retrive the mails of
     * @yields {AsyncGenerator<object.messages.MessageHeader>} is an array with 
     *             all currently selected messages
     */
    export async function * loadSelectedMails (tabId: ex.uNumber = undefined):
                                           AsyncGenerator<messenger.messages.MessageHeader> {

        try {

            let page: tb.nMailList = await messenger.mailTabs.getSelectedMessages(tabId)
            
            if (page != null) { // != tests if not null nor undefined; !== will test only null (or undefined)

                for (const message of page.messages) {

                    yield message

                }

            }
        
            while (page?.id  != null) {

                page = await messenger.messages.continueList(page.id)
                if (page != null) {

                    for (const message of page.messages) {

                        yield message

                    }

                }

            }

        } catch (error) {
            
        }

    }


    /**
     * Retrieve all messages in a folder
     * @param {ex.uNumber} tabId is the ID of the tab the caller want to retrive the mails of
     * @yields {AsyncGenerator<object.messages.MessageHeader>} is the list of all mails
     */
    // 
    // Return [MessageHeader] an array with all messages in tabId
    export async function * loadAllMails (tabId: ex.uNumber = undefined):
                                            AsyncGenerator<messenger.messages.MessageHeader>  {

        const tabs: tb.mailTab[] | null = await messenger.mailTabs.query({ windowId: tabId })
        const folder: tb.uMailFolder  = tabs?.at(0)?.displayedFolder

        if (folder != null) {

            let page: tb.nMailList = await messenger.messages.list(folder)
        
            if (page != null) { // != tests if not null nor undefined; !== will test only null (or undefined)

                for (const message of page.messages) {

                    yield message

                }

            }
        
            while (page?.id != null) {

                page = await messenger.messages.continueList(page.id)
                if (page != null) {

                    for (const message of page.messages) {

                        yield message

                    }

                }

            }

        }

    }

