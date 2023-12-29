/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023  
 * ---------------------------------------------------------------------------
 *  welcome_archives.ts
 * ---------------------------------------------------------------------------
 *
 * The welcome page for archives allows the user to modify cleaned list
 * of subjects to use as export files.
 * 
 * Versions:
 *   2023-11-13: Add: Manage change in display of senders
 *   2023-09-09: First version
 * 
 */

    // --------------- Imports
    import type * as ex                        from '../exerma_base/exerma_types'
    import type * as exTb                      from '../exerma_tb/exerma_tb_types'
    import { cEventClick, cEventLoad, cNullString }         from '../exerma_base/exerma_consts'
    import { createAndAddElement }             from '../exerma_base/exerma_dom'
    import log, { cRaiseUnexpected, cInfoStarted } from '../exerma_base/exerma_log'
    import { showDirectoryPicker }             from '../../dependancies/native-file-system-adapter/native-file-system-adapter'
    import {
            CMessageExfilterMails,
            CMessageLoadMailHeaders
            }                                  from '../project/project_messages'
    import { welcomeArchivesDispatcher }       from './welcome_archives_dispatcher'
    import { ProjectStorage }                  from '../project/project_storage'
    import {
            StorageKind,
            getStorageAsNumber
            } from '../exerma_tb/exerma_tb_storage'
    import {
            cleanSubjects,
            cleanPersons,
            askForTargetFolder
            } from '../project/project_main'
    


    // ----- Popup page for archiving
    const cHtmlPopArchivesHeader:            string = 'header'
    const cHtmlPopArchivesStartButtonId:     string = 'continue'
    const cHtmlPopArchivesCancelButtonId:    string = 'cancel'

    const cHtmlPopArchivesHeaderSubjectBloc: string = 'header_subjects'
    const cHtmlPopArchivesMailSubjects:      string = 'mailsubjects'
    const cHtmlPopArchivesClassSubjectBloc:  string = 'mailsubject'

    const cHtmlPopArchivesHeaderSenderBloc:  string = 'header_senders'
    const cHtmlPopArchivesMailSenders:       string = 'mailsenders'
    const cHtmlPopArchivesClassSenderBloc:   string = 'mailsender'

    const cHtmlPopArchivesClassOriginal:     string = 'original'
    const cHtmlPopArchivesClassTextField:    string = 'textbox'
    

    // --------------- Local members
    /**
     * Store the list of message header received with the presentUniqueNamesToUser() function
     */
    let gTargetHeaders: exTb.AMailHeader
    let gMailsOfTabId: ex.uNumber
    let gSelectedOnly: boolean
    let gBeforeAfterSubjects: ex.MStringString  // <raw subject;cleaned subject>
    let gBeforeAfterSenders: ex.MStringString   // <raw sender;cleaned sender>

    // --------------- Functions

    /**
     * Start the welcome popup page for archives
     * @returns {Promise<void>}
     */
    async function start (): Promise<void> {

        const cSourceName = 'pages/welcome_archives.ts/start'

        log().debugInfo(cSourceName, cInfoStarted)

        try {

            // Activate the message catcher to manage requests and answers
            messenger.runtime.onMessage.addListener(welcomeArchivesDispatcher)

            // Init global variables
            gTargetHeaders = []
            gMailsOfTabId = undefined
            gSelectedOnly = false

            // Force download of a dummy file to set the default "current path"
            const picker = document.getElementById('directory_picker')
            picker?.addEventListener('click', async function () {

                const tempLink = document.createElement('a')
                const taBlob = new Blob(['You can delete this file'], { type: 'text/plain' })
                tempLink.setAttribute('href', URL.createObjectURL(taBlob))
                tempLink.setAttribute('download', 'dummy.txt')
                tempLink.click()
                URL.revokeObjectURL(tempLink.href)

            })


            // Init page
            await initWelcomeArchive()

            // Start loading emails
            // 1) Load emails in main project context: 
            //    - with CMessageLoadMailHeaders() catched by projectDispatcher
            //    - answer with a CMessageMailHeadersLoaded() catched by welcomeArchivesDispatcher 
            // 2) Apply filters in popup context: message C
            // 3) 

            log().debugInfo(cSourceName, 'Sending message')

            const tabId: ex.uNumber = await getStorageAsNumber(StorageKind.session,
                                                               ProjectStorage.currentTabId)
            void messenger.runtime.sendMessage(new CMessageLoadMailHeaders({
                                                        sentBy: cSourceName,
                                                        answerTo: undefined,
                                                        mailsOfTabId: tabId,
                                                        selectedOnly: true,
                                                        messageId: cSourceName
                                                    }))

            log().debugInfo(cSourceName, 'Message sent')

        } catch (error) {

            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }

    }


    /**
     * Initialisation of the welcome panel of archives
     */
    export async function initWelcomeArchive (): Promise<void> {

        const cSourceName = 'pages/welcome_archives.ts/initWelcomeArchive'

        try {

            // Add listeners to the static reactive parts of the page (buttons)
            addPageListeners()

        } catch (error) {

            console.log((error as Error).message)

        }
    }

    /**
     * Connect the buttons
     */
    function addPageListeners (): void {

        document.getElementById(cHtmlPopArchivesStartButtonId)?.addEventListener(cEventClick, saveAndArchiveContinue)
        document.getElementById(cHtmlPopArchivesCancelButtonId)?.addEventListener(cEventClick, saveAndArchiveCancelled)

    }


    /**
     * Event handler for the 'Continue' button
     */
    async function saveAndArchiveContinue (): Promise<void> {

        const cSourceName: string = 'pages/welcome_archives.ts/saveAndArchiveContinue'

        log().trace(cSourceName, cInfoStarted)

        try {
            // --> Get the target path
            const targetPath: string = await askForTargetFolder()

            // --> Retrieve subjects to use for messages exfiltration
            const subjectReplacement: ex.MStringString = await buildUserReplacements(cHtmlPopArchivesClassSubjectBloc)
    
            // gBeforeAfterSubjects.forEach((value, key) => {
            //     log().debugInfo(cSourceName, 'BeforeAfter: [' + key + '] ---> [' + value + ']')
            // })
            // subjectReplacement.forEach((value, key) => {
            //     log().debugInfo(cSourceName, 'subjectReplacement: [' + key + '] ---> [' + value + ']')
            // })

            // Build the email corrected subjectfor each email
            const mailsSubjects: ex.MNumberString = new Map<number, string>()
            gTargetHeaders.forEach(value => {
    
                // Make double correction to subject: "beforeAfterSubjects" contains the
                // general cleaning correction (like removing the "Frw:" prefixes)
                // and "subjectReplacement" contains the final corrections of the
                // user.
                let subject: string = value.subject
                subject = gBeforeAfterSubjects.get(subject) ?? subject
                subject = subjectReplacement.get(subject) ?? subject
    
                mailsSubjects.set(value.id, subject)
    
            })

            // --> Same for Sender    
            const senderReplacement: ex.MStringString = await buildUserReplacements(cHtmlPopArchivesClassSenderBloc)

            // Build the email corrected subjectfor each email
            const mailsSenders: ex.MNumberString = new Map<number, string>()
            gTargetHeaders.forEach(value => {
    
                // Make double correction to subject: "beforeAfterSenders" contains the
                // general cleaning correction (like removing the "<email:xxx>:" prefixes)
                // and "subjectReplacement" contains the final corrections of the
                // user.
                let sender: string = value.author
                sender = gBeforeAfterSenders.get(sender) ?? sender
                sender = senderReplacement.get(sender) ?? sender
    
                mailsSenders.set(value.id, sender)
    
            })

            // Finalize in the main thread
            void messenger.runtime.sendMessage(new CMessageExfilterMails({
                                                        sentBy: cSourceName,
                                                        messageId: cSourceName,
                                                        mailsOfTabId: gMailsOfTabId,
                                                        selectedOnly: gSelectedOnly,
                                                        mailsHeaders: gTargetHeaders,
                                                        mailsSubjects,
                                                        mailsSenders,
                                                        targetDirectory: targetPath
                                                    }))

        } catch (error) {

            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }

        // Close this window
        const myWindow: messenger.windows.Window = await messenger.windows.getCurrent()
        void messenger.windows.remove(myWindow?.id ?? 0)

    }

    /**
     * Event handler for the 'Cancel' button
     */
    async function saveAndArchiveCancelled (): Promise<void> {

        const cSourceName: string = 'pages/welcome_archives.ts/saveAndArchiveCancelled'

        log().trace(cSourceName, cInfoStarted)

        // Close this window
        const myWindow: messenger.windows.Window = await messenger.windows.getCurrent()
        void messenger.windows.remove(myWindow?.id ?? 0)

    }


    /**
     * Clean the provided names and show all unique resulting names to the user to allow
     * her to modify them.
     * @param {object.messages.MessageHeader[]} headers is the list of all mail headers to show (after cleaning and unique names
     *                  only)
     * @param {ex.uNumber} mailsOfTabId is the Id of the tab to exfilter the messages of
     * @param {boolean} selectedOnly is used to exfilter only the selected messages (if true) or
     *                  all the messages (if false)
     */
    export async function presentUniqueNamesToUser (headers: exTb.AMailHeader,
                                                    mailsOfTabId: ex.uNumber,
                                                    selectedOnly: boolean): Promise<void> {

        const cSourceName = 'pages/welcome_archives.ts/presentUniqueNamesToUser'

        log().trace(cSourceName, cInfoStarted)

        try {
            
            // Save parameters (especialy the list of headers for later use by buildFinalSubjectReplacements)
            // FIXME: Currently getStorageAsArray() don't manage correctly arrays... We thus 
            //        use the global targetHeaders object in buildFinalSubjectReplacements() 
            //        and presentUniqueNamesToUser()
            gTargetHeaders = headers
            gMailsOfTabId = mailsOfTabId
            gSelectedOnly = selectedOnly

            // Show title to the user
            createAndAddElement(document, 'h1', {
                innerText: headers.length + (headers.length === 1 ? ' message' : ' messages'),
                targetId: cHtmlPopArchivesHeader
            })

            // Clean subjects and save cleaned version (for later use by buildFinalSubjectReplacements)
            const beforeAfterSubjects: ex.uMStringString = await cleanSubjects(headers)
            gBeforeAfterSubjects = beforeAfterSubjects ?? new Map<string, string>()

            // Display objects to the user
            const insertionSubject: ex.nHTMLElement = document.getElementById(cHtmlPopArchivesMailSubjects)
            if (insertionSubject != null) {

                const uniqueSubjects: ex.MStringString = new Map<string, string>()
                headers.forEach(async (value) => {

                    // Convert and remove duplicates
                    const oldSubject: string = value.subject
                    const newSubject: string = ((   beforeAfterSubjects?.has(oldSubject) ?? false
                                                 ?  beforeAfterSubjects?.get(oldSubject)
                                                 :  oldSubject)
                                                 ?? oldSubject
                                                ).trim()
                        
                    if (!uniqueSubjects.has(newSubject)) {
                        // Add new subject to the list of unique values to show
                        uniqueSubjects.set(newSubject, cNullString)
                    }

                })

                // Show the number of subjects
                const hSubjects = document.getElementById(cHtmlPopArchivesHeaderSubjectBloc)
                if (hSubjects != null) {
                    hSubjects.innerText = uniqueSubjects.size.toString() + ' sujets de messages'
                }

                // Create HTML objects
                uniqueSubjects.forEach(async (value, key) => { void buildSubjectEntry(key, insertionSubject) } )

                

            }

            // Clean subjects and save cleaned version (for later use by buildFinalSubjectReplacements)
            const beforeAfterSenders: ex.uMStringString = await cleanPersons(headers)
            gBeforeAfterSenders = beforeAfterSenders ?? new Map<string, string>()

            // Display senders to the user
            const insertionSender: ex.nHTMLElement = document.getElementById(cHtmlPopArchivesMailSenders)
            if (insertionSender != null) {

                
                const uniqueSenders: ex.MStringString = new Map<string, string>()
                headers.forEach(async (value) => {

                    // Convert and remove duplicates
                    const oldSender: string = value.author.trim()
                    const newSender: string = ((   beforeAfterSenders?.has(oldSender) ?? false
                                                ?  beforeAfterSenders?.get(oldSender)
                                                :  oldSender)
                                                ?? oldSender
                                               ).trim()
                        
                    if (!uniqueSenders.has(newSender)) {
                        // Add new subject to the list of unique values to show
                        uniqueSenders.set(newSender, cNullString)
                    }

                })

                // Show the number of senders
                const hSenders = document.getElementById(cHtmlPopArchivesHeaderSenderBloc)
                if (hSenders != null) {
                    hSenders.innerText = uniqueSenders.size.toString() + ' expéditeurs'
                }
            
                // Create HTML objects
                uniqueSenders.forEach(async (value, key) => { void buildSenderEntry(key, insertionSender) } )

            }

        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }
    }

    /**
     * Create the HTML entry to display a subject to the user in format:
     *      <div class="mailsubject">
     *          <p class="original"></p>
     *          <input class="textbox" type="text"></input>
     *      </div>
     * @param {string} subject is the text to show as original name and as text 
     *                  to modify in the input box
     * @param {HTMLElement | undefined} insertPoint is the HTML element to attach the
     *                  entry to
     * @returns {Promise<HTMLElement | undefined>} is the newly created HTML node
     *                  (already attached to the provided insertionPoint if provided)
     */
    async function buildSubjectEntry (subject: string, insertPoint?: ex.uHTMLElement): Promise<ex.uHTMLElement> {

        const cSourceName = 'pages/welcome_archives.ts/buildSubjectEntry'

        try {
            
            // Div entry
            const entry: ex.uHTMLElement = createAndAddElement(
                    document,
                    'div',
                    {
                        setAttribute: [{
                            name: 'class', value: cHtmlPopArchivesClassSubjectBloc
                        }],
                        target: insertPoint
                    })
            
            // Display original altered name
            const original: ex.uHTMLElement = createAndAddElement(
                    document,
                    'label',
                    {
                        innerText: subject,
                        setAttribute: [{
                            name: 'class', value: cHtmlPopArchivesClassOriginal
                        }],
                        target: entry
                    })

            // Newline
            const br: ex.uHTMLElement = createAndAddElement(document, 'br', { target: original })

            // Textbox to alter the new name
            const textfield: ex.uHTMLElement = createAndAddElement(
                    document,
                    'input',
                    {
                        setAttribute: [
                            { name: 'class', value: cHtmlPopArchivesClassTextField },
                            { name: 'type',  value: 'text' },
                            { name: 'value', value: subject }
                        ],
                        target: original
                    })

            // Done
            return entry

        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }

    }



    /**
     * Create the HTML entry to display a sender name to the user in format:
     *      <div class="mailname">
     *          <p class="original"></p>
     *          <input class="textbox" type="text"></input>
     *      </div>
     * @param {string} sender is the text to show as original name and as text 
     *                  to modify in the input box
     * @param {HTMLElement | undefined} insertPoint is the HTML element to attach the
     *                  entry to
     * @returns {Promise<HTMLElement | undefined>} is the newly created HTML node
     *                  (already attached to the provided insertionPoint if provided)
     */
    async function buildSenderEntry (sender: string, insertPoint?: ex.uHTMLElement): Promise<ex.uHTMLElement> {

        const cSourceName = 'pages/welcome_archives.ts/buildSenderEntry'

        try {
            
            // Div entry
            const entry: ex.uHTMLElement = createAndAddElement(
                    document,
                    'div',
                    {
                        setAttribute: [{
                            name: 'class', value: cHtmlPopArchivesClassSenderBloc
                        }],
                        target: insertPoint
                    })
            
            // Display original altered name
            const original: ex.uHTMLElement = createAndAddElement(
                    document,
                    'label',
                    {
                        innerText: sender,
                        setAttribute: [{
                            name: 'class', value: cHtmlPopArchivesClassOriginal
                        }],
                        target: entry
                    })

            // Newline
            const br: ex.uHTMLElement = createAndAddElement(document, 'br', { target: original })

            // Textbox to alter the new name
            const textfield: ex.uHTMLElement = createAndAddElement(
                    document,
                    'input',
                    {
                        setAttribute: [
                            { name: 'class', value: cHtmlPopArchivesClassTextField },
                            { name: 'type',  value: 'text' },
                            { name: 'value', value: sender }
                        ],
                        target: original
                    })

            // Done
            return entry

        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }

    }


    /**
     * 
     * @param {string} parentBlocClass is the class name to use to retrieve all the elements containing the
     *                  replacement rules of the user
     * @returns {Map<string, string>} is the list of actual *cleaned* mail subject to the alternative
     *                  name the user wants to use instead
     */
    async function buildUserReplacements (parentBlocClass: string): Promise<ex.MStringString> {

        const cSourceName = 'pages/welcome_archives.ts/buildUserReplacements'

        log().trace(cSourceName, cInfoStarted)

        try {

            const result: ex.MStringString = new Map<string, string>()

            const allDivs = document.getElementsByClassName(parentBlocClass)
            for (let iDiv = 1; iDiv < allDivs.length; ++iDiv) {

                if (allDivs.item(iDiv) instanceof HTMLElement) {
                    
                    const divItem = allDivs.item(iDiv) as HTMLDivElement
                    const cleanedTag = divItem.getElementsByClassName(cHtmlPopArchivesClassOriginal).item(0) as HTMLLabelElement
                    const modifiedTag = divItem.getElementsByClassName(cHtmlPopArchivesClassTextField).item(0) as HTMLInputElement

                    const cleaned = cleanedTag.innerText.trim()
                    const modified = modifiedTag.value.trim()
                    result.set(cleaned, modified)

                }

            }

            return result

        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
            return new Map<string, string>()

        }

    }

    // Start the welcome popup for archives
    // void start()
    window.addEventListener(cEventLoad, start, { once: true, passive: true })

