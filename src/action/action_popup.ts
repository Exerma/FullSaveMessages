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
import * as EventNames from '../exerma_base/exerma_consts'
import * as exMain from '../project/main'
// import { exTbMessages } from '../exerma_tb/exerma_tb_messages'


/**
 * This is the function called when the popup window is shown (aka when
 * the user clicks the button)
 * It is actually called as the last command in this file
 */
export function start (): any {

    try {

        console.log('Popup window has started')



        // Source: https://developer.mozilla.org/en-US/docs/Web/Events#event_listing
        //         https://bobbyhadz.com/blog/typescript-add-click-event-to-button
        document.getElementById(exMain.cPopupArchiveButton)?.addEventListener(EventNames.cEventClick, exMain.onArchiveButtonClick)
        document.getElementById(exMain.cPopupSaveAttachButton)?.addEventListener(EventNames.cEventClick, exMain.onSaveAttachButtonClick)
        document.getElementById(exMain.cPopupTestButton)?.addEventListener(EventNames.cEventClick, exMain.onTestButtonClick)

        const body: ex.nHTMLElement = document.getElementById('main')
        const cmd: ex.nHTMLElement = document.getElementById('cmdArchive')


    } catch (error) {

        console.log(error)
        throw error

    }

}

// ---------- Direct code called when user clicks the button
start()
