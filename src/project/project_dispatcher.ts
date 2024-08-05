/**
 * ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023
 * ---------------------------------------------------------------------------
 *  project_dispatcher.ts
 * ---------------------------------------------------------------------------
 *
 * Versions:
 *   2024-08-05: Upd: Rename exfilterEMails() into exfiltrateEmails()
 *   2024-07-29: Add: Add saveAttachments parameter in CMessageExfilterMails
 *   2023-09-11: First version
 *
 */
    // --------------- Imports
    import log, { cInfoStarted, cRaiseUnexpected } from '../exerma_base/exerma_log'
    import type * as exTb from '../exerma_tb/exerma_tb_types'
    import { type DispatcherReturnType, type CMessage, isCMessage } from '../exerma_base/exerma_messages'
    import { CMessageExfiltrateEmails, CMessageLoadMailHeaders, CMessageInitWelcomeArchiveWithTab } from './project_messages'
    import { loadMailsOfTabAndSendResult, exfiltrateEmails } from './project_main'
    import { isCClass } from '../exerma_base/exerma_types'

    // --------------- Functions
    /**
     * Catch and dispatch messages in the main thread. This is usefull as content script 
     * and service workers have no access to the MailTabs and main window.
     * 
     * IMPORTANT: DON'T MAKE THIS LISTENER "async": return an "async" function (aka a 
     *            Promise) if it is not possible to return synchronously
     * 
     * It currently manage the following messages (defined in project_messages):
     * - exMessageNameLoadMailHeaders: to load all mail headers from a MailTab
     *             and return them in a MessageHeader[] array                  
     * @param {any} request is the received message we have to answer to (or not)
     * @param {object.runtime.MessageSender} sender is the caller object
     * @param {() => void} sendResponse is a callback function to return the answer with,
     *             but the best practice is to return **synchronously** a Promise object
     *             or return false if the message is not handled:
     * @returns {DispatcherReturnType} is a premise if the message was processed, 
     *             and is false if the message was not handled
     */
    export function projectDispatcher (request: any,
                                       sender: messenger.runtime.MessageSender,
                                       sendResponse: () => void): DispatcherReturnType {

        const cSourceName = 'project/project_dispatcher.ts/projectDispatcher'

        log().trace(cSourceName, cInfoStarted)

        try {
    
            if (isCMessage(request)) {
            
                log().debugInfo(cSourceName, 'Message name: ' + (request as CMessage).name)
            
            }

            if (isCClass(request, CMessageLoadMailHeaders.CClassType)) {
                    
                // Main process starts initialisation
                log().debugInfo(cSourceName, 'Message received: ' + request.name)
                void loadMailsOfTabAndSendResult(request)
                sendResponse()
                return true

            }


            if (isCClass(request, CMessageExfiltrateEmails.CClassType)) {
                    
                const message: CMessageExfiltrateEmails = (request as CMessageExfiltrateEmails)
                // The welcome archives has finished to calculate the filenames
                log().debugInfo(cSourceName, 'Message received: ' + request.name)
                void exfiltrateEmails({
                                    mailsHeaders: message.mailsHeaders,
                                    mailsOfTabId: message.mailsOfTabId,
                                    selectedOnly: message.selectedOnly,
                                    targetDirectory: message.targetDirectory,
                                    mailsSubjects: message.mailsSubjects,
                                    mailsSenders: message.mailsSenders,
                                    saveAttachments: message.saveAttachments
                                    })
                sendResponse()
                return true

            }

            // Message not handled
            return false
    
        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

            // Message not handled
            return false

        }

    }
