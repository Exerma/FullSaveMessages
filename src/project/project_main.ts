/**
 * ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023
 * ---------------------------------------------------------------------------
 *  project_main.ts
 * ---------------------------------------------------------------------------
 *
 * Versions:
 *   2023-08-21: Add: First implementation of
 *   2023-08-20: First version
 *
 */
    // --------------- Imports
    import type * as ex              from '../exerma_base/exerma_types'
    import type * as exTb            from '../exerma_tb/exerma_tb_types'
    import { loadResourceHtml }      from '../exerma_tb/exerma_tb_misc'
    import log, { cRaiseUnexpected, cInfoStarted } from '../exerma_base/exerma_log'
    import { loadAllMails, loadSelectedMails }  from '../exerma_tb/exerma_tb_messages'
    import { jsPDF }                 from 'jspdf'
    import {
                type FileSystemDirectoryHandle,
                showDirectoryPicker,
                showSaveFilePicker,
                getOriginPrivateDirectory
           }                         from '../../dependancies/native-file-system-adapter/native-file-system-adapter'
    import { saveAs }                from 'file-saver'
    import { datetimeToStringTag }   from '../exerma_base/exerma_misc'
    import {
                type CMessageLoadMailHeaders,
                CMessageInitWelcomeArchiveWithTab,
                CMessageMailHeadersLoaded
            } from './project_messages'
    import { exMessageName } from '../exerma_base/exerma_messages'



    // --------------- Consts
    export const cPopupBody: string = 'popupBody'
    export const cPopupArchiveButton: string = 'cmdArchive'
    export const cPopupSaveAttachButton: string = 'cmdSaveAttachment'
    export const cPopupTestButton: string = 'cmdTest'



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
        void messenger.storage.session.set({ name: cStorageCurrentMailTabId, value: currentTab?.id })

    }

    /**
     * Retrieve the current mailTab.tablId from session storage
     * @returns {Promise<ex.uNumber>} is the last value stored with storeCurrentMailTabId()
     */
    export async function unstoreCurrentMailTabId (): Promise<ex.uNumber> {

        // Save current tabId to manage the emails of
        const loaded: object | undefined = await messenger.storage.session.get(cStorageCurrentMailTabId)
        const result: ex.uNumber = (loaded as { name: string, value: number } | undefined)?.value
        return await Promise.resolve(result)
        

    }




    /**
     * Archive selected files
     * @param {Event} event is the 'click' event firing this event handler
     */
    export function onActionButtonClick (event: Event): void {

        console.log('User has clicked the main button')

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

        const cSourceName = 'project/main.ts/onTestButtonClick'

        
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

        const cSourceName: string = 'project/main.ts/saveAndArchiveInit'

        log().debugInfo(cSourceName, cInfoStarted)

        
        // Retrieve the active tab id
        const activeTab: exTb.nMailTab = await messenger.mailTabs.getCurrent()
        const tabId: number | undefined = activeTab?.id

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
    export async function loadMailsOfTabAndSendResult   (message: CMessageLoadMailHeaders): Promise<boolean> {

        const cSourceName: string = 'project/main.ts/loadMailsOfTabAndSendResult'


        try {

            const result: exTb.AMessageHeader = await loadMessagesOfTab({
                                                            mailsOfTabId: message?.mailsOfTabId,
                                                            selectedOnly: message?.selectedOnly
                                                        })
            
            void messenger.runtime.sendMessage(new CMessageMailHeadersLoaded({
                                                        sentBy: cSourceName,
                                                        mailsOfTabId: message?.mailsOfTabId,
                                                        messageHeaders: result,
                                                        messageId: message.messageId,
                                                        selectedOnly: message.selectedOnly
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
                                            }): Promise<exTb.AMessageHeader> {

        const cSourceName: string = 'project/main.ts/loadFromTab'

        log().debugInfo(cSourceName, 'Has started')

        // // Ask for destination directory
        // log().debugInfo(cSourceName, 'Ask directory to user')
        // let targetFolder: FileSystemDirectoryHandle
        // try {

        //     targetFolder = await showDirectoryPicker()

        // } catch (error) { return await Promise.resolve(false) }

        // log().debugInfo(cSourceName, 'Directory is ' + targetFolder.name)

        const success: boolean = true
        const result: exTb.AMessageHeader = []

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

    //         // Allow unified renaming rules here
    //         // subjectCorrections is the translation Map oldSubject (key) --> newSubject (value)
    //         // TODO: Identify unique subject names and allow user to modify it globally
    //         //       We currently use a same --> same map of subject corrections
    //         const subjectCorrections: Map<string, string> = new Map<string, string>()
    //         subjectOfMessage.forEach((value, key) => { subjectCorrections.set(value, value) })

    //         // Exfilter messages
    //         const promises: Array<Promise<void>> = []
    //         for (const messageHeader of allMessages) {

    //             // Export EML and PDF files asynchronously
    //             promises.push(exfilterMessage(messageHeader))
                
    //         }
    //         await Promise.all(promises)
        
    //         // Happy end
    //         return true

    //     } catch (error) {
            
    //         // An error occurs
    //         log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
    //         return false

    //     }

    // }

    /**
     * Create the map of the oldSubject --> newSubject values after having
     * applied the provided rules to the current list of headers
     * @param {exTb.AMessageHeader} allHeaders is the array containing all the
     *         messageheader to clean the subjects of. They will stay untouched
     *         as only the modification dictionary are returned in the 
     *         <oldSubject;newSubject> result.
     * @param {Map<RegExp | string, string>} rules is a list of rules to apply
     *         to the subjects. It can be a 'string' --> 'string' replacement
     *         or a /RegExp/ --> 'string' replacement where the matching groups
     *         of the regexp can be used with the $1, $2, etc. syntax 
     * @returns {Promise<Map<string, string> | null>} is the map of 
     *         <oldSubject;newSubject> pairs.
     *         Is null if an error occurs; 
     *         Is empty if no change is observed or if there where no message
     */
    async function cleanNames (allHeaders: exTb.AMessageHeader,
                                rules: Map<RegExp | string, string>):
                        Promise<Map<string, string> | null> {

        const cSourceName = 'project/main.ts/cleanNames'

        // Trivial case
        if (rules.size === 0) {

            // No rule, no entry in the map
            return (new Map<string, string>())

        }

        // Do
        try {
            
            const result: Map<string, string> = new Map<string, string>()

            // Parse every header with every rule
            allHeaders.forEach((header) => {
            
                const oldSubject: string = header.subject

                if (!result.has(oldSubject)) {

                    let   newSubject: string = oldSubject

                    rules.forEach((replacement, rule) => {

                        newSubject = newSubject.replace(rule, replacement)

                    })

                    if (newSubject !== oldSubject) {

                        result.set(oldSubject, newSubject)

                    }

                }

            })

            // Happy end
            return result

        } catch (error) {

            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
            return null

        }

    }



    // --------------- Utility functions

    /**
     * Create a jsPDF document displaying the provided message
     * Sources:
     *      https://stackoverflow.com/questions/18191893/generate-pdf-from-html-in-div-using-javascript
     *      https://github.com/parallax/jsPDF                  
     * @param {object} header is the header of the message (contains subject, sender or date)
     * @param {object} message is the full message (contains body and attachments)
     * @returns {Promise<jsPDF>} is the PDF file created from the provided message
     */
    async function createPdf (header: messenger.messages.MessageHeader,
                              message: messenger.messages.MessagePart): Promise<jsPDF> {
        
        const cSourceName: string = 'project/main.ts/createPdf'

        // Retrieve the template page
        let myHtml: Document | undefined = await loadResourceHtml(cResourcePdfTemplate)

        log().debugInfo(cSourceName, 'Resource loaded: ' + (myHtml === undefined ? 'failure' : 'success'))

        if (myHtml === undefined) {

            log().debugInfo(cSourceName, 'Build Html locally')

            // Create the Html page from scratch
            const myDOM: DOMImplementation = document.implementation
            myHtml = myDOM.createHTMLDocument(header.subject)
            const myTag: HTMLElement = myHtml.createElement('p')
            myTag.setAttribute('id', cHtmlPdfTemplateSubjectId)
            myHtml.body.appendChild(myTag)

        }

        // Get html code of the page
        const rawHtml = myHtml.textContent
        log().debugInfo(cSourceName, 'Html code: ' + rawHtml)

        // Set properties of header
        const myTag = myHtml.getElementById(cHtmlPdfTemplateSubjectId)
        if ( myTag != null) myTag.innerHTML = header.subject

        // Create the PDF from the Html
        const pdfFile = new jsPDF()
        await pdfFile.html(myHtml.body)
        myHtml.close()
        return pdfFile

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
     * @param {FileSystemDirectoryHandle} params.targetPath is the target directory where 
     *                 to save the files in.
     *                 If not provided, then save it in the current default path
     *                 Note: Not used in current implementation due to security limitation
     *                       to access folders from Firefox/Thunderbird
     * @returns {Promise<void>} is a lone Promise
     */
    async function exfilterMessage (messageHeader: messenger.messages.MessageHeader,
                                            params?: {
                                                filename?: string
                                                subject?: string
                                                targetPath?: FileSystemDirectoryHandle
                                            }
                                        ): Promise<void> {

        const cSourceName: string = 'project/main.ts/exfilterMessage'


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
                const who: string = messageHeader?.author ?? '(hidden)'
                const what: string = messageHeader?.subject ?? '(no object)'

                // Format date item
                const formatter = (value: number, count: number = 2): string => {

                    count = Math.abs(count)
                    return ('0'.repeat(count) + value.toString()).slice(-count)

                }

                filename = datetimeToStringTag(when)
        
                
                                // +
                        // '__' + who +
                        // '__' + what

            }


            log().debugInfo(cSourceName, 'filename = ' + filename)

            // Retrive full message
            const rawMessage: ex.nFile = await messenger.messages.getRaw(messageHeader.id) as ex.nFile
            
            if (rawMessage != null) {

                log().debugInfo(cSourceName, 'rawMessage loaded')

                // Save PDF File
                const pdfDoc: jsPDF = await createPdf(messageHeader, rawMessage)
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
                downloadFile(rawMessage, (filename + '.eml'), 'text/eml')
                log().debugInfo(cSourceName, 'EML File saved as ' + (filename + '.eml'))

                // Print message
                // Show the message in a temporary window
                // let tabMessage:messenger.tabs.Tab = messenger.messageDisplay.open({messageId: messageHeader.id});

            }

        } catch (error) {
        
            log().raiseError(cSourceName, cRaiseUnexpected + ': ' + (error as Error).message, error as Error)

        }
                                
    }


    /**
     * Clean the provided subject string
     * @param {string} subject is the subject of the message, to clean
     * @param {SubjectCleaningParams} rules is the set of rules to apply
     * @returns {string} is the cleaned subject (removing 'RE:', 'Fwd:', etc)
     */
    function cleanMessageSubject (subject: string, rules: SubjectCleaningParams): string {

        return subject

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
