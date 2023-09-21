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
    import { type DispatcherReturnType, CMessage } from '../exerma_base/exerma_messages'
    import { CMessageInitWelcomeArchiveWithTab } from '../project/project_messages'


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
            void initWelcomeArchive()

        } catch (error) {

            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }

    }

    // eslint-disable-next-line jsdoc/no-undefined-types
    /**
     * Catch and dispatch messages received by the welcome_archives content-script
     * https://developer.chrome.com/docs/extensions/mv3/messaging/
     * @param {any} request is the received message we have to answer to (or not)
     * @param {object.runtime.MessageSender} sender is the caller object
     * @param {() => void} sendResponse is a callback function to return the answer with,
     *             but the best practice is to return **synchronously** a Promise object
     *             or return false if the message is not handled
     * @returns {DispatcherReturnType} is a premise if the message was processed, 
     *             and is false if the message was not handled
     */
    function welcomeArchivesDispatcher (request: any,
                                        sender: messenger.runtime.MessageSender,
                                        sendResponse: () => void): DispatcherReturnType {

        const cSourceName = 'pages/welcome_archives.ts/welcomeArchivesDispatcher'

        try {
                    
            if (request instanceof CMessageInitWelcomeArchiveWithTab) {
                
                // Main process starts initialisation
                log().debugInfo(cSourceName, 'Message received: ' + request.name)

                void initWelcomeArchive(request.mailsOfTabId) // document is undefined
                sendResponse()
                return true

            }
        
            // Message not managed
            return false

        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
            return false

        }

    }

    /**
     * Initialisation of the welcome panel of archives
     * @param {number} tabId is the tabId to load the messages of
     */
    async function initWelcomeArchive (tabId?: ex.uNumber): Promise<void> {

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
    window.addEventListener(cEventLoad, start, false)

