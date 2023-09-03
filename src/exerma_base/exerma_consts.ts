/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023  
 * ---------------------------------------------------------------------------
 *  exerma_consts.js
 * ---------------------------------------------------------------------------
 *
 * Versions:
 *   2023-08-20: First version
 * 
 */

// ---------- Imports

// ---------- Exports
/** Empty string */
export const cNullString: string = ''


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


