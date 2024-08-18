/**
 * 
 */

import messenger = browser

declare namespace browser.localSaveFile {

    // async export function test (text: string): Promise<void>
    async export function saveFile (filename: string, filedata: ArrayBuffer): Promise<number>
    // async export function savePdf (filename: string, htmldata: string): Promise<number>

}
