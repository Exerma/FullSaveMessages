/**
 * ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023
 * ---------------------------------------------------------------------------
 *  project_main.ts
 * ---------------------------------------------------------------------------
 *
 * Versions:
 *   2023-11-13: Add: Allow user to edit the sender name for export filename
 *   2023-08-21: Add: First implementation of
 *   2023-08-20: First version
 *
 */
    // --------------- Imports
    import type * as ex              from '../exerma_base/exerma_types'
    import type * as exTb            from '../exerma_tb/exerma_tb_types'
    import log, { cRaiseUnexpected, cInfoStarted } from '../exerma_base/exerma_log'
    import { loadAllMails, loadSelectedMails }  from '../exerma_tb/exerma_tb_messages'
    import { jsPDF }                 from 'jspdf'
    import { createPdf }             from '../exerma_tb/exerma_tb_pdf'
    import {
                type FileSystemDirectoryHandle,
                showDirectoryPicker,
                showSaveFilePicker,
                getOriginPrivateDirectory
           }                         from '../../dependancies/native-file-system-adapter/native-file-system-adapter'
    import { saveAs }                from 'file-saver'
    import {
        datetimeToFieldReplacement,
                datetimeToStringTag,
                fieldReplacement
            }   from '../exerma_base/exerma_misc'
    import {
                type CMessageLoadMailHeaders,
                CMessageMailHeadersLoaded
            } from './project_messages'
    import { ProjectStorage } from './project_storage'
    import { isCClass, CClassTest, CClass } from '../exerma_base/exerma_types'
    import { cNullString, cTypeNameString } from '../exerma_base/exerma_consts'


    // --------------- Consts
    export const cPopupBody:             string = 'popupBody'
    export const cPopupArchiveButton:    string = 'cmdArchive'
    export const cPopupSaveAttachButton: string = 'cmdSaveAttachment'
    export const cPopupTestButton:       string = 'cmdTest'


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

        // Save current tabId to manage the emails of
        const currentTab: exTb.nMailTab = await messenger.mailTabs.getCurrent()
        void messenger.storage.session.set({ name: cStorageCurrentMailTabId, header: currentTab?.id })

    }

    /**
     * Retrieve the current mailTab.tablId from session storage
     * @returns {Promise<ex.uNumber>} is the last header stored with storeCurrentMailTabId()
     */
    export async function unstoreCurrentMailTabId (): Promise<ex.uNumber> {

        // Save current tabId to manage the emails of
        const loaded: object | undefined = await messenger.storage.session.get(cStorageCurrentMailTabId)
        const result: ex.uNumber = (loaded as { name: string, header: number } | undefined)?.header
        return await Promise.resolve(result)
        

    }




    /**
     * Archive selected files
     * @param {Event} event is the 'click' event firing this event handler
     */
    export function onActionButtonClick (event: Event): void {

        const cSourceName = 'project/project_main.ts/onActionButtonClick'

        log().trace(cSourceName, 'User has clicked the main button')

    }



    /**
     * User has clicked the "Archive" button from the action popup window
     * @param {Event} event is the 'click' event firing this event handler
     */
    export async function onArchiveButtonClick (event: Event): Promise<void> {

        console.log('User has clicked the archive button')

        await initWelcomePage()

        // window.close()

    }



    /**
     * User has clicked the "Save attachment" button from the action popup window
     * @param {Event} event is the 'click' event firing this event handler
     */
    export function onSaveAttachButtonClick (event: Event): void {

        console.log('User has clicked the save attachment button')

    }



    /**
     * User has clicked the "Test" button from the action popup window
     * @param {Event} event is the 'click' event firing this event handler
     */
    export async function onTestButtonClick (event: Event): Promise<void> {

        const cSourceName = 'project/project_main.ts/onTestButtonClick'

        const aTest = new CClassTest()

        log().debugInfo(cSourceName, ': test is ExClass = ' + isCClass(aTest, CClass.CClassType))
        log().debugInfo(cSourceName, ': test is ExClassTest = ' + isCClass(aTest, CClassTest.CClassType))

        try {

            console.log(cSourceName + 'User has clicked the test button')

            const myDOM: DOMImplementation = document.implementation
        
            console.log(cSourceName + ' DOM implementation found ' + (myDOM == null ? '(null)' : ''))
        
            const myHtml: Document = myDOM.createHTMLDocument('Test')
        
            console.log(cSourceName + ' HTML document created ' + (myHtml == null ? '(null)' : ''))
        
            const myTag: HTMLElement = myHtml.createElement('p')
            myTag.innerHTML = 'Hello world'
            myHtml.body.appendChild(myTag)
        
            console.log(cSourceName + ' <p> tag added ' + (myTag == null ? '(null)' : ''))
        
            const myPdf: jsPDF = new jsPDF()
        
            // console.log(cSourceName + ' pdf object created ' + (myPdf == null ? '(null)' : ''))
        
            await myPdf.html(myHtml.body)
        
            console.log(cSourceName + ' HTML document loaded in PDF')
            
            const pdfBlob: Blob = myPdf.output('blob')

            console.log(cSourceName + ' Got PDF body as blob ' + (pdfBlob == null ? '(null)' : ''))

            // const targetPath = await showDirectoryPicker()
            // const targetFile = await targetPath.getFileHandle('target.pdf', { create: true })
            // const exportFile = await targetFile.createWritable({ keepExistingData: true })
            // await exportFile.write(pdfBlob)
            // await exportFile.close()

            const exportFile: File = new File([pdfBlob],
                                            'target.pdf',
                                            { type: 'application/pdf' })
            saveAs(exportFile)

            myPdf.close()
            myHtml.close()

            console.log(cSourceName + ' Object freed')
        
        } catch (error) {

            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }

    }


    /**
     * Save the selected messages in EML and PDF formats
     * About sending messages:
     *      https://developer.chrome.com/docs/extensions/mv3/messaging/
     * @returns {Promise<boolean>}  is true if success, false if an error occurs
     */
    export async function initWelcomePage (): Promise<boolean> {

        const cSourceName: string = 'project/project_main.ts/saveAndArchiveInit'

        log().trace(cSourceName, cInfoStarted)

        
        // Retrieve the active tab id and save it for later use
        const activeTab: exTb.nMailTab = await messenger.mailTabs.getCurrent()
        const tabId: number | undefined = activeTab?.id
        await messenger.storage.session.set({ [ProjectStorage.currentTabId]: tabId })

        // Show the Welcome panel of archive as popup
        const popUrl = messenger.runtime.getURL(cResourcePopArchives)

        // const popPage: exTb.nWindow  = await messenger.windows.create({
        await messenger.windows.create({
                type: 'popup', // 'normal'
                url: popUrl
                // state: 'minimized',
            })

        // ----- (x_x) ----- Line of instant death
        //                   Opening the archive window instantly stop this thread

        /**
         * Since here the page will identify the emails to archive, ask
         * for name replacements and save & archive them
         */

        return await Promise.resolve(true)

    }



    /**
     * Retrive headers of messages with loadMessagesOfTab() and return the list
     * by sending a message
     * @param {CMessageLoadMailHeaders} message is the message with parameters of the
     *             mails to load
     * @returns {Promise<boolean>} is true if success, false if an error occurs
     */
    export async function loadMailsOfTabAndSendResult (message: CMessageLoadMailHeaders): Promise<boolean> {

        const cSourceName: string = 'project/project_main.ts/loadMailsOfTabAndSendResult'

        log().trace(cSourceName, cInfoStarted)

        try {

            const mails: exTb.AMailHeader = await loadMessagesOfTab({
                                                        mailsOfTabId: message?.mailsOfTabId,
                                                        selectedOnly: message?.selectedOnly
                                                    })
            
            log().debugInfo(cSourceName, 'Found ' + mails.length + ' mails')
            void messenger.runtime.sendMessage(message.answerTo,
                                               new CMessageMailHeadersLoaded({
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



    /**
     * Retrieve headers of messages belonging to the provided tab (clear previous data)
     * @param {object} options is used to provide additional options
     * @param {ex.uNumber} options.mailsOfTabId is the optional id of the tab to save & archive the 
     *             selected messages of
     * @param {boolean} options.selectedOnly is used to load only the selected messages of the
     *             tabs (if true) of all messages of the tab (if false, default)
     * @returns {Promise<boolean>} is true if success, false if an error occurs
     */
    export async function loadMessagesOfTab (options?: {
                                                mailsOfTabId?: ex.uNumber
                                                selectedOnly?: boolean
                                            }): Promise<exTb.AMailHeader> {

        const cSourceName: string = 'project/project_main.ts/loadFromTab'

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
                                ? loadSelectedMails(options?.mailsOfTabId)
                                : loadAllMails(options?.mailsOfTabId))
            for await (const messageHeader of selection) {
        
                log().debugInfo(cSourceName, messageHeader.subject)

                // const rawMessage: exBase.nFile = await messenger.messages.getRaw(messageHeader.id) as exBase.nFile

                // if (rawMessage != null) {
                //     // https://developer.mozilla.org/en-US/docs/Web/API/File_System_API
                //     // https://github.com/jimmywarting/native-file-system-adapter
                //     const fileHandle = await showSaveFilePicker({ suggestedName: messageHeader.subject + '.eml' })
                //     const fileStream = await fileHandle.createWritable()
                //     await fileStream.write(rawMessage)
                //     await fileStream.close()
                // }

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



    // --------------- Cleaning of subjects

    /**
     * Create the map of the oldSubject --> newSubject headers after having
     * applied the provided rules to the current list of headers
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
     * Retrieve the replacment rules for subjects and apply them to the provided mail headers
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
                          rule: /^(Re[:_]|Fwd+[:_]|!|TR[:_]|I[:_]|R[:_]|WG[:_]|AW[:_]|Urgent[:_]|SPAM_LOW[:_]| )*/i,
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
     * Create the map of the oldPerson --> newPerson headers after having
     * applied the provided rules to the current list of headers
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
     * Return the cleaning rules to apply to email names 
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
                        })
            return result
                        
 
        } catch (error) {

            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
            return []

        }


   }
    

    /**
     * Retrieve the replacment rules for senders and apply them to the provided mail headers
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
     * Build the export filename to use for every provided mail header
     * @param {exTb.AMailHeader} headers is an array with all the messageHeder to calculate the
     *                  filename of
     * @param {ex.MNumberString} subjectReplacements is a Map with the email ID --> subject
     *                  to use for export
     * @param {ex.MNumberString} senderReplacements is a Map with the email ID --> author display
     *                  name to use for export
     * @param {string} filenameTemplate is the template to apply to create the filenames
     *                         with field replacements:
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
            const result: ex.MNumberString = new Map<number, string>()

            headers.forEach((header) => {

                const filename: string = buildExfiltrationFilename(
                                                        header,
                                                        subjectReplacements,
                                                        senderReplacements,
                                                        filenameTemplate)
                result.set(header.id, filename)

            })

            return result

        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }

    }


    /**
     * Build the exfiltration filename for the provided header
     * Format of date inspired from Excel formating:
     * https://support.microsoft.com/en-us/office/format-a-date-the-way-you-want-8e10019e-d5d8-47a1-ba95-db95123d273e
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
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
            const mailDate: Date = ( (typeof header.date === 'number')
                                   ? (header.date as unknown) as Date
                                   : (new Date(Date.parse(header.date as string))) )
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
     * Exfilter messages of the provided tab
     * @param {object}           params are the required parameters of the function
     * @param {exTb.AMailHeader} params.mailsHeaders is the list of email headers to exfilter
     * @param {ex.uNumber}       params.mailsOfTabId is the Id of the Tab containing the emails to
     *                  exfilter. If undefined, then exfilter only the messages with ID 
     *                  defined as key in the params.mailsSubject parameter.
     * @param {boolean}          params.selectedOnly is true if only the selected emails have to be 
     *                  exfiltered, false if all the emails of this tab have to be exfiltered
     * @param {string}           params.targetDirectory is the folder where to save the EML and PDF 
     *                  files
     * @param {ex.MNumberString} params.mailsSubjects is the corrected subject to use for each
     *                  email (email ID as key) to exfiltered: <emailID;correctedSubject>.
     *                  EMails with missing IDs are using the real email subject.
     * @param {ex.MNumberString} params.mailsSenders is the corrected author (sender) name to use
     *                  email (email ID as key) to exfiltered: <emailID;correctedSubject>.
     *                  for each EMails with missing IDs are using the real email author.
     */
    export async function exfilterEMails (params: { mailsHeaders: exTb.AMailHeader
                                                    mailsOfTabId: ex.uNumber
                                                    selectedOnly: boolean
                                                    targetDirectory: string
                                                    mailsSubjects: ex.MNumberString
                                                    mailsSenders: ex.MNumberString
                                                 }): Promise<void> {

        const cSourceName: string = 'project/project_main.ts/exfilterEMails'

        // eslint-disable-next-line no-template-curly-in-string
        const cDefaultTemplate: string = '${yyyy-mm-dd} ${HHMM}__${from}__${subject}'

        log().trace(cSourceName, cInfoStarted)

        try {

            // TODO: Retrieve template from settings
            const filenames: ex.uMNumberString = await buildExfiltrationFilenames(params.mailsHeaders,
                                                                                  params.mailsSubjects,
                                                                                  params.mailsSenders,
                                                                                  cDefaultTemplate)
            params.mailsHeaders.forEach((header, index) => {
                log().debugInfo(cSourceName, '[' + index + '] = ' + params.mailsSubjects.get(header.id))
                void exfilterEMail(header, {
                                     filename: filenames?.get(header.id),
                                     subject: params.mailsSubjects.get(header.id),
                                     sender: params.mailsSenders.get(header.id)
                                    })
            })
            log().debugInfo(cSourceName, 'Done')

        } catch (error) {
        
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }

    }


    /**
     * This function exfilter the message in the default "local folder" in EML and PDF formats
     * @param {object} messageHeader is the header of the message to save ()
     * @param {object} params is a list of optional parameters
     * @param {string} params.filename is the name of the file to use as body name for the
     *                 EML and PDF exfiltered files.
     *                 If not provided, then use the "YYYY-MM-DD HHMM__Sender__Subject" format
     * @param {string} params.subject is the subject to use for name building instead of the 
     * '               current subject of the message
     * @param {string} params.sender is the author name (sender) to use for name building 
     * '               instead of the current author of the message
     * @param {FileSystemDirectoryHandle} params.targetPath is the target directory where 
     *                 to save the files in.
     *                 If not provided, then save it in the current default path
     *                 Note: Not used in current implementation due to security limitation
     *                       to access folders from Firefox/Thunderbird
     * @returns {Promise<void>} is a lone Promise
     */
    async function exfilterEMail (messageHeader: messenger.messages.MessageHeader,
                                            params?: {
                                                filename?: string
                                                subject?: string
                                                sender?: string
                                                targetPath?: FileSystemDirectoryHandle
                                            }
                                        ): Promise<void> {

        const cSourceName: string = 'project/project_main.ts/exfilterEMail'

        log().trace(cSourceName, cInfoStarted)

        try {

            let filename: string

            // Build default name if not provided
            if (params?.filename != null) {

                filename = params.filename

            } else {
                
                // Extract data to use to build the filename body
                const when: Date = ((messageHeader?.date instanceof Date)
                                    ? messageHeader?.date
                                    : new Date(0))
                const who: string = params?.sender?.trim() ?? messageHeader?.author ?? '(hidden)'
                const what: string = params?.subject?.trim() ?? messageHeader?.subject.trim() ?? '(no object)'

                filename = datetimeToStringTag(when) + '__' + what
        
                
                                // +
                        // '__' + who +
                        // '__' + what

            }


            log().debugInfo(cSourceName, 'filename = ' + filename)

            // Retrive full message
            const rawMessage: ex.nFile = await messenger.messages.getRaw(messageHeader.id, { data_format: 'File' }) as ex.nFile
            
            if (rawMessage != null)  {

                log().debugInfo(cSourceName, 'rawMessage loaded')

                // Save PDF File
                const pdfDoc: jsPDF = await createPdf(messageHeader, cResourcePdfTemplate)
                const pdfBlob: Blob = pdfDoc.output('blob')
                // const exportFile: File = new File([pdfBlob], (filename + '.pdf'), { type: 'application/pdf' })
                // saveAs(exportFile)
                pdfDoc.save((filename + '.pdf'))
                pdfDoc.close()
                log().debugInfo(cSourceName, 'PDF File saved as ' + (filename + '.pdf'))

                // Save EML File
                // const emlFile: File = new File([rawMessage], (filename + '.eml'), { type: 'text/eml' })
                // saveAs(emlFile, (filename + '.eml'))
                log().debugInfo(cSourceName, 'EML File ready to be saved')
                // RESTORE: Restore the Download to save email into EML format
                // downloadFile(rawMessage, (filename + '.eml'), 'text/eml')
                log().debugInfo(cSourceName, 'EML File saved as ' + (filename + '.eml'))

                // Print message
                // Show the message in a temporary window
                // let tabMessage:messenger.tabs.Tab = messenger.messageDisplay.open({messageId: messageHeader.id});

            }

        } catch (error) {
        
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }
                                
    }



    /**
     * Standard way to download a Blob as a file
     * Currently kept only for testing various methods compared to showOpenFilePicker()
     * and saveAs()
     * https://blog.gitnux.com/code/javascript-save-file/
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


