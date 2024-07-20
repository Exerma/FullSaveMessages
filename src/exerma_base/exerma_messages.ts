/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023-2024
 * ---------------------------------------------------------------------------
 *  exerma_messages.js
 * ---------------------------------------------------------------------------
 *
 * This file describe our standard runtime.sendMessage and runtime.onMessage
 * listener management.
 * 
 * All our messages sent are inheriting from CMessage. This allows the use of
 * the "if (request instanceof CMessage)" to select only the good messages. Then 
 * specific requests are identified using the "if (request instanceof CMyMessage)"
 * identification (we also use unique names in the "name" member of the message
 * if prefered).
 * 
 * Typical message implementation:
 * 
        **
        * Implements the message used to initialize a "welcome_archives.html" page
        * with messages of the correct tablId
        *
        export class CMessageInitWelcomeArchiveWithTab extends CMessage {
 
            public readonly fromTabId: ex.uNumber
 
            constructor (
                        sentBy: string,
                        fromTabId: ex.uNumber,
                        messageId: string = cNullString) {
  
                            super(exMessageNameInitWelcomeArchiveWithTab,
                                sentBy,
                                messageId)
  
                            this.fromTabId = fromTabId
  
                        }
 
        }
        // This is the unique name of this message: can be used to compare
        // if (request.name === exMessageNameInitWelcomeArchiveWithTab) ...
        export const exMessageNameInitWelcomeArchiveWithTab: exMessageName = 'initWelcomeArchiveWithTab'
 *  
 * 
 * Typical dispatcher implementation:
 * 
 * 
 *
     **
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
     * @param {messenger.runtime.MessageSender} sender is the caller object
     * @param {() => void} sendResponse is a callback function to return the answer with,
     *             but the best practice is to return **synchronously** a Promise object
     *             or return false if the message is not handled:
     * @returns {DispatcherReturnType} is a premise if the message was processed, 
     *             and is false if the message was not handled
     *
    export function projectDispatcher (request: any, 
                                       sender: messenger.runtime.MessageSender, 
                                       sendResponse: () => void): DispatcherReturnType {

        const cSourceName = 'project/project_dispatcher.ts/projectDispatcher'

        try {
    
            if (request instanceof CMessageLoadMailHeaders) {
                    
                    // Main process starts initialisation
                    log().debugInfo(cSourceName, 'Message received: ' + request.name)
                    void loadFromTab({
                                        tabId: request.fromTabId,
                                        selectedOnly: request.selectedOnly
                                    })    // an "async" function returning a Promise
            }
        
            // Message not handled
            return false
    
        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

            // Message not handled
            return false

        }
    }

 * 
 * 
 * Versions:
 *   2024-06-17: Add: Improve the CMessageGetState example with a "dummy" specific parameter
 *   2023-08-27: First version
 * 
 */

    // --------------- Imports
    import { cNullString }           from './exerma_consts'
    import { CClass, isCClass }                from './exerma_types'
    import log, { cInfoStarted, cRaiseUnexpected } from './exerma_log'

    // --------------- Types
    export type exMessageName = string

    /**
     * This is *our* standard return type for runtime.onMessage() listener (we call it
     * "dispatcher"). We choose to always return "false" for unhandled message and a
     * Promise<any> for handled messages
     */
    // export type DispatcherReturnType = Promise<any> | false
    export type DispatcherReturnType = boolean

    // --------------- Classes
    /**
     * Exerma messages are always made of:
     * @param {string} name it the name of the message (which is unique in the application 
     *             through the exMessageNames namespace)
     * @param {string} sentBy is the name of the sender (typically the cSourceName const) 
     *             which allow differenciated response
     * @param {string} messageId is an optional unique message identifier (per caller)
     *             allowing to uniquely associate the returned message. This ID can be used
     *             in the response to create a kind of conversation
     * Data have to be message specific
     */
    export class CMessage extends CClass {

        // Extends CClass
        static readonly CClassType: string = 'CMessage'
        static readonly CClassHeritage: string[] = [...CClass.CClassHeritage, CMessage.CClassType]
        public readonly classHeritage: string[] = CMessage.CClassHeritage

        // Message minimum members
        readonly name: exMessageName
        readonly sentBy: string
        readonly messageId: string

        constructor (params: {
                        name: exMessageName
                        sentBy: string
                        messageId: string }) {
                            super()
                            this.name = params.name
                            this.sentBy = params.sentBy
                            this.messageId = params.messageId
                        }
        
    }
    


    /**
     * Example of a message used to require the state of the application
     * (see exerma_states.ts)
     * Note: Unique name of this message is defined after the class
     */
    export class CMessageGetState extends CMessage {

        // Extends CClass
        static readonly CClassType: string = 'CMessageGetState'
        static readonly CClassHeritage: string[] = [...CMessage.CClassHeritage, CMessageGetState.CClassType]
        public readonly classHeritage: string[] = CMessageGetState.CClassHeritage

        // Class members
        public readonly dummy: string

        /**
         * A message used to requires the state of the application
         * @param {object} params is the list of parameters to provide to this class
         * @param {string} params.sentBy is the name of the function requiring the stat
         * @param {string} params.messageId is the UID of the message (to identify it uniquely)
         * @param {string} params.dummy is a dummy parameter as example
         */
        constructor (params: {
                        sentBy: string           // CMessage
                        messageId: string        // CMessage
                        dummy: string            // First specific parameters (example)
                        }) {
                            super({
                                name: exMessageNameGetState,
                                sentBy: params.sentBy,
                                messageId: params.messageId
                            })
                            this.dummy = params.dummy
                    }

    }
    export const exMessageNameGetState: exMessageName = 'getState'



    /**
     * Check if the provided "request-candidate" has the same name than the requires
     * message name
     * @param {any}    request is the object to check if it is a message with the required name
     * @param {string} classType is the static CClassType value of the class to test against.
     *                  Default is to check if a CMessage descendant but it is possible (and 
     *                  advised) to check for a specific message constant.
     * @returns {boolean} is true if the request has the required name, false if not
     *                  (including if the request is not an object or doesn't have a name) 
     */
    export function isCMessage (request: any, classType: string = CClass.CClassType): boolean {

        const cSourceName = 'exerma_base/exerma_message.ts/isCMessage'

        log().trace(cSourceName, cInfoStarted)
        
        try {
            
            return isCClass(request, classType)

        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
            return false

        }

    }
