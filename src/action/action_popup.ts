/* ----------------------------
 *  (c) Patrick Seuret, 2023
 * ----------------------------
 *  action_popup.js
 * ----------------------------
 *
 * Versions:
 *   2024-06-09: Add: Show version of the add-in to the user
 *   2023-08-20: Chg: Make this module an export class with static functions
 *   2023-07-17: First version
 *
 */

    // ---------- Import
    // import * as ex from ''
    import * as EventNames from 'exerma_consts'
    import * as exMain from '../project/project_main'
    // import log, { cRaiseUnexpected, cInfoStarted } from 'exerma_log'
    // import { exLangFuture } from '../../node_modules/exerma_ts_base/lib/exerma_lang'


    /**
     * This is the function called when the popup window is shown (aka when
     * the user clicks the button)
     * It is actually called as the last command in this file
     */
    export async function start (): Promise<void> {

        const cSourceName = 'action/action_popup.ts/start'
        
        try {

            log().debugInfo(cSourceName, cInfoStarted)
            // Source: https://developer.mozilla.org/en-US/docs/Web/Events#event_listing
            //         https://bobbyhadz.com/blog/typescript-add-click-event-to-button
            document.getElementById(exMain.cPopupArchiveButton)?.addEventListener(EventNames.cEventClick, exMain.onArchiveButtonClick)
            document.getElementById(exMain.cPopupSaveAttachButton)?.addEventListener(EventNames.cEventClick, exMain.onSaveAttachButtonClick)
            document.getElementById(exMain.cPopupTestButton)?.addEventListener(EventNames.cEventClick, exMain.onTestButtonClick)

            // Store the current MailTab.id to make it available by the welcome_archive page
            await exMain.storeCurrentMailTabId()

            // Show version to user
            const versionTag = document.getElementById(exMain.cAddinVersionId)
            if (versionTag instanceof HTMLParagraphElement) {
                versionTag.innerText = exLangFuture('Version: ') + exMain.cAddinVersion
            }


        } catch (error) {

            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
            throw error

        }

    }

    // ---------- Direct code called when user clicks the button
    window.addEventListener(EventNames.cEventLoad, start, { once: true, passive: true })

