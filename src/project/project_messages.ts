/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023  
 * ---------------------------------------------------------------------------
 *  project_messages.ts
 * ---------------------------------------------------------------------------
 *
 * Versions:
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

        public readonly mailsOfTabId: ex.uNumber
        public readonly answerTo: ex.uNumber

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

        public readonly mailsOfTabId: ex.uNumber
        public readonly selectedOnly: boolean
        public readonly answerTo: ex.uNumber

        constructor (params: {
                        sentBy: string
                        answerTo: ex.uNumber
                        mailsOfTabId: ex.uNumber
                        selectedOnly: boolean
                        messageId: string }) {
                            super({
                                name: exMessageNameInitWelcomeArchiveWithTab,
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

        public readonly mailsOfTabId: ex.uNumber
        public readonly selectedOnly: boolean
        public readonly messageHeaders: exTb.AMessageHeader

        constructor (params: {
                        sentBy: string
                        mailsOfTabId: ex.uNumber
                        selectedOnly: boolean
                        messageHeaders: exTb.AMessageHeader
                        messageId: string }) {
                            super({
                                name: exMessageNameInitWelcomeArchiveWithTab,
                                sentBy: params.sentBy,
                                messageId: params.messageId
                            })
                            this.mailsOfTabId = params.mailsOfTabId
                            this.selectedOnly = params.selectedOnly
                            this.messageHeaders = params.messageHeaders
                    }

    }
    export const exMessageNameMailHeadersLoaded: exMessageName = 'mailHeadersLoaded'
