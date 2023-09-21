/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023  
 * ---------------------------------------------------------------------------
 *  background.js
 * ---------------------------------------------------------------------------
 *
 * Versions:
 *   2023-07-17: First version
 * 
 */

    // ---------- Imports
    // import { exTbMessages } from "../exerma_tb/exerma_tb_messages";
    import log, { cInfoStarted }     from '../exerma_base/exerma_log'
    import { projectDispatcher } from '../project/project_dispatcher'

    /**
     * Background script is begining
     */
    export function start (): any {

        const cSourceName = 'background/background.ts/start'
        
        try {

            log().debugInfo(cSourceName, cInfoStarted)

            // Init service worker
            messenger.runtime.onMessage.addListener(projectDispatcher)

            // Add listener to the action button
            // browser.action.onClicked.addListener(exMain.onActionButtonClick);

        } catch (error) {

            console.log(error)
            throw error

        }

    }


    // ---------- Direct code called when the addon is started
    start()
