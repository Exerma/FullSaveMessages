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
    import type * as ex from '../exerma_base/exerma_types'
    import { cEventClick, cEventLoad } from '../exerma_base/exerma_consts'
    import { createAndAddElement } from '../exerma_base/exerma_dom'
    import log, { cRaiseUnexpected, cInfoStarted } from '../exerma_base/exerma_log'
    import { CMessageInitWelcomeArchiveWithTab, CMessageLoadMailHeaders, CMessageMailHeadersLoaded } from '../project/project_messages'
    import { welcomeArchivesDispatcher } from './welcome_archives_dispatcher'


    // ----- Popup page for archiving
    const cHtmlPopArchivesHeader: string = 'header'
    const cHtmlPopArchivesStartButtonId: string = 'continue'
    const cHtmlPopArchivesCancelButtonId: string = 'cancel'

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

            // Init page
            await initWelcomeArchive()

            // Start loading emails
            // 1) Load emails in main project context: 
            //    - with CMessageLoadMailHeaders() catched by projectDispatcher
            //    - answer with a CMessageMailHeadersLoaded() catched by welcomeArchivesDispatcher 
            // 2) Apply filters in popup context: message C
            // 3) 

            log().debugInfo(cSourceName, 'Sending message')

            void messenger.runtime.sendMessage(new CMessageLoadMailHeaders({
                                                        sentBy: cSourceName,
                                                        answerTo: undefined,
                                                        mailsOfTabId: undefined,
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
     * @param {number} tabId is the tabId to load the messages of
     */
    export async function initWelcomeArchive (tabId?: ex.uNumber): Promise<void> {

        const cSourceName = 'pages/welcome_archives.ts/initWelcomeArchive'

        try {

            log().debugInfo(cSourceName, 'TabId = ' + tabId ?? 0)

            // Show title to the user
            createAndAddElement(document, 'h1', {
                innerText: 'Hello',
                targetId: cHtmlPopArchivesHeader
            })

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

    // Start the welcome popup for archives
    // void start()
    window.addEventListener(cEventLoad, start, { once: true, passive: true })

