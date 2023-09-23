/* ----------------------------
 *  (c) Patrick Seuret, 2023
 * ----------------------------
 *  action_popup.js
 * ----------------------------
 *
 * Versions:
 *   2023-08-20: Chg: Make this module an export class with static functions
 *   2023-07-17: First version
 *
 */

    // ---------- Import
    import type * as ex from '../exerma_base/exerma_types'
    import type * as exTb from '../exerma_tb/exerma_tb_types'
    import * as EventNames from '../exerma_base/exerma_consts'
    import * as exMain from '../project/project_main'
    import log, { cRaiseUnexpected, cInfoCancelled, cInfoStarted } from '../exerma_base/exerma_log'


    /**
     * This is the function called when the popup window is shown (aka when
     * the user clicks the button)
     * It is actually called as the last command in this file
     */
    export async function start (): Promise<void> {

        const cSourceName = 'action/action_popup.ts/start'
        
        try {

            log().debugInfo(cSourceName, cInfoStarted)

            // Store the current MailTab.id to make it available by the welcome_archive page
            await exMain.storeCurrentMailTabId()

            // Source: https://developer.mozilla.org/en-US/docs/Web/Events#event_listing
            //         https://bobbyhadz.com/blog/typescript-add-click-event-to-button
            document.getElementById(exMain.cPopupArchiveButton)?.addEventListener(EventNames.cEventClick, exMain.onArchiveButtonClick)
            document.getElementById(exMain.cPopupSaveAttachButton)?.addEventListener(EventNames.cEventClick, exMain.onSaveAttachButtonClick)
            document.getElementById(exMain.cPopupTestButton)?.addEventListener(EventNames.cEventClick, exMain.onTestButtonClick)

        } catch (error) {

            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
            throw error

        }

    }

    // ---------- Direct code called when user clicks the button
    window.addEventListener(EventNames.cEventLoad, start, { once: true, passive: true })

