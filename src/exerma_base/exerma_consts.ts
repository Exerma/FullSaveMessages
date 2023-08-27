/*----------------------------
 *  (c) Patrick Seuret, 2023  
 *----------------------------
 *  exerma_consts.js
 *----------------------------
 *
 * Versions:
 *   2023-08-20: First version
 * 
 */

//---------- Imports
 
  
 // Export object
/**
 * Name of events for addEventListener() of DOM objects
 * 
 * Source: https://developer.mozilla.org/en-US/docs/Web/Events#event_listing
 *         https://bobbyhadz.com/blog/typescript-add-click-event-to-button
 * 
 * Use: document.getElementById(exMain.cPopupArchiveButton)?.addEventListener(cEventClick, exMain.onArchiveButtonClick);
 */
export class EventNames {
    
    static readonly cEventClick:string = "click";
    static readonly cEventChange:string = "change";
    static readonly cEventInputChange:string = "input";

}
