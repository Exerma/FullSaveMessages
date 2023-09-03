/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023  
 * ---------------------------------------------------------------------------
 *  message.js
 * ---------------------------------------------------------------------------
 *
 * Versions:
 *   2023-08-27: First version
 * 
 */

    // ---------- Imports
    import { exMessageNames } from '../exerma_base/exerma_messages'


    // ---------- Extend list of available messages
    declare module '../exerma_base/exerma_messages' {

        export enum exMessageNames {
            myMessage = 'myMessage'
        }

    }
