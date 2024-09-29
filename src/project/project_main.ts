/**
 * ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023
 * ---------------------------------------------------------------------------
 *  project_main.ts
 * ---------------------------------------------------------------------------
 *
 * Versions:
 *   2024-08-09: Add: Implement onSaveAttachButtonClick()
 *   2024-08-09: Chg: Allow caller of exfitrateEmails() and exfitrateEmail() to choose to save EML, PDF and HTML files or not
 *   2024-08-05: Add: Catch errors when retrieving attachments in ExfiltrateEmail()
 *   2024-07-29: Add: Save attachments
 *   2024-06-15: Add: Add rule to remove opening and closing double quotes in cleanPersonsWithRules()
 *               Add: Use asyncSavePdf to choose if await every save file or use a global Promise in exfiltrateEmail()
 *   2024-06-08: Add: Avoid duplicate of file names in buildExfiltrationFilenames()
 *   2024-03-25: Chg: Save files one-by-one (using "await" for each) instead of acting in parallel
 *   2023-11-13: Add: Allow user to edit the sender name for export filename
 *   2023-08-21: Add: First implementation of
 *   2023-08-20: First version
 *
 */
    // --------------- Imports
    import type * as ex                          from '../exerma_base/exerma_types'
    import type * as exTb                        from '../exerma_tb/exerma_tb_types'
    import log, { cRaiseUnexpected, cInfoStarted } from '../exerma_base/exerma_log'
    import {
                tbGetMessageDate,
                tbLoadMessagesOfTab,
                tbGetCurrentTabId
            }                                    from '../exerma_tb/exerma_tb_messages'
    import { saveBlob }                          from '../exerma_tb/exerma_tb_misc'
    import { createPdf }                         from '../exerma_tb/exerma_tb_pdf'
    import {
                datetimeToFieldReplacement,
                datetimeToStringTag,
                fieldReplacement,
                stringMakeUnique
            }                                    from '../exerma_base/exerma_misc'
    import {
                type CMessageLoadMailHeaders,
                CMessageMailHeadersLoaded,
                CMessageExfiltrateEmails
            }                                    from './project_messages'
    import { ProjectStorage }                    from './project_storage'
    import {
                cLastInFolder1,
                cLastInFolder2,
                cNullString
            }                                    from '../exerma_base/exerma_consts'
    import {
                buildFullname,
                cleanFilename,
                extractFilename
            }                                    from '../exerma_base/exerma_files'
    import { exLangFuture }                      from '../exerma_base/exerma_lang'


    // --------------- Consts
    export const cPopupBody:             string = 'popupBody'
    export const cPopupArchiveButton:    string = 'cmdArchive'
    export const cPopupSaveAttachButton: string = 'cmdSaveAttachment'
    export const cPopupTestButton:       string = 'cmdTest'
    export const cAddinVersionId:        string = 'AddinVersion'
    export const cAddinVersion:          string = '1.5.1'


    // --------------- Types
    interface NameCleaningRule {
                                rule: RegExp | string
                                result: string
                               }
    type ANameCleaningRules = NameCleaningRule[]


    // ---------- Consts related to resources
    // ----- PDF template
    const cResourcePdfTemplate: string   = './pdf_template.html'
    const cHtmlPdfTemplateSubjectId: string = 'subject'
    const cHtmlPdfTemplateSenderId: string  = 'sender'
    const cHtmlPdfTemplateDateId: string    = 'date'
    const cHtmlPdfTemplateCcId: string      = 'cc'


    // ----- Popup page for archiving
    const cResourcePopArchives: string   = './welcome_archives.html'


    // --------------- Private types
    export interface SubjectCleaningParams {

        replacements: RegExp[]

    }

    // --------------- Functions

    const cStorageCurrentMailTabId: string = 'currentMailTabId'
    /**
     * Save the current mailTab.tablId in session storage
     */
    export async function storeCurrentMailTabId (): Promise<void> {

        const cSourceName = 'project/project_main.ts/storeCurrentMailTabId'

        // Save current tabId to manage the emails of
        const currentTabId = await tbGetCurrentTabId()
        void await messenger.storage.session.set({ name: cStorageCurrentMailTabId, header: currentTabId })

    }

    // /**
    //  * Retrieve the current mailTab.tablId from session storage
    //  * 
    //  * Versions: 23.02.2024
    //  * @returns {Promise<ex.uNumber>} is the last header stored with storeCurrentMailTabId()
    //  */
    // export async function unstoreCurrentMailTabId (): Promise<ex.uNumber> {

    //     // Save current tabId to manage the emails of
    //     const loaded: object | undefined = await messenger.storage.session.get(cStorageCurrentMailTabId)
    //     const result: ex.uNumber = (loaded as { name: string, header: number } | undefined)?.header
    //     return await Promise.resolve(result)
        

    // }




    /**
     * # Archive selected files
     * 
     * Versions: 23.02.2024
     * @param {Event} event is the 'click' event firing this event handler
     */
    export function onActionButtonClick (event: Event): void {

        const cSourceName = 'project/project_main.ts/onActionButtonClick'

        log().trace(cSourceName, 'User has clicked the main button')

    }



    /**
     * # Handle click on "Archive"
     * 
     * User has clicked the "Archive" button from the action popup window
     * 
     * Versions: 23.02.2024
     * @param {Event} event is the 'click' event firing this event handler
     */
    export async function onArchiveButtonClick (event: Event): Promise<void> {

        console.log('User has clicked the archive button')

        // Force background.js to awake and init (or it will fail receiving the first message 
        // from welcome_archives)
        void messenger.runtime.sendMessage('dummy')

        // Start welcome_archive page
        await initWelcomePage()

        // window.close()

    }



    /**
     * # Handle click on "Save attachments"
     * 
     * User has clicked the "Save attachment" button from the action popup window
     * 
     * Versions: 23.02.2024
     * @param {Event} event is the 'click' event firing this event handler
     */
    export async function onSaveAttachButtonClick (event: Event): Promise<void> {

        const cSourceName = 'project/project_main.ts/onSaveAttachButtonClick'

        console.log('User has clicked the save attachment button')

        // Force background.js to awake and init (or it will fail receiving the first message 
        // from welcome_archives)
        void messenger.runtime.sendMessage('dummy')

        // Get messages to save the attachments of
        const currentTabId = await tbGetCurrentTabId()
        const headers = await tbLoadMessagesOfTab({ mailsOfTabId: currentTabId, selectedOnly: true })

        // Direct exfiltration of attachments
        void messenger.runtime.sendMessage(new CMessageExfiltrateEmails({
                                                    sentBy: cSourceName,
                                                    messageId: cSourceName,
                                                    mailsOfTabId: currentTabId,
                                                    selectedOnly: true,
                                                    mailsHeaders: headers,
                                                    mailsSubjects: new Map<number, string>(),
                                                    mailsSenders: new Map<number, string>(),
                                                    targetDirectory: cNullString,
                                                    saveEml: false,
                                                    savePdf: false,
                                                    saveHtml: false,
                                                    saveAttachments: true
                                                }))
        
        window.close()

    }

    /**
     * # Handle click on test button
     * 
     * User has clicked the "Test" button from the action popup window
     * 
     * Versions: 23.02.2024
     * @param {Event} event is the 'click' event firing this event handler
     */
    export async function onTestButtonClick (event: Event): Promise<void> {

        const cSourceName = 'project/project_main.ts/onTestButtonClick'

        try {

            console.log(cSourceName + 'User has clicked the test button')

        } catch (error) {

            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }

    }

    /**
     * # Save the selected messages in EML and PDF formats
     * 
     * About sending messages:
     * - https://developer.chrome.com/docs/extensions/mv3/messaging/
     * 
     * Versions: 09.06.2024, 23.02.2024
     * @returns {Promise<boolean>}  is true if success, false if an error occurs
     */
    export async function initWelcomePage (): Promise<boolean> {

        const cSourceName: string = 'project/project_main.ts/saveAndArchiveInit'

        log().trace(cSourceName, cInfoStarted)

        // Retrieve the active tab id and save it for later use
        const tabId = await tbGetCurrentTabId()
        await messenger.storage.session.set({ [ProjectStorage.currentTabId]: tabId })

        // Force background.js to awake and init (or it will fail receiving the first message 
        // from welcome_archives)
        void messenger.runtime.sendMessage('dummy')

        // Show the Welcome panel of archive as popup
        const popUrl = messenger.runtime.getURL(cResourcePopArchives)

        await messenger.windows.create({
                type: 'popup', // 'normal'
                url: popUrl
                // state: 'minimized',
            })

        // ----- (x_x) ----- Line of instant death
        //                   Opening the archive window instantly stop this thread

        /**
         * Since here the "welcome_archives" page will identify the emails to archive, ask
         * for name replacements and save & archive them.
         * 
         * Then "welcom_archives" will send a "CMessageLoadMailHeaders" message to the
         * background main thread ("project_main.ts").
         */

        return await Promise.resolve(true)

    }



    /**
     * # Load selected message and continue
     * Retrive headers of messages with loadMessagesOfTab() and return the list
     * by sending a message
     * 
     * Versions: 23.02.2024
     * @param {CMessageLoadMailHeaders} message is the message with parameters of the
     *             mails to load
     * @returns {Promise<boolean>} is true if success, false if an error occurs
     */
    export async function loadMailsOfTabAndSendResult (message: CMessageLoadMailHeaders): Promise<boolean> {

        const cSourceName: string = 'project/project_main.ts/loadMailsOfTabAndSendResult'

        log().trace(cSourceName, cInfoStarted)

        try {

            const mails: exTb.AMailHeader = await tbLoadMessagesOfTab({
                                                        mailsOfTabId: message?.mailsOfTabId,
                                                        selectedOnly: message?.selectedOnly
                                                    })
            
            log().debugInfo(cSourceName, 'Found ' + mails.length + ' mails')
            void messenger.runtime.sendMessage(new CMessageMailHeadersLoaded({
                                                        sentBy: cSourceName,
                                                        messageId: message.messageId,
                                                        mailsOfTabId: message?.mailsOfTabId,
                                                        selectedOnly: message.selectedOnly,
                                                        mailsHeaders: mails
                                                    }))
    
            return true
    
        } catch (error) {

            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
            return false

        }

    }





    // --------------- Cleaning of subjects

    /**
     * Create the map of the oldSubject --> newSubject headers after having
     * applied the provided rules to the current list of headers
     * ---
     * Versions: 23.02.2024
     * ---
     * @param {exTb.AMailHeader} allHeaders is the array containing all the
     *         messageheader to clean the subjects of. They will stay untouched
     *         as only the modification dictionary are returned in the 
     *         <oldSubject;newSubject> result.
     * @param {Map<RegExp | string, string>} rules is a list of rules to apply
     *         to the subjects. It can be a 'string' --> 'string' replacement
     *         or a /RegExp/ --> 'string' replacement where the matching groups
     *         of the regexp can be used with the $1, $2, etc. syntax 
     * @returns {Map<string, string> | undefined} is the map of <oldSubject;newSubject> pairs.
     *         Is undefined if an error occurs; 
     *         Is empty if no change is observed or if there where no message
     */
    function cleanSubjectsWithRules (allHeaders: exTb.AMailHeader,
                                     rules: ANameCleaningRules): ex.uMStringString {

        const cSourceName = 'project/project_main.ts/cleanSubjectsWithRules'

        log().trace(cSourceName, cInfoStarted)

        const result: ex.MStringString = new Map<string, string>()

        // Trivial case
        if (rules.length === 0) {

            // No rule, no entry in the map
            return result

        }

        // Do
        try {

            // Parse every header with every rule
            allHeaders.forEach((header) => {
            
                const oldSubject: string = header.subject

                if (!result.has(oldSubject)) {

                    let   newSubject: string = oldSubject

                    newSubject = cleanEntryWithRules(oldSubject, rules)

                    if (newSubject !== oldSubject) {

                        result.set(oldSubject, newSubject)

                    }

                }

            })

            // Happy end
            return result

        } catch (error) {

            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }

    }

    /**
     * Clean the entry of the provided mail with the provided rules
     * ---
     * Versions: 23.02.2024
     * ---
     * @param {string} oldEntry is the header entry to clean
     * @param {ANameCleaningRules} rules is the list of rules to apply (see cleanSubjectsWithRules()
     *                  and cleanPersonsWithRules) for detailed explanation
     * @returns {string} is the cleaned entry of the provided message
     */
    function cleanEntryWithRules (oldEntry: string,
                                  rules: ANameCleaningRules): string {

        const cSourceName = 'project/project_main.ts/cleanEntryWithRules'

        log().trace(cSourceName, cInfoStarted)

        try {
            
            let   newEntry: string = oldEntry

            rules.forEach((rule: NameCleaningRule) => {

                newEntry = newEntry.replace(rule.rule, rule.result).trim()

            })

            return newEntry


        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }

        return cNullString

    }



    /**
     * # Clean subjects with rules
     * 
     * Retrieve the replacement rules for subjects and apply them to the provided mail headers
     * 
     * Versions: 23.02.2024
     * @param {exTb.AMailHeader} headers is the list of message headers to clean the subjects of
     * @returns {Promise<Map<string, string> | undefined>} is the list of <initial mail
     *                  subject; new mail subject> replacement to use     
     */
    export async function cleanSubjects (headers: exTb.AMailHeader): Promise<ex.uMStringString> {

        const cSourceName = 'project/project_main.ts/cleanSubjects'

        log().trace(cSourceName, cInfoStarted)

        try {
            
            // Retrieve rules to apply
            const rules: ANameCleaningRules = []
            rules.push({
                          rule: /^(\[?External\]?[:_]?|Re[:_]|Fwd?[:_]|!|TR[:_]|I[:_]|R[:_]|WG[:_]|AW[:_]|Urgent[:_]|SPAM_LOW[:_]| )*/i,
                          result: ''
                        })

            // Clean names
            const result: ex.uMStringString = cleanSubjectsWithRules(headers, rules)

            // Done
            return result
            
        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
        }

    }

    /**
     * # Clean names of persons with rules
     * 
     * Create the map of the oldPerson --> newPerson headers after having
     * applied the provided rules to the current list of headers
     * 
     * Versions: 23.02.2024
     * @param {exTb.AMailHeader} allHeaders is the array containing all the
     *         messageheader to clean the subjects of. They will stay untouched
     *         as only the modification dictionary are returned in the 
     *         <oldSubject;newSubject> result.
     * @param {keyof object} headerEntry is the name of the entry of
     *         the header to use (typically "sender" or "to" or "bcc" for persons)
     * @param {Map<RegExp | string, string>} rules is a list of rules to apply
     *         to the persons. It can be a 'string' --> 'string' replacement
     *         or a /RegExp/ --> 'string' replacement where the matching groups
     *         of the regexp can be used with the $1, $2, etc. syntax 
     * @returns {Map<string, string> | undefined} is the map of <oldPerson;newPerson> pairs.
     *         Is undefined if an error occurs; 
     *         Is empty if no change is observed or if there where no message
     */
    function cleanPersonsWithRules (allHeaders: exTb.AMailHeader,
                                    headerEntry: keyof messenger.messages.MessageHeader,
                                    rules: ANameCleaningRules): ex.uMStringString {

        const cSourceName = 'project/project_main.ts/cleanPersonsWithRules'

        log().trace(cSourceName, cInfoStarted)

        const result: ex.MStringString = new Map<string, string>()

        // Trivial case
        if (rules.length === 0) {

            // No rule, no entry in the map
            return result

        }

        // Do
        try {

            // Parse every header with every rule
            allHeaders.forEach((header) => {

                const rawPersons = header[headerEntry]
                    
                if (typeof rawPersons === 'string') {

                    const allPersons: string[] = rawPersons.split(',')

                    allPersons.forEach(oldPerson => {
                        oldPerson = oldPerson.trim()
                        if (!result.has(oldPerson)) {

                            let newPerson: string = oldPerson

                            newPerson = cleanEntryWithRules(oldPerson, rules)

                            if (newPerson !== oldPerson) {

                                result.set(oldPerson, newPerson)

                            }

                        }
                    })
                }

            })

            // Happy end
            return result

        } catch (error) {

            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }

    }


    /**
     * # Build default rules for cleaning of names
     * 
     * Return the cleaning rules to apply to email names 
     * 
     * Versions: 15.06.2024, 23.02.2024
     * @returns {ANameCleaningRules} is the list of rules to apply
     */
    function getCleanPersonRules (): ANameCleaningRules {

        const cSourceName = 'project/project_main.ts/cleanPersons'

        log().trace(cSourceName, cInfoStarted)

        try {

            // Build rules to apply to names
            const result: ANameCleaningRules = []
            result.push({
                            rule: /(.+) <.*>,?/ig,
                            result: '$1'
                        },
                        {
                            rule: /^(\s*"\s*)(.*)(\s*"\s*)$/ig,
                            result: '$2'
                        })
            return result
                        
 
        } catch (error) {

            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
            return []

        }


   }
    

    /**
     * # Cleans names of persons
     * 
     * Retrieve the replacement rules for senders and apply them to the provided mail headers
     * 
     * Versions: 23.02.2024
     * @param {exTb.AMailHeader} headers is the list of message headers to clean the senders of
     * @returns {Promise<Map<string, string> | undefined>} is the list of <initial mail
     *                  sender; new mail sender> replacement to use     
     */
    export async function cleanPersons (headers: exTb.AMailHeader): Promise<ex.uMStringString> {

        const cSourceName = 'project/project_main.ts/cleanPersons'

        log().trace(cSourceName, cInfoStarted)

        try {
            
            // Retrieve rules to apply
            const rules: ANameCleaningRules = getCleanPersonRules()

            // Clean names
            const result: ex.uMStringString = cleanPersonsWithRules(headers, 'author', rules)

            // Done
            return result
            
        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
        }

    }



    // --------------- Building of filenames

    /**
     * # Build the export filename to use for every provided mail header
     * 
     * Versions: 08.06.2024, 23.02.2024
     * @param {exTb.AMailHeader} headers is an array with all the messageHeder to calculate the
     *                  filename of
     * @param {ex.MNumberString} subjectReplacements is a Map with the email ID --> subject
     *                  to use for export
     * @param {ex.MNumberString} senderReplacements is a Map with the email ID --> author display
     *                  name to use for export
     * @param {string} filenameTemplate is the template to apply to create the filenames
     *                  with field replacements:
     * @returns {ex.uMNumberString} is the <messageId;filename> map of filenames
     */
    async function buildExfiltrationFilenames (headers: exTb.AMailHeader,
                                               subjectReplacements: ex.MNumberString,
                                               senderReplacements: ex.MNumberString,
                                               filenameTemplate: string): Promise<ex.uMNumberString> {

        const cSourceName = 'project/project_main.ts/buildExfiltrationFilenames'

        log().trace(cSourceName, cInfoStarted)

        try {

            // Build the export filename
            const existingFiles: ex.MStringString = new Map<string, string>()
            const result: ex.MNumberString = new Map<number, string>()

            headers.forEach((header) => {

                // Calculate the standard file name
                const filename: string = buildExfiltrationFilename(
                                                        header,
                                                        subjectReplacements,
                                                        senderReplacements,
                                                        filenameTemplate)
                // Avoid duplicates in names
                const uniqueFilename = stringMakeUnique(filename,
                                                        existingFiles, {
                                                        upCased: true
                                                        })

                // Save result
                result.set(header.id, uniqueFilename)

            })

            return result

        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }

    }


    /**
     * # Build the exfiltration filename for the provided header
     * 
     * Format of date inspired from Excel formating:
     * 
     * - https://support.microsoft.com/en-us/office/format-a-date-the-way-you-want-8e10019e-d5d8-47a1-ba95-db95123d273e
     * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
     * 
     * Versions: 23.02.2024
     * @param {object.messages.MailHeader} header is the message header to calculate
     *                  the filename for
     * @param {ex.MNumberString}  subjectReplacements is a map of <mailID;newSubject>
     *                  to use to replace actual subject of email by a cleaned one
     * @param {ex.MNumberString}  senderReplacements is a map of <mailID;newSenderName>
     *                  to use to replace actual author name of email by a cleaned one
     * @param {string} filenameTemplate is the template to use to build the filename:
     * 
     *        ${subject} 
     *        ${from}
     *        ${to}
     *        ${cc}
     *        ${size}  size of the mail in Bytes
     *        ${sizeK} size of the mail in Kb (division by 1000, not 1024)
     *        ${sizeM} size of the mail in Mb (division by 1000000, not 1024^2)
     *        + all the fields created by exerma_base.ts/datetimeToFieldReplacement() 
     * @returns {string} is the filename to use for exfiltration of this email
     */
    function buildExfiltrationFilename (header: messenger.messages.MessageHeader,
                                        subjectReplacements: ex.MNumberString,
                                        senderReplacements: ex.MNumberString,
                                        filenameTemplate: string): string {
        
        const cSourceName = 'project/project_main.ts/buildExfiltrationFilename'

        log().trace(cSourceName, cInfoStarted)

        try {

            // Extract data
            const mailId: number = header.id
            const mailDate: Date = tbGetMessageDate(header) ?? new Date(0)
            const mailFrom: string = header.author
            const mailTo: string = header.ccList.at(0) ?? ''
            const mailBcc: string = header.bccList.at(0) ?? ''
            const mailSize: number = header.size
            const mailSubject: string = header.subject

            // Remove email from the sender
            // TODO: Clean the list of "to" and "cc"
            const rule = /(.+) <.*>,?/g
            const cleanedFrom = cleanEntryWithRules(mailFrom, getCleanPersonRules())
            const cleanedTo = mailTo.replace(rule, '$1')
            const cleanedBcc = mailBcc.replace(rule, '$1')

            // Prepare the set of rules for replacement
            const rules: ex.MStringString = new Map<string, string>()
            
            rules.set('subject', (subjectReplacements.get(mailId) ?? mailSubject))
                 .set('from',    (senderReplacements.get(mailId) ?? cleanedFrom))
                 .set('to',      cleanedTo)
                 .set('cc',      cleanedBcc)
                 .set('size',    mailSize.toString())
                 .set('sizeK',   Math.trunc(mailSize / 1000).toString() + 'K')
                 .set('sizeM',   Math.trunc(mailSize / 1000000).toString() + 'M')
                 
            datetimeToFieldReplacement(mailDate, { feedMap: rules, timesep: '-' })

            // Replace fields of the template
            const result: string = fieldReplacement(filenameTemplate, rules)
            return result

        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }

        return cNullString

    }

    // --------------- Utility functions



    /**
     * # Exfilter messages of the provided tab
     * 
     * Versions: 09.08.2024, 29.07.2024, 23.02.2024
     * @param {object}           params are the required parameters of the function
     * @param {exTb.AMailHeader} params.mailsHeaders is the list of email headers to exfilter
     * @param {ex.uNumber}       params.mailsOfTabId is the Id of the Tab containing the emails to
     *                  exfilter. If undefined, then exfilter only the messages with ID 
     *                  defined as key in the params.mailsSubject parameter.
     * @param {boolean}          params.selectedOnly is true if only the selected emails have to be 
     *                  exfiltered, false if all the emails of this tab have to be exfiltered
     * @param {string}           params.targetDirectory is the folder where to save files
     * @param {ex.MNumberString} params.mailsSubjects is the corrected subject to use for each
     *                  email (email ID as key) to exfiltered: <emailID;correctedSubject>.
     *                  EMails with missing IDs are using the real email subject.
     * @param {ex.MNumberString} params.mailsSenders is the corrected author (sender) name to use
     *                  email (email ID as key) to exfiltered: <emailID;correctedSubject>.
     *                  for each EMails with missing IDs are using the real email author.
     * @param {boolean} params.saveEml is used to save the EML file (if true) or don't save it (if false)
     * @param {boolean} params.savePdf is used to save the PDF file (if true) or don't save it (if false)
     * @param {boolean} params.saveHtml is used to save the HTML file (if true) or don't save it (if false)
     * @param {boolean} params.saveAttachments is used to save attachment with the email (if true)
     */
    export async function exfiltrateEmails (params: { mailsHeaders: exTb.AMailHeader
                                                      mailsOfTabId: ex.uNumber
                                                      selectedOnly: boolean
                                                      targetDirectory: string
                                                      mailsSubjects: ex.MNumberString
                                                      mailsSenders: ex.MNumberString
                                                      saveEml: boolean
                                                      savePdf: boolean
                                                      saveHtml: boolean
                                                      saveAttachments: boolean
                                                 }): Promise<void> {

        const cSourceName: string = 'project/project_main.ts/exfiltrateEmails'

        // eslint-disable-next-line no-template-curly-in-string
        const cDefaultTemplate: string = '${yyyy-mm-dd} ${HHMM}__${from}__${subject}'

        log().trace(cSourceName, cInfoStarted)

        try {

            const saveAttachments = params.saveAttachments

            // TODO: Retrieve template from settings

            const filenames: ex.uMNumberString = await buildExfiltrationFilenames(params.mailsHeaders,
                                                                                  params.mailsSubjects,
                                                                                  params.mailsSenders,
                                                                                  cDefaultTemplate)
            let absolutePath = params.targetDirectory
            const nbMails = params.mailsHeaders.length
            if (nbMails > 0) {

                // Start showing progress to user
                // TODO: Open the progress window
                // await messenger.runtime.sendMessage(new CMessageSaveProgressInit({
                //                                             sentBy: cSourceName,
                //                                             messageId: cSourceName,
                //                                             nbFiles: nbMails * 3
                //                                         }))

                // Save next emails
                let cancelled = false
                const saveAllPromises = new Array<Promise<string>>()
                for (let iMail = 0; (iMail < nbMails) && (!cancelled); ++iMail) {

                    const header = params.mailsHeaders.at(iMail) as messenger.messages.MessageHeader
                    const exfiltrateResult = await exfiltrateEmail(header, {
                                                            filename: filenames?.get(header.id),
                                                            subject: params.mailsSubjects.get(header.id),
                                                            sender: params.mailsSenders.get(header.id),
                                                            targetPath: absolutePath,
                                                            saveEml: params.saveEml,
                                                            savePdf: params.savePdf,
                                                            saveHtml: params.saveHtml,
                                                            saveAttachments: params.saveAttachments
                                                        })
                    absolutePath = exfiltrateResult[0]
                    cancelled = exfiltrateResult[1]
                    
                }

            }

            // Close progress window
            // TODO: Close the progress window
            // await messenger.runtime.sendMessage(new CMessageSaveProgressClose({
            //                                             sentBy: cSourceName,
            //                                             messageId: cSourceName
            //                                         }))

            log().debugInfo(cSourceName, 'Done')

        } catch (error) {
        
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }

    }


    /**
     * # Save message as files
     * 
     * This function exfilter the message in the default "local folder" in EML and PDF formats
     * 
     * Versions: 15.06.2024, 23.02.2024
     * @param {object} messageHeader is the header of the message to save ()
     * @param {object} params is a list of optional parameters
     * @param {string} params.filename is the name of the file to use as body name for the
     *                 EML and PDF exfiltered files.
     *                 If not provided, then use the "YYYY-MM-DD HHMM__Sender__Subject" format
     * @param {string} params.subject is the subject to use for name building instead of the 
     * '               current subject of the message
     * @param {string} params.sender is the author name (sender) to use for name building 
     * '               instead of the current author of the message
     * @param {string} params.targetPath is the target directory where 
     *                 to save the files in.
     *                 If not provided, then ask user for the destination and use the target path
     *                 as current default path and return fullname of the EML file
     * @param {boolean} params.saveEml is used to save the EML file (if true) or don't save it (if false)
     * @param {boolean} params.savePdf is used to save the PDF file (if true) or don't save it (if false)
     * @param {boolean} params.saveHtml is used to save the HTML file (if true) or don't save it (if false)
     * @param {boolean} params.saveAttachments is used to save attachment with the email (if true)
     *                 If false or not provided, then don't save attachments
     * @param {string} params.attachmentPrefix is used to define the prefix to set to the attachment
     *                  before the attachment file name (if provided). If not provided, then use
     *                  "YYYY-MM-DD HHMM__" before the filename of the attachment.
     * @returns {Promise<[string, boolean]>} is a Promise to return absolute target path & name (as first
     *                  value) and if the user has cancelled (as second value):
     *                       Syntax:
     *                           const saveResult = await saveBlob(...)
     *                           const absolutePath = saveResult[0]
     *                           const cancelled = saveResult[1]
     */
    async function exfiltrateEmail (messageHeader: messenger.messages.MessageHeader,
                                    params: {
                                        filename?: string
                                        subject?: string
                                        sender?: string
                                        targetPath?: string
                                        saveEml: boolean
                                        savePdf: boolean
                                        saveHtml: boolean
                                        saveAttachments: boolean
                                        attachmentPrefix?: string
                                   }
                            ): Promise<[string, boolean]> {

        const cSourceName: string = 'project/project_main.ts/exfiltrateEmail'
        const asyncSavePdf: boolean = false

        log().trace(cSourceName, cInfoStarted)

        // This target path will be fed by asking destination if not provided
        let absolutePath: string = params?.targetPath ?? cNullString
        let filename: string = params?.filename ?? cNullString
        let cancelled = false

        try {

            // Manage async saving of files
            const savefilePromises = new Array<Promise<number>>()

            // Build default name if not provided
            if (filename === cNullString) {
                
                // Extract data to use to build the filename body
                const when: Date = tbGetMessageDate(messageHeader) ?? new Date(0)
                const who: string = params?.sender?.trim() ?? messageHeader?.author ?? '(hidden)'
                const what: string = params?.subject?.trim() ?? messageHeader?.subject.trim() ?? '(no object)'

                filename = datetimeToStringTag(when) + '__' + what
        
                
                        // +
                        // '__' + who +
                        // '__' + what

            }


            log().debugInfo(cSourceName, 'filename = ' + filename)

            // Retreive full message
            const rawMessage: ex.nFile = await messenger.messages.getRaw(messageHeader.id, { data_format: 'File' }) as ex.nFile
            
            if (rawMessage != null)  {

                log().debugInfo(cSourceName, 'rawMessage loaded')

                // ----- Save EML File
                if (params.saveEml) {
                    const emlBlob = new Blob([rawMessage], { type: 'text/eml' })
                    const emlData = await emlBlob.arrayBuffer()
                    const saveResult = await saveBlob(emlData, filename, absolutePath, { setExt: 'eml' })
                    absolutePath = saveResult[0]
                    cancelled = saveResult[1]
                }

                // ----- Save PDF and HTML file
                if ((!cancelled) && ((params.savePdf) || (params.saveHtml))) {

                    // Create the Html file and its PDF 
                    const [pdfDoc, htmlDoc] = await createPdf(messageHeader, cResourcePdfTemplate) //, {}, { noPdf: true })

                    // Save PDF File
                    if ((!cancelled) && (params.savePdf) && (pdfDoc !== undefined)) {
                    
                        const pdfBlob: Blob = pdfDoc.output('blob')
                        const pdfData = await pdfBlob.arrayBuffer()
                        pdfDoc.close()
                        const saveResult = await saveBlob(pdfData, filename, absolutePath, { setExt: 'pdf' })
                        absolutePath = saveResult[0]
                        cancelled = saveResult[1]
                    
                    }

                    // Save HTML file
                    if ((!cancelled) && (params.saveHtml) && (htmlDoc !== undefined)) {
                        
                        const htmlBlob = new Blob([htmlDoc.documentElement.outerHTML], { type: 'text/html' } )
                        const htmlData = await htmlBlob.arrayBuffer()
                        const saveResult = await saveBlob(htmlData, filename, absolutePath, { setExt: 'html' })
                        absolutePath = saveResult[0]
                        cancelled = saveResult[1]
                        
                    }
                
                }

                // Save attachments
                if ((!cancelled) && (params.saveAttachments)) {
                    
                    log().trace(cSourceName, 'Save attachments')

                    const allAttach = await messenger.messages.listAttachments(messageHeader.id)
                    if ((allAttach !== null) && (allAttach.length !== 0)) {
                        
                        log().trace(cSourceName, 'Save attachments: ' + allAttach.length + ' pieces')

                        // Prepare prefix name of files
                        let attachmentPrefix = params.attachmentPrefix
                        if (attachmentPrefix === undefined ) {
                            const mailDate: Date = tbGetMessageDate(messageHeader) ?? new Date(0)
                            attachmentPrefix = datetimeToStringTag(mailDate, {
                                                                    datetimeSep: ' ',
                                                                    noSeconds: true
                                                                    })
                                                + cLastInFolder2
                                                + exLangFuture('') // "Pièce"
                                                + cLastInFolder2
                        }

                        log().debugInfo(cSourceName, allAttach.length + ' pièces jointes')

                        // Save files
                        const existingFiles: ex.MStringString = new Map<string, string>()
                        for (const attach of allAttach) {

                            const type = attach.contentType
                            if (type !== 'text/x-moz-deleted') {

                                // Load file content
                                try {
                                    
                                    const filefile = await messenger.messages.getAttachmentFile(messageHeader.id, attach.partName) as File
                                    const fileBlob = await filefile.arrayBuffer()

                                    // Save it
                                    const filename = buildFullname(absolutePath,
                                                                    cleanFilename(attachmentPrefix + extractFilename(attach.name)))
                                    const uniquename = stringMakeUnique(filename, existingFiles, { upCased: true })
                                    log().debugInfo(cSourceName, uniquename)
                                    const saveResult = await saveBlob(fileBlob, uniquename, absolutePath)
                                    absolutePath = saveResult[0]
                                    cancelled = saveResult[1]

                                    log().debugInfo(cSourceName, 'absolutePath = ' + absolutePath)

                                    if (cancelled) break

                                } catch (error) {

                                    log().raiseBenine(cSourceName, 'Error while retrieving attachment', error as Error)

                                }

                            }

                        }

                
                    }

                }

            }

        } catch (error) {
        
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }

        // Done
        return [absolutePath, cancelled]
                                
    }



    /**
     * # Standard way to download a Blob as a file
     * 
     * Currently kept only for testing various methods compared to showOpenFilePicker()
     * and saveAs()
     * - https://blog.gitnux.com/code/javascript-save-file/
     * 
     * Versions: 23.02.2024
     * @param {string | object} content is the data of the file to save on disk
     * @param {string} fileName is the name of the file (path looks to be ignored)
     * @param {string} mimeType is the standard mime-type of the file; looks to be
     *             important as ThunderBird allows some types only (like PDF: 'application/pdf')
     *             to be saved without an intervention of the user
     */
    function downloadFile (content: string | Blob, fileName: string, mimeType: string): void {

        const blob = new Blob([content], { type: mimeType })
        const url = URL.createObjectURL(blob)
        const downloadLink = document.createElement('a')
        
        downloadLink.href = url
        downloadLink.download = fileName
        
        // Append download link to the DOM and trigger a click to start the download
        document.body.appendChild(downloadLink)
        downloadLink.click()
        
        // Clean up after the download is complete
        document.body.removeChild(downloadLink)
        URL.revokeObjectURL(url)

    }

    /**
     * Ask the user for the target folder where to exfilter the messages into
     * @returns {string} the target path selected by user
     */
    export async function askForTargetFolder (): Promise<string> {

        const cSourceName = 'project/project_main.ts/askForTargetFolder'

        log().trace(cSourceName, cInfoStarted)

        try {

            // const targetPath = await showDirectoryPicker()
            const result: string = '' // targetPath.name
            return result

        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
            return await Promise.resolve(cNullString)

        }

    }

