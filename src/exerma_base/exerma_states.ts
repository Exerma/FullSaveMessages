/*----------------------------
 *  (c) Patrick Seuret, 2023  
 *----------------------------
 *  exerma_states.js
 *----------------------------
 *
 * Versions:
 *   2023-08-27: First version
 * 
 */


/**
 * Exerma states have to be unique in application
 * @name The name of the message (which is unique in the application through the exMessageNames enum)
 * @caller The name of the caller
 * Data have to be message specific
 */
  export enum exStates {

    hungry,
    ready,
    busy,
    deleted

 }
