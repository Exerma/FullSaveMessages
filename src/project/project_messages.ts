/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023  
 * ---------------------------------------------------------------------------
 *  project_messages.ts
 * ---------------------------------------------------------------------------
 *
 * Versions:
 *   2023-09-23: Chg: Make CMessage inheriting of exerma_base CClass
 *   2023-09-10: Add: My first message: exMessageNameInitWithTab
 *   2023-08-27: First version
 * 
 */

    // ---------- Imports
    import type * as ex                       from '../exerma_base/exerma_types'
    import type * as exTb                     from '../exerma_tb/exerma_tb_types'
    import { cNullString }                    from '../exerma_base/exerma_consts'
    import { CMessage, type exMessageName }   from '../exerma_base/exerma_messages'


    // ---------- Extend list of available messages

    /**
     * Implements the message used to initialize a "welcome_archives.html" page
     * with messages of the correct tablId
     */
    export class CMessageInitWelcomeArchiveWithTab extends CMessage {

        // Extends CClass
        static readonly CClassType: string = 'CMessageInitWelcomeArchiveWithTab'
        static readonly CClassHeritage: string[] = [...CMessage.CClassHeritage, CMessageInitWelcomeArchiveWithTab.CClassType]
        public readonly classHeritage: string[] = CMessageInitWelcomeArchiveWithTab.CClassHeritage


        // Local members
        public readonly mailsOfTabId: ex.uNumber
        public readonly answerTo: ex.uNumber

        /**
         * Create the message used to Init the archive welcome popup
         * @param {object}     params are the required parameters of the message
         * @param {string}     params.sentBy is the cSourceName of the caller
         * @param {ex.uNumber} params.answerTo is the window.id to send the
         *              response to
         * @param {ex.uNumber} params.mailsOfTabId is the id of the mail tab to
         *              load the mails of (current tab if undefined)
         * @param {string}     params.messageId is a unique message ID to propagate to 
         *              identify the response message (creating a conversation)
         */
        constructor (params: {
                        sentBy: string
                        mailsOfTabId: ex.uNumber
                        answerTo: ex.uNumber
                        messageId: string }) {
                            super({
                                name: exMessageNameInitWelcomeArchiveWithTab,
                                sentBy: params.sentBy,
                                messageId: params.messageId
                            })
                            this.answerTo = params.answerTo
                            this.mailsOfTabId = params.mailsOfTabId
                    }

    }
    export const exMessageNameInitWelcomeArchiveWithTab: exMessageName = 'initWelcomeArchiveWithTab'



    /**
     * Implements the message used to load the eMails of the provided MailTab ID
     * (only currently selected message or all messages)
     */
    export class CMessageLoadMailHeaders extends CMessage {

        // Extends CClass
        static readonly CClassType: string = 'CMessageLoadMailHeaders'
        static readonly CClassHeritage: string[] = [...CMessage.CClassHeritage, CMessageLoadMailHeaders.CClassType]
        public readonly classHeritage: string[] = CMessageLoadMailHeaders.CClassHeritage

        // Class members
        public readonly mailsOfTabId: ex.uNumber
        public readonly selectedOnly: boolean
        public readonly answerTo: ex.uNumber

        /**
         * Create the message used to load headers of all (or selected) messages
         * of the provided mailTab
         * @param {object}     params are the required parameters of the message
         * @param {string}     params.sentBy is the cSourceName of the caller
         * @param {ex.uNumber} params.answerTo is the window.id to send the
         *              response to
         * @param {ex.uNumber} params.mailsOfTabId is the id of the mail tab to
         *              load the mails of (current tab if undefined)
         * @param {boolean}    params.selectedOnly is used to load only the selected
         *              messages (if true) or all messages (if false)
         * @param {string}     params.messageId is a unique message ID to propagate to 
         *              identify the response message (creating a conversation)
         */
        constructor (params: {
                        sentBy: string
                        answerTo: ex.uNumber
                        mailsOfTabId: ex.uNumber
                        selectedOnly: boolean
                        messageId: string }) {
                            super({
                                name: exMessageNameLoadMailHeaders,
                                sentBy: params.sentBy,
                                messageId: params.messageId
                            })
                            this.answerTo = params.answerTo
                            this.mailsOfTabId = params.mailsOfTabId
                            this.selectedOnly = params.selectedOnly
                    }

    }
    export const exMessageNameLoadMailHeaders: exMessageName = 'loadMailHeaders'


    /**
     * Implements the message used to return the list of loaded eMail headers of 
     * the provided MailTab ID (only currently selected message or all messages)
     */
    export class CMessageMailHeadersLoaded extends CMessage {

        // Extends CClass
        static readonly CClassType: string = 'CMessageMailHeadersLoaded'
        static readonly CClassHeritage: string[] = [...CMessage.CClassHeritage, CMessageMailHeadersLoaded.CClassType]
        public readonly classHeritage: string[] = CMessageMailHeadersLoaded.CClassHeritage

        // Class members
        public readonly mailsOfTabId: ex.uNumber
        public readonly selectedOnly: boolean
        public readonly messageHeaders: exTb.AMessageHeader

        /**
         * Create the message used to return the loaded headers of all (or 
         * selected) messages of the provided mailTab
         * @param {object}     params are the required parameters of the message
         * @param {string}     params.sentBy is the cSourceName of the caller
         * @param {ex.uNumber} params.mailsOfTabId is the id of the mail tab the
         *              mails were loaded from (current tab if undefined)
         * @param {boolean}    params.selectedOnly is true if only the selected
         *              messages were loaded or false if all messages are returned
         * @param {exTb.AMessageHeader} params.messageHeaders is an array
         *              containing all the loaded message headers
         * @param {string}     params.messageId is the unique message ID received
         *              with initial CMessageLoadMailHeaders message to
         *              identify the response message (creating a conversation)
         */
        constructor (params: {
                        sentBy: string
                        mailsOfTabId: ex.uNumber
                        selectedOnly: boolean
                        messageHeaders: exTb.AMessageHeader
                        messageId: string }) {
                            super({
                                name: exMessageNameMailHeadersLoaded,
                                sentBy: params.sentBy,
                                messageId: params.messageId
                            })
                            this.mailsOfTabId = params.mailsOfTabId
                            this.selectedOnly = params.selectedOnly
                            this.messageHeaders = params.messageHeaders
                    }

    }
    export const exMessageNameMailHeadersLoaded: exMessageName = 'mailHeaderLoaded'
