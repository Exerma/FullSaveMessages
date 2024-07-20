/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023-2024
 * ---------------------------------------------------------------------------
 *  welcome_archives_dispatcher.ts
 * ---------------------------------------------------------------------------
 *
 * The welcome page for archives allows the user to modify cleaned list
 * of subjects to use as export files.
 * 
 * Versions:
 *   2024-06-17: Add: Manage save progress messages: CMessageSaveProgressInit and CMessageSaveProgressClose
 *   2023-09-22: First version
 * 
 */

    // --------------- Imports
    import log, { cRaiseUnexpected }             from '../exerma_base/exerma_log'
    import { isCClass }                          from '../exerma_base/exerma_types'
    import { createAndAddElement }               from '../exerma_base/exerma_dom'
    import {
            CMessageInitWelcomeArchiveWithTab,
            CMessageMailHeadersLoaded
            }                                    from '../project/project_messages'
    import {
            type DispatcherReturnType,
            isCMessage
            }                                    from '../exerma_base/exerma_messages'
    import {
            initWelcomeArchive,
            presentUniqueNamesToUser
            }                                    from './welcome_archives'
 

    // --------------- Dispatcher implementation

    // eslint-disable-next-line jsdoc/no-undefined-types
    /**
     * Catch and dispatch messages received by the welcome_archives content-script
     * https://developer.chrome.com/docs/extensions/mv3/messaging/
     * @param {any} request is the received message we have to answer to (or not)
     * @param {object.runtime.MessageSender} sender is the caller object
     * @param {() => void} sendResponse is a callback function to return the answer with,
     *             but the best practice is to return **synchronously** a Promise object
     *             or return false if the message is not handled
     * @returns {DispatcherReturnType} is a premise if the message was processed, 
     *             and is false if the message was not handled
     */
    export function welcomeArchivesDispatcher (request: any,
                                               sender: messenger.runtime.MessageSender,
                                               sendResponse: () => void): DispatcherReturnType {

        const cSourceName = 'pages/welcome_archives.ts/welcomeArchivesDispatcher'

        try {
                      
            if (isCClass(request, CMessageInitWelcomeArchiveWithTab.CClassType)) {
                
                // Main process starts initialisation
                log().debugInfo(cSourceName, 'Message received: ' + request.name)

                void initWelcomeArchive() // document is undefined
                sendResponse()
                return true

            }

            if (isCClass(request, CMessageMailHeadersLoaded.CClassType)) {
                
                const message: CMessageMailHeadersLoaded = (request as CMessageMailHeadersLoaded)

                // Main process starts initialisation
                log().debugInfo(cSourceName, 'Message received: ' + message.name)

                void presentUniqueNamesToUser(message.mailsHeaders,
                                              message.mailsOfTabId,
                                              message.selectedOnly)
                sendResponse()
                return true

            }

            // Message not managed
            return false

        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
            return false

        }

    }
