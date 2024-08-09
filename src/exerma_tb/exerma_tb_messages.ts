/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023  
 * ---------------------------------------------------------------------------
 *  exerma_messages.js
 * ---------------------------------------------------------------------------
 * 
 * Versions:
 *   2024-08-09: Add: tbGetCurrentTabId()
 *               Chg: Refactor by replacing "tb" type prefix with "exTb"
 *               Chg: Refactor by prefixing export functions with "tb" code
 *   2023-12-22: Add: getMessagePartBody() and exploreMessagePartStructure()
 *   2023-08-20: Chg: Make this module an export class with static functions
 *   2023-07-17: First version
 * 
 */

    // --------------- Import
    import type * as ex from '../exerma_base/exerma_types'
    import type * as exTb from '../exerma_tb/exerma_tb_types'
    import { cInfoStarted, cRaiseUnexpected, log } from '../exerma_base/exerma_log'
    import { cNewLine } from '../exerma_base/exerma_consts'
    

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
    async function * tbLoadSelectedMails (tabId: ex.uNumber = undefined):
                                                  AsyncGenerator<messenger.messages.MessageHeader> {

        const cSourceName = 'exerma_tb/exerma_tb_messages.ts/tbLoadSelectedMails'

        try {

            let page: exTb.nMailList = await messenger.mailTabs.getSelectedMessages(tabId)
            
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
    async function * tbLoadAllMails (tabId: ex.uNumber = undefined):
                                                AsyncGenerator<messenger.messages.MessageHeader>  {

        const cSourceName = 'exerma_tb/exerma_tb_messages.ts/tbLoadAllMails'

        const tabs: exTb.mailTab[] | null = await messenger.mailTabs.query({ windowId: tabId })
        const folder: exTb.uMailFolder  = tabs?.at(0)?.displayedFolder

        if (folder != null) {

            let page: exTb.nMailList = await messenger.messages.list(folder)
        
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

    /**
     * # Load messages
     * 
     * Retrieve headers of messages belonging to the provided tab (clear previous data)
     * 
     * Versions: 23.02.2024
     * @param {object} options is used to provide additional options
     * @param {ex.uNumber} options.mailsOfTabId is the optional id of the tab to save & archive the 
     *             selected messages of
     * @param {boolean} options.selectedOnly is used to load only the selected messages of the
     *             tabs (if true) of all messages of the tab (if false, default)
     * @returns {Promise<boolean>} is true if success, false if an error occurs
     */
    export async function tbLoadMessagesOfTab (options?: {
                                                mailsOfTabId?: ex.uNumber
                                                selectedOnly?: boolean
                                            }): Promise<exTb.AMailHeader> {

        const cSourceName: string = 'project/exerma_tb_messages.ts/tbLoadMessagesOfTab'

        log().trace(cSourceName, cInfoStarted)

        // // Ask for destination directory
        // log().debugInfo(cSourceName, 'Ask directory to user')
        // let targetFolder: FileSystemDirectoryHandle
        // try {

        //     targetFolder = await showDirectoryPicker()

        // } catch (error) { return await Promise.resolve(false) }

        // log().debugInfo(cSourceName, 'Directory is ' + targetFolder.name)

        const success: boolean = true
        const result: exTb.AMailHeader = []

        try {

            // Load messages by chunks (about 100 per chunk)
            log().debugInfo(cSourceName, 'selectedOnly=' + (options?.selectedOnly ?? 'undefined') + '  mailsOfTabIt=' + (options?.mailsOfTabId ?? 'undefined'))
            const selection = ( (options?.selectedOnly === true)
                                ? tbLoadSelectedMails(options?.mailsOfTabId)
                                : tbLoadAllMails(options?.mailsOfTabId))
            for await (const messageHeader of selection) {
        
                log().debugInfo(cSourceName, messageHeader.subject)

                result.push(messageHeader)

            }

            // Happy end
            return result

        } catch (error) {
            
            // An error occurs
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
            return []

        }

    }

    /**
     * Search for the first part containing the provided type of data
     * @param {object} messagePart is the MessagePart object to retrieve the body of 
     * @param {string} searchType is the kind of body the function has to return
     * @param {object} options are the optional parameters
     * @param {boolean} options.isRecurse is used to not show the trace information (if true)
     * @param {string} options.ifNotFound is the value to return if no content was found
     *                  matching the required type of data (default = '')
     * @param {string} options.ifError is the value to return if an error occurs (default = '')  
     * @returns {string} is the found body, is ifNotFound if nothing found and ifError if an error occurs
     */
    export function tbGetMessagePartBody (messagePart: messenger.messages.MessagePart,
                                        searchType: string = 'text/html',
                                        options?: {
                                            isRecurse?: boolean
                                            ifNotFound?: string
                                            ifError?: string
                                        }): string {

        const cSourceName = 'exerma_tb/exerma_tb_messages.ts/tbGetMessagePartBody'
        
        if (options?.isRecurse !== true) {
            log().trace(cSourceName, cInfoStarted)
        }

        try {

            if (   (messagePart.contentType !== undefined)
                && (messagePart.contentType.replaceAll(' ', '') === searchType.replaceAll(' ', ''))) {

                return messagePart?.body ?? ''

            }

            // Search sub-parts if not in this one
            let result = ''
            messagePart.parts?.every(subPart => {
                result = tbGetMessagePartBody(subPart,
                                            searchType, {
                                              isRecurse: true,
                                              ifNotFound: '',
                                              ifError: options?.ifError ?? ''
                                            })
                return (result === '')  // Continue as long as the result is empty
            })

            return ((result !== '') ? result : options?.ifNotFound ?? '')

        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
            return (options?.ifError ?? '')

        }

    }

    /**
     * # Extract date of message header
     * @param {object.messages.MessageHeader} header is the header to extract the date of
     * @returns {Date|undefined} is the date of the message or undefined if the header
     *                       is invalid or if an error occurs     
     */
    export function tbGetMessageDate (header: messenger.messages.MessageHeader): ex.uDate {

        const cSourceName = 'exerma_tb/exerma_tb_messages.ts/tbGetMessageDate'

         try {
            
            const result: Date = ( (typeof header.date === 'number')
                                 ? (header.date as unknown) as Date
                                 : (new Date(Date.parse(header.date as string))) )
            return result

        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
        }

        return undefined

    }

    /**
     * Explore the MessagePart structure to show her content
     * @param {object} messagePart is the MessagePart object to retrieve the body of 
     * @param {number} margin is the left-margin to use during structure exploration
     * @returns {string} is the messagePart structure with some information as an html string
     */
    export function tbExploreMessagePartStructure (messagePart: messenger.messages.MessagePart,
                                                 margin: number = 0): string {

        const cSourceName = 'exerma_tb/exerma_tb_messages.ts/tbExploreMessagePartStructure'
            
        let result = '<p style="margin-left: ' + margin + 'px;">'
                   + 'Type: ' + (messagePart.contentType ?? '(not defined)') + '<br />'
                   + 'Name: ' + (messagePart.name ?? '(not defined)') + '<br />'
                   + 'Part: ' + (messagePart.partName ?? '(not defined)') + '<br />'
                   + 'Sub-parts: ' + (messagePart.parts?.length) + '<br />'
                   + 'Body: ' + (messagePart.body ?? '(not defined)')
                   + '</p>'
                   + cNewLine
        if (messagePart.parts !== undefined) {
            messagePart.parts.forEach(recursePart => {
                result += tbExploreMessagePartStructure(recursePart, (margin + 15))
            })
        }

        return result

    }

    /**
     * Retrieve the ID of the currently active Thunderbird tab
     * @returns {number | undefined} is the currently selected tab in ThunderBird or undefined
     */
    export async function tbGetCurrentTabId (): Promise<ex.uNumber> {

        const cSourceName = 'exerma_tb/exerma_tb_messages.ts/tbGetCurrentTabId'

        try {

            const tabs = await messenger.mailTabs.query( { active: true, currentWindow: true } )
            const activeTab: exTb.uMailTab = tabs?.at(0)
            const tabId = activeTab?.tabId
            return tabId
    
        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
            return undefined

        }

    }
