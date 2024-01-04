/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023  
 * ---------------------------------------------------------------------------
 *  exerma_log.js
 * ---------------------------------------------------------------------------
 *
 * For later improvments:
 * https://javascript.plainenglish.io/alternative-libraries-for-console-log-for-your-next-javascript-project-af6bc9a2f2ba
 * https://github.com/unjs/consola
 * 
 * Versions:
 *   2024-01-02: Add: Set different information and raise error levels in production (using exerma_debug.ts/isProduction() )
 *   2023-12-22: Chg: Remove explicit ': string' declarators in constants
 *               Add: cRaiseNotFound
 *   2023-12-03: Chg: Rename class "Logger" into "CLogger"
 *   2023-09-25: Add: Add the "Trace" level as lowest level (below errDebug)
 *   2023-09-09: Add: Allow creation of different logger with name (default name = '')
 *               Add: Allow user to change information and raising levels using levelInfo and levelRaise setters
 *   2023-09-07: First version
 * 
 */

    // --------------- Imports
    import { isProduction } from './exerma_debug'
    import { cNewLine }     from './exerma_consts'
    // import { datetimeToStringTag } from './exerma_misc'  --> Use a locally optimised version of it


    // --------------- Types
    /**
     * Define the error levels that can be raised
     */
    export enum ErrLevel {

        errUndefined = 0,  // Makes this error level Falsy
        errTrace = 1,
        errDebug = 2,
        errInfo = 3,
        errBenine = 4,
        errError = 5,
        errCritical = 6

    }

    /**
     * Define the kind of log 
     */
    export enum LogKind {

        logUndefined = 0,
        logSuccess = 1,
        logFailure = 2,
        logStart = 3

    }

    // --------------- Constants
    // Generic information messages
    export const cInfoStarted            = 'Has started'
    export const cInfoCancelled          = 'Cancelled'
    export const cInfoEnded              = 'Has finished'
    export const cInfoToImplement        = 'Not implemented yet'

    // Generic error messages
    export const cRaiseUnexpected        = 'Unexpected error'
    export const cRaiseInvalidParameter  = 'Invalid parameter value'
    export const cRaiseUninitialized     = 'Object is not initialized'
    export const cRaiseOutOfRange        = 'Out of range value'
    export const cRaiseNotFound          = 'Not found'



    // --------------- Class

    export class CLogger {

        // ---------- Private members
        /**
         * Name of this logger
         * It is shown in every console.log in the {...} part after the date (only if not '')
         */
        private readonly _name: string

        /**
         * The infoLevel is the minimum level for which a log entry will be created
         */
        private _infoLevel: ErrLevel = isProduction() ? ErrLevel.errBenine : ErrLevel.errTrace // ErrLevel.errDebug

        /**
         * The raiseLevel is the minimum level for which the error will be propagated
         */
        private _raiseLevel: ErrLevel = isProduction() ? ErrLevel.errCritical : ErrLevel.errError

        /**
         * 
         */
        private readonly _logHistory: string[] = []




        // ---------- Big four
        /**
         * Ctor
         * @param {string} name is the internal name of the logger (will be shown in every console.log)
         * @param {ErrLevel} setInfoLevel is the information level to assign (default = {ErrLevel.errInfo})
         * @param {ErrLevel} setRaiseLevel is the re-throwing level to assign (default = {ErrLevel.errCritical})
         */
        constructor (name: string = '',
                     setInfoLevel:  ErrLevel = ErrLevel.errUndefined,
                     setRaiseLevel: ErrLevel = ErrLevel.errUndefined) {

            const cSourceName = 'exerma_base/exerma_log.ts/constructor'
    
            // Clean name to remove newlines and leading/tailing whitespaces
            name = name.replaceAll('\n', ' ')
                       .replaceAll(/^[ \t]/g, '')
                       .replaceAll(/[ \t]$/g, '')
            this._name = name

            if (setInfoLevel !== ErrLevel.errUndefined) {
                
                this._infoLevel = setInfoLevel

            }

            if (setRaiseLevel !== ErrLevel.errUndefined) {
                
                this._raiseLevel = setRaiseLevel

            }

        }


        // ---------- Letter and Setter
        public get levelInfo (): ErrLevel {

            return this._infoLevel

        }

        public set levelInfo (level: ErrLevel) {

            this._infoLevel = level

        }

        public get levelRaise (): ErrLevel {

            return this._raiseLevel

        }

        public set levelRaise (level: ErrLevel) {

            this._raiseLevel = level

        }


        // ---------- Public functions

        /**
         * An error is raised
         * @param {ErrLevel} level is the level of the error
         * @param {string} where is the name of the function raising the error
         * @param {string} what is the description of the error
         * @param {object}  options is a list of optional parameters
         * @param {Error}   options.error is the original Error object if provided. It will be
         *                 propagated if the level of the error requires it.
         * @param {LogKind} options.kind is the kind of message to show additional formatting
         *                 with the message
         */
        public raise (level: ErrLevel,
                      where: string,
                      what: string,
                      options?: { error?: Error
                                  kind?: LogKind }): void {

            const cSourceName: string = 'exerma_base/exerma_log/Raise'
            const cFieldSep: string = ' '

            if (   (level !== ErrLevel.errUndefined)
                && (   (level >= this._infoLevel)
                    || (level >= this._raiseLevel))) {
                
                // Create the common message
                const when = new Date(Date.now())
                const errMessage: string = this.logNumberToStringRightAlign(when.getFullYear(), 4)
                                        + '-'
                                        + this.logNumberToStringRightAlign(when.getMonth(), 2)
                                        + '-'
                                        + this.logNumberToStringRightAlign(when.getDate(), 2)
                                        + '--'
                                        + this.logNumberToStringRightAlign(when.getHours(), 2)
                                        + this.logNumberToStringRightAlign(when.getMinutes(), 2)
                                        + this.logNumberToStringRightAlign(when.getSeconds(), 2)
                                        + cFieldSep
                                        + '{' + this._name + '}'
                                        + '(' + where + ')'
                                        + '[' + level + ']'
                                        + cFieldSep
                                        + what.replaceAll(cFieldSep, ' ')
                                            .replaceAll('\n', ' ')
                                        + ((options?.error == null)
                                            ? ''
                                            : cFieldSep
                                            + '[' + options.error.name + ': ' + options.error.message + ']'
                                        )

                // Keep message in history
                this._logHistory.push(errMessage)

                // Show log
                if (level >= this._infoLevel) {

                    console.log(errMessage)

                }
                    
                // Raise error ?
                if (level >= this._raiseLevel) {

                    if (options?.error != null) {

                        throw options.error

                    } else {

                        throw Error(errMessage)

                    }

                }

            }

        }



        // --------------- Aliases for raise()

        /**
         * Show a message (level = ErrLevel.errTrace) in the logging system
         * @param {string} where is same than in raise()
         * @param {string} what is same than in raise()
         */
        public trace (where: string,
                      what: string): void {

            this.raise(ErrLevel.errTrace, where, what)

        }

        /**
         * Show a message (level = ErrLevel.errDebug) in the logging system
         * @param {string} where is same than in raise()
         * @param {string} what is same than in raise()
         */
        public debugInfo (where: string,
                          what: string): void {

            this.raise(ErrLevel.errDebug, where, what)

        }

        /**
         * Show a message (level = ErrLevel.errInfo) in the logging system
         * @param {string} where is same than in raise()
         * @param {string} what is same than in raise()
         */
        public raiseInfo (where: string,
                          what: string): void {

            this.raise(ErrLevel.errInfo, where, what)

        }

        /**
         * Raise a BENINE error (level = ErrLevel.errBenine) in the logging system
         * @param {string} where is same than in raise()
         * @param {string} what is same than in raise()
         * @param {Error} error is same than in raise()
         */
        public raiseBenine (where: string,
                            what: string,
                            error?: Error): void {

            this.raise(ErrLevel.errBenine, where, what, { error })

        }

        /**
         * Raise an ERROR error (level = ErrLevel.errError) in the logging system
         * @param {string} where is same than in raise()
         * @param {string} what is same than in raise()
         * @param {Error} error is same than in raise()
         */
        public raiseError (where: string,
                           what: string,
                           error?: Error): void {

            this.raise(ErrLevel.errError, where, what, { error })

        }

        /**
         * Raise a CRITICAL error (level = ErrLevel.errCritical) in the logging system
         * @param {string} where is same than in raise()
         * @param {string} what is same than in raise()
         * @param {Error} error is same than in raise()
         */
        public raiseCritical (where: string,
                              what: string,
                              error?: Error): void {

            this.raise(ErrLevel.errError, where, what, { error })

        }



        // --------------- Manage history

        /**
         * Retrieve the full history as string
         * @returns {string} is the whole history of logged messages
         */
        public getHistory (): string {

            return this._logHistory.join(cNewLine)

        }

        /**
         * Retrive the history as an array. This is especially usefuls as some 
         * entries can be multilines
         * @returns {string[]} is a copy of the history
         */
        public asArray (): string[] {

            return this._logHistory.map((value) => value)

        }

        /**
         * Limit the size (in Ko or in number of entries) of the history
         * @param {number | undefined} newSizeInKb is the maximum length of
         * '           the total strings to let in the history (in kilo-bytes)
         * @param {number | undefined} newCount is the number of entries to keep
         * @returns {boolean} is true if success (if the history was already in the
         *             required limits or if it has been truncated).
         *             Is false if an error occurs
         */
        public truncateHistory (newSizeInKb?: number | undefined,
                                newCount?: number | undefined): boolean {

            const cSourceName: string = 'exerma_base/exerma_log/truncateHistory'

            try {

                // Check params
                if (   ((newSizeInKb !== undefined) && (newSizeInKb < 0))
                    || ((newCount !== undefined)    && (newCount < 0))    ) {

                    this.raiseError(cSourceName, cRaiseInvalidParameter)
                    return false

                }

                // Limit size of history, in number of entries
                if ((newCount !== undefined) && (this._logHistory.length > newCount)) {
        
                    this._logHistory.slice(this._logHistory.length - newCount)
        
                }

                // Limit the size of the history, in kilobytes (1024 bytes)
                if ((newSizeInKb !== undefined) && (this._logHistory.length > 0)) {

                    let size: number = 0
                    const newMaxSize: number = newSizeInKb * 1024
                    
                    // Count size from the last entry
                    for (let i: number = this._logHistory.length; i >= 0; i--) {

                        size += (this._logHistory.at(i) ?? '').length
                        if (size > newMaxSize) {

                            // Remove excess of entries including this entry
                            this._logHistory.slice(i)

                        }

                    }
        
                }
        
                // Happy end
                return true
            
            } catch (error) {
        
                // Error
                return false
        
            }

        }



        // ---------- Private functions
        /**
         * IMPORTANT: This is a simplified and private version of 
         * exerma_base/exerma_misc/numberToStringRightAlign used to process faster 
         * (thanks to less options) and not using the log() function to 
         * 
         *                     _avoid infinite recurivity_
         * 
         * It right align an integer number by adding zeros on the left
         * If the number needs more digits than "count" then it will not be truncated
         * @param {number} intValue the integer number to right align with zeros
         * @param {number} count the minimum number of digits that should be visible
         * @returns {string} is a right aligned with the provided leftchar
         */
        private logNumberToStringRightAlign (intValue: number,
                                             count: number): string {

            const cSourceName: string = 'exerma_base/exerma_misc/numberIntAlign'

            // Do
            const result: string = intValue.toString()
            count = Math.max(count, result.length)
            return ('0'.repeat(count) + result).slice(-count)

        }

    } // Class CLogger


    // ---------- Declare main logger as global variable
    let mainLogger: Map<string, CLogger>

    /**
     * Get the main centralized logger
     * @param {string} name is the name of the log to retrieve
     * @returns {CLogger} is the main logger object (built on demand)
     */
    export function log (name: string = ''): CLogger {

        if (mainLogger === undefined) {

            // Create map of logger on demand
            mainLogger = new Map<string, CLogger>()

        }

        if (!mainLogger.has(name)) {

            // Create logger on demand
            mainLogger.set(name, new CLogger(name))

        }

        return mainLogger.get(name) as CLogger

    }

    export default log
