/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023  
 * ---------------------------------------------------------------------------
 *  exerma_consts.js
 * ---------------------------------------------------------------------------
 *
 * Versions:
 *   2023-10-08: Add: cTypeNameBoolean
 *   2023-08-20: First version
 * 
 */

    // ---------- Imports

    // ---------- Exports
    /** Empty string */
    export const cNullString: string = ''
    export const cNewLine: string = '\n'
    export const cLastInFolder: string = '一Ξ一'
    export const cLastInFolder1: string = 'Ξ' // Special Japonese char
    export const cLastInFolder2: string = '一' // Special Japonese char
    export const cLastInFolder3: string = '末' // Means "End" in Japonese



    // Export object
    /**
     * Name of events for addEventListener() of DOM objects
     * 
     * Source: https://developer.mozilla.org/en-US/docs/Web/Events#event_listing
     *         https://bobbyhadz.com/blog/typescript-add-click-event-to-button
     * 
     * Use: document.getElementById(exMain.cPopupArchiveButton)?.addEventListener(cEventClick, exMain.onArchiveButtonClick);
     */
        
    export const cEventClick: string = 'click'
    export const cEventChange: string = 'change'
    export const cEventInputChange: string = 'input'
    export const cEventLoad: string = 'load'

    export const cTypeNameUnknown: string = 'unknown'
    export const cTypeNameUndefined: string = 'undefined'
    export const cTypeNameDate: string = 'Date'
    export const cTypeNameString: string = 'string'
    export const cTypeNameNumber: string = 'number'
    export const cTypeNameBoolean: string = 'boolean'
    export const cTypeNameObject: string = 'object'
    export const cTypeNameArray: string = 'array'
    export const cTypeNameMap: string = 'map'
