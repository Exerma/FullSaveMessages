/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023  
 * ---------------------------------------------------------------------------
 *  exerma_messages.js
 * ---------------------------------------------------------------------------
 *
 * Versions:
 *   2023-08-27: First version
 * 
 */

    // ---------- Imports
    import { cNullString } from './exerma_consts'

    // ---------- Exports
    // type exMessageCallback = ()

    /**
     * Exerma messages are always made of:
     * @name The name of the message (which is unique in the application through the exMessageNames enum)
     * @caller The name of the caller
     * Data have to be message specific
     */
    export interface exMessages {

        // Message minimum members
        readonly name: exMessageNames
        readonly caller: string
        readonly uid: string
        
    }

    /**
     * List of unique message names in the application
     * You can extend it in your `main.ts` or a dedicated `messages.ts` file
     * using the following code structure:
     * 
     *  ``` 
     * declare module "../exerma_base/exerma_messages" {
     *      export enum exMessageNames {
     *          myMessage = "myMessage",
     *      }
     *  }
     * ```
     * 
     * See: https://www.typescriptlang.org/docs/handbook/declaration-merging.html
     * 
     */
    export enum exMessageNames {

        GetState = 'GetState'

    }

    /**
     * Example of a message used to require the state of the application
     * (see exerma_states.ts)
     */
    export class msgGetState implements exMessages {

        name: exMessageNames = exMessageNames.GetState
        caller: string = cNullString
        uid: string = cNullString

        constructor (caller: string = cNullString,
                     uid: string = cNullString) {

            this.caller = caller
            this.uid = uid

        }

    }
