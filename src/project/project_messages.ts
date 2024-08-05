/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023-2024  
 * ---------------------------------------------------------------------------
 *  project_messages.ts
 * ---------------------------------------------------------------------------
 *
 * (welcome_archives)   <---> (--------Main--------)  <--->  (action_popup)
 *   
 *                            onArchiveButtonClick( ) <----- [click]
 *                            |
 *                            +--> initWelcomePage(▿)
 *                                                 |
 *                                 [create window] |
 *  onLoad->start()   <----------------------------+ 
 *  |
 *  |[CMessageLoadMailHeaders]
 *  +----------------------> (dispatcher)
 *                           loadMailsOfTabAndSendResult()
 *                           |
 *                           +---loadMessagesOfTab(▿)
 *                                                 |
 *                     [CMessageMailHeadersLoaded] |
 *  (dispatcher) <---------------------------------+
 *  presentUniqueNamesToUser() 
 *  
 *  
 *  [click on continue]
 *  |
 *  
 * 
 * Versions:
 *   2024-08-05: Upd: Rename CMessageExfilterMails() into CMessageExfiltrateEmails()
 *   2024-07-29: Add: Add saveAttachments parameter to CMessageExfilterMails message
 *   2024-07-20: Mov: Progress messages are moves to exerme_base/progress/exerma_progress_messages.ts
 *   2024-06-17: Add: Messages to show progress to the user: CMessageSaveProgressInit, CMessageSaveProgressClose
 *   2023-10-22: Rem: Show main flow of the addon in comment showing messages and calls
 *               Add: Add selectedOnly parameter to CMessageExfilterMails
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
         * @param {string}     params.messageId is a unique message ID to propagate to 
         *              identify the response message (creating a conversation)
         * @param {ex.uNumber} params.answerTo is the window.id to send the
         *              response to
         * @param {ex.uNumber} params.mailsOfTabId is the id of the mail tab to
         *              load the mails of (current tab if undefined)
         */
        constructor (params: {
                        sentBy: string
                        messageId: string
                        mailsOfTabId: ex.uNumber
                        answerTo: ex.uNumber }) {
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
     * (only currently selected message or all messages).
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
         * @param {string}     params.messageId is a unique message ID to propagate to 
         *              identify the response message (creating a conversation)
         * @param {ex.uNumber} params.answerTo is the window.id to send the
         *              response to
         * @param {ex.uNumber} params.mailsOfTabId is the id of the mail tab to
         *              load the mails of (current tab if undefined)
         * @param {boolean}    params.selectedOnly is used to load only the selected
         *              messages (if true) or all messages (if false)
         */
        constructor (params: {
                        sentBy: string
                        messageId: string
                        answerTo: ex.uNumber
                        mailsOfTabId: ex.uNumber
                        selectedOnly: boolean }) {
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
        public readonly mailsHeaders: exTb.AMailHeader

        /**
         * Create the message used to return the loaded headers of all (or 
         * selected) messages of the provided mailTab
         * @param {object}     params are the required parameters of the message
         * @param {string}     params.sentBy is the cSourceName of the caller
         * @param {string}     params.messageId is the unique message ID received
         *              with initial CMessageLoadMailHeaders message to
         *              identify the response message (creating a conversation)
         * @param {ex.uNumber} params.mailsOfTabId is the id of the mail tab the
         *              mails were loaded from (current tab if undefined)
         * @param {boolean}    params.selectedOnly is true if only the selected
         *              messages were loaded or false if all messages are returned
         * @param {exTb.AMailHeader} params.mailsHeaders is an array
         *              containing all the loaded message headers
         */
        constructor (params: {
                        sentBy: string                // CMessage
                        messageId: string             // CMessage
                        mailsOfTabId: ex.uNumber
                        selectedOnly: boolean
                        mailsHeaders: exTb.AMailHeader }) {
                            super({
                                name: exMessageNameMailHeadersLoaded,
                                sentBy: params.sentBy,
                                messageId: params.messageId
                            })
                            this.mailsOfTabId = params.mailsOfTabId
                            this.selectedOnly = params.selectedOnly
                            this.mailsHeaders = params.mailsHeaders
                    }

    }
    export const exMessageNameMailHeadersLoaded: exMessageName = 'mailHeaderLoaded'


    /**
     * Implements the message used to return the list of loaded eMail headers of 
     * the provided MailTab ID (only currently selected message or all messages)
     */
    export class CMessageExfiltrateEmails extends CMessage {

        // Extends CClass
        static readonly CClassType: string = 'CMessageExfiltrateEmails'
        static readonly CClassHeritage: string[] = [...CMessage.CClassHeritage, CMessageExfiltrateEmails.CClassType]
        public readonly classHeritage: string[] = CMessageExfiltrateEmails.CClassHeritage

        // Class members
        public readonly mailsOfTabId: ex.uNumber
        public readonly selectedOnly: boolean
        public readonly mailsHeaders: exTb.AMailHeader
        public readonly mailsSubjects: ex.MNumberString  // <mailId; subject to use>
        public readonly mailsSenders: ex.MNumberString   // <mailId; sender to use>
        public readonly targetDirectory: string
        public readonly saveAttachments: boolean

        /**
         * Create the message used to return the loaded headers of all (or 
         * selected) messages of the provided mailTab
         * @param {object}     params are the required parameters of the message
         * @param {string}     params.sentBy is the cSourceName of the caller
         * @param {string}     params.messageId is the unique message ID received
         *              with initial CMessageLoadMailHeaders message to
         *              identify the response message (creating a conversation)
         * @param {ex.uNumber} params.mailsOfTabId is the id of the mail tab the
         *              mails were loaded from (current tab if undefined)
         * @param {boolean}    params.selectedOnly is true if only the selected mails
         *              have to be saved, false if all emails have to be exfiltered 
         * @param {exTb.AMailHeader} params.mailsHeaders is the array with the mail
         *              header of every email to exfilter.
         * @param {ex.MNumberString} params.mailsSubjects is a Map containing the
         *              email subject to use to save each mail: <mailId, mail subject>
         * @param {ex.MNumberString} params.mailsSenders is a Map containing the
         *              email sender to use to save each mail: <mailId, sender name>
         * @param {string} params.targetDirectory is the target directory to save
         *              the files in
         * @param {boolean} params.saveAttachments is used to save attachement (if true)
         */
        constructor (params: {
                        sentBy: string                // CMessage
                        messageId: string             // CMessage
                        mailsOfTabId: ex.uNumber
                        selectedOnly: boolean
                        mailsHeaders: exTb.AMailHeader
                        mailsSubjects: ex.MNumberString
                        mailsSenders: ex.MNumberString
                        targetDirectory: string
                        saveAttachments: boolean
                        }) {
                            super({
                                name: exMessageNameExfiltrateEmails,
                                sentBy: params.sentBy,
                                messageId: params.messageId
                            })
                            this.mailsOfTabId = params.mailsOfTabId
                            this.selectedOnly = params.selectedOnly
                            this.mailsHeaders = params.mailsHeaders
                            this.mailsSubjects = params.mailsSubjects
                            this.mailsSenders = params.mailsSenders
                            this.targetDirectory = params.targetDirectory
                            this.saveAttachments = params.saveAttachments
                    }

    }
    export const exMessageNameExfiltrateEmails: exMessageName = 'exfiltrateEmails'


