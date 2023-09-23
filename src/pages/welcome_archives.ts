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
 *   2023-09-09: First version
 * 
 */

    // --------------- Imports
    import type * as ex                        from '../exerma_base/exerma_types'
    import type * as exTb                      from '../exerma_tb/exerma_tb_types'
    import { cEventClick, cEventLoad, cNullString }         from '../exerma_base/exerma_consts'
    import { createAndAddElement }             from '../exerma_base/exerma_dom'
    import log, { cRaiseUnexpected, cInfoStarted } from '../exerma_base/exerma_log'
    import {
            CMessageInitWelcomeArchiveWithTab,
            CMessageLoadMailHeaders,
            CMessageMailHeadersLoaded
            }                                  from '../project/project_messages'
    import { welcomeArchivesDispatcher }       from './welcome_archives_dispatcher'
    import { ProjectStorage }                  from '../project/project_storage'
    import { StorageKind, getStorageAsNumber } from '../exerma_tb/exerma_tb_storage'
    import { cleanNames }                      from '../project/project_main'


    // ----- Popup page for archiving
    const cHtmlPopArchivesHeader:         string = 'header'
    const cHtmlPopArchivesStartButtonId:  string = 'continue'
    const cHtmlPopArchivesCancelButtonId: string = 'cancel'

    const cHtmlPopArchivesMailNames:      string = 'mailnames'
    const cHtmlPopArchivesClassSubject:   string = 'subject'
    const cHtmlPopArchivesClassOriginal:  string = 'original'
    const cHtmlPopArchivesClassTextField: string = 'textfield'
    

    // --------------- Functions

    /**
     * Start the welcome popup page for archives
     * @returns {Promise<void>}
     */
    async function initPopup (): Promise<void> {

        const cSourceName = 'pages/welcome_archives.ts/start'

        log().debugInfo(cSourceName, cInfoStarted)

        try {

            // Activate the message catcher to manage requests and answers
            messenger.runtime.onMessage.addListener(welcomeArchivesDispatcher)

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

        const cSourceName: string = 'pages/welcome_archives/saveAndArchiveContinue'

        log().debugInfo(cSourceName, cInfoStarted)

        // Close this window
        const myWindow: messenger.windows.Window = await messenger.windows.getCurrent()
        void messenger.windows.remove(myWindow?.id ?? 0)

    }

    /**
     * Event handler for the 'Cancel' button
     */
    async function saveAndArchiveCancelled (): Promise<void> {

        const cSourceName: string = 'pages/welcome_archives/saveAndArchiveCancelled'

        log().debugInfo(cSourceName, cInfoStarted)

        // Close this window
        const myWindow: messenger.windows.Window = await messenger.windows.getCurrent()
        void messenger.windows.remove(myWindow?.id ?? 0)

    }


    /**
     * Clean the provided names and show all unique resulting names to the user to allow
     * her to modify them.
     * @param {object.messages.MessageHeader[]} headers is the list of all mail headers to show (after cleaning and unique names
     *                  only)
     */
    export async function presentUniqueNamesToUser (headers: exTb.AMailHeader): Promise<void> {

        const cSourceName = 'pages/welcome_archives/presentUniqueNamesToUser'

        try {
            
            // Show title to the user
            createAndAddElement(document, 'h1', {
                innerText: headers.length + (headers.length === 1 ? ' message' : ' messages'),
                targetId: cHtmlPopArchivesHeader
            })

            // Clean names
            const beforeAfter: ex.uMStringString = await cleanNames(headers)

            // Display names to the user
            const insertionPoint: ex.nHTMLElement = document.getElementById(cHtmlPopArchivesMailNames)
            if (insertionPoint != null) {

                const uniqueNames: ex.MStringString = new Map<string, string>()
                headers.forEach(async (value) => {

                    // Convert and remove duplicates
                    const oldSubject: string = value.subject
                    const newSubject: string = ( beforeAfter?.has(oldSubject) ?? false
                                                ? beforeAfter?.get(oldSubject)
                                                : oldSubject)
                                                ?? oldSubject
                        
                    if (!uniqueNames.has(newSubject)) {
                        // Build entry for user
                        const newEntry: ex.uHTMLElement = await buildSubjectEntry(newSubject, insertionPoint)
                        // Add new subject to the list of unique values to show
                        uniqueNames.set(newSubject, cNullString)
                    }

                })

            }


        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }
    }

    /**
     * Create the HTML entry to display a subject to the user in format:
     *      <div class="subject">
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

        const cSourceName = 'pages/welcome_archives/buildSubjectEntry'

        try {
            
            // Div entry
            const entry: ex.uHTMLElement = createAndAddElement(
                    document, 'div',
                    {
                        setAttribute: [{
                            name: 'class',
                            value: cHtmlPopArchivesClassSubject
                        }],
                        target: insertPoint
                    })
            
            // Display original altered name
            const original: ex.uHTMLElement = createAndAddElement(
                    document, 'p',
                    {
                        innerText: subject,
                        setAttribute: [{
                            name: 'class',
                            value: cHtmlPopArchivesClassOriginal
                        }],
                        target: entry
                    })

            // Textbox to alter the new name
            const textfield: ex.uHTMLElement = createAndAddElement(
                    document, 'input',
                    {
                        setAttribute: [
                            { name: 'class', value: cHtmlPopArchivesClassTextField },
                            { name: 'type',  value: 'text' },
                            { name: 'value', value: subject }
                        ],
                        target: entry
                    })

            // Done
            return entry

        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }

    }


    // Start the welcome popup for archives
    // void start()
    window.addEventListener(cEventLoad, initPopup, { once: true, passive: true })

