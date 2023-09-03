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
    // import {exMain} from "../project/main";

    /**
     * Background script is begining
     */
    export async function start (): Promise<void> {
        
        try {

            console.log('service_worker script has started')

            // Init
            // await exMain.Init();

            // Add listener to the action button
            // browser.action.onClicked.addListener(exMain.onActionButtonClick);

        } catch (error) {

            console.log(error)
            throw error

        }

    }


    // ---------- Direct code called when the addon is started
    await start()
