/**
 * ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023
 * ---------------------------------------------------------------------------
 *  exerma_misc.js
 * ---------------------------------------------------------------------------
 *
 * Versions:
 *   2023-09-08: First version
 *
 */

    // --------------- Import
    import log, { cRaiseUnexpected } from './exerma_log'

    // --------------- Numbers

    /**
     * Right align an integer number by adding zeros on the left
     * If the number needs more digits than "count" then it will not be truncated
     * @param {number} intValue the integer number to right align with zeros
     * @param {number} count the minimum number of digits that should be visible
     * @param {string} leftchar is the char to use on the left to align the number
     *                 (default='0', if empty, then use '0', if multichar, then 
     *                 use only the first char of the provided string)
     * @param {object} options is used to provide additional options
     * @param {boolean} options.forceTruncate is used to force truncation of number
     *                 needing more than "count" digits to be displayed (if true)
     *                 (default=false: don't truncate)
     * @returns {string} is a right aligned with the provided leftchar
     */
    export function numberToStringRightAlign (intValue: number,
                                              count: number,
                                              leftchar: string = '0',
                                              options?: {
                                                  forceTruncate: boolean
                                              }): string {

        const cSourceName: string = 'exerma_base/exerma_misc/numberIntAlign'

        // Check params
        if (!Number.isInteger(count)) {

            log().raiseBenine(cSourceName, 'count is not an integer, it will be truncated (' + count + ')')
            count = Math.trunc(count)

        }

        if (!Number.isInteger(intValue)) {

            log().raiseBenine(cSourceName, 'intValue is not an integer, it will be truncated (' + intValue + ')')
            intValue = Math.trunc(intValue)

        }

        // Do
        const result: string = intValue.toString()
        count = Math.abs(count)
        count = ((options?.forceTruncate === true) ? count : Math.max(count, result.length))
        return ((leftchar === '' ? '0' : leftchar.slice(0, 1)).repeat(count) + result).slice(-count)

    }


    // --------------- Convert time

    /**
     * Convert a date and time object into a "YYYY-MM-DD--HHMMSS"
     * @param {Date} aDate is the date time to convert into string
     * @param {object} options is used to fine-tune the result
     * @param {boolean} options.noDate is used to not include the date
     *                 part in the result (return only "HHMMSS")
     *                 (default=false: include the date)
     * @param {boolean} options.noTime is use to not include the time
     *                 part in the result (return only "YYY-MM-DD")
     *                 (default=false: include the time)
     * @param {boolean} options.noSeconds is used to not include the
     *                 seconds in the time part (return only "HHMM")
     *                 (default=false: include seconds)
     * @param {boolean} options.addMilliseconds is used to add the milliseconds
     *                 to the time part (return "HHMMSSsss").
     *                 It is ignored if options.noSeconds=true
     *                 (default=false: don't add milliseconds)    
     * @param {string} options.datetimeSep is the separator to use between the
     *                 date and the time parts.
     *                 (default="--":  "YYYY-MM-DD--HHMMSS")
     * @param {string} options.dateSep is the separator to use between the
     *                 parts of the date
     *                 (default="-":  "YYYY-MM-DD")
     * @param {string} options.timeSep is the separator to use between the
     *                 parts of the time
     *                 (default="":  "HHMMSS")
     * @returns {string} is the requires string
     */
    export function datetimeToStringTag (aDate: Date,
                                         options?: {
                                            noDate?: boolean
                                            noTime?: boolean
                                            noSeconds?: boolean
                                            addMilliseconds?: boolean
                                            datetimeSep?: string
                                            dateSep?: string
                                            timeSep?: string
                                        }): string {

        const cSourceName: string = 'exerma_base/exerma_misc/datetimeToStringTag'
        const defaultDateSep = '-'
        const defaultTimeSep = ''
        const defaultDateTimeSep = '--'

        let sep: string = ''
        let result: string = ''

        // Add date part
        if (options?.noDate !== true) {

            result = numberToStringRightAlign(aDate.getFullYear(), 4)
                + (options?.dateSep ?? defaultDateSep)
                + numberToStringRightAlign(aDate.getMonth(), 2)
                + (options?.dateSep ?? defaultDateSep)
                + numberToStringRightAlign(aDate.getDate(), 2)
            
            sep = (options?.datetimeSep ?? defaultDateTimeSep)

        }

        // Add time part
        if (options?.noTime !== true) {

            result = result
                + sep
                + numberToStringRightAlign(aDate.getHours(), 2)
                + (options?.timeSep ?? defaultTimeSep)
                + numberToStringRightAlign(aDate.getMinutes(), 2)
                + ( (options?.noSeconds === true)
                    ? ''
                    : numberToStringRightAlign(aDate.getSeconds(), 2)
                    + ( (options?.addMilliseconds === true)
                        ? (options?.timeSep ?? defaultTimeSep)
                        + numberToStringRightAlign(aDate.getMilliseconds(), 3)
                        : '')
                    )

        }

        return result

    }


    /**
     * It is suprisingly complicated to retrieve a property by name from an object with
     * an undefined type. This function allows to parse all values of the object to find
     * the required key.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
     * https://stackoverflow.com/questions/41993515/access-object-key-using-variable-in-typescript
     * @param {object | undefined} obj is the undefined object we want to retrieve the "key" value of
     * @param {string} key is the key to find in the obj object
     * @returns {any} is the found value associated to the key or undefined if not found
     */
    export function retrieveValueFromUnstructuredObject (obj: object | undefined, key: string): any | undefined {

        const cSourceName = 'exerma_base/exerma_misc.ts/retrieveValueFromUnstructuredObject'

        try {

            if (obj !== undefined) {
    
                const resultPair: [string, any] | undefined = Object.entries(obj).find((pair, index) => pair[0] === key )
                if (resultPair !== undefined) {
                    return resultPair[1]
                }
            
            }
    
        } catch (error) {

            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }

    }
