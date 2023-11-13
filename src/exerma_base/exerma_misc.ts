/**
 * ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023
 * ---------------------------------------------------------------------------
 *  exerma_misc.js
 * ---------------------------------------------------------------------------
 *
 * Versions:
 *   2023-11-12: Fix: Hours were badly returned in 
 *   2023-10-08: Add: stringifyArray() to add a safe stringification of arrays made of simple types
 *   2023-09-08: First version
 *
 */

    // --------------- Import
    import type * as ex              from './exerma_types'
    import log, { cInfoStarted, cRaiseUnexpected } from './exerma_log'
    import {
            cNullString
            } from './exerma_consts'

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
     * Split a date into simple fields (like 'yyyy', 'HH') and save them in a map of
     * <fieldname;fieldvalue> (in string format) for a later fieldReplacement() for 
     * example or for manual use of the formatted data.
     * The following fields are extracted:
     *     ${d}       = the day in format "0" (all date fields refer to the date/time of the mail)
     *     ${dd}      = the day in format "00"
     *     ${ddd}     = the day of the week in format "Mon"
     *     ${dddd}    = the day of the week in format "Monday"
     *     ${m}       = the month in format "0"
     *     ${mm}      = the month in format "00"
     *     ${mmm}     = the month in format "dec"
     *     ${mmmm}    = the month in format "December"
     *     ${mmmmm}   = the month in format "D" (first letter of month)
     *     ${yy}      = the year in format "00"
     *     ${yyyy}    = the year in format "0000"
     *     ${H}       = the hours in format "0" (24h)
     *     ${H12}     = the hours in format "0" (12h)
     *     ${HH}      = the hours in format "00" (24h)
     *     ${HH12}    = the hours in format "00" (12h)
     *     ${MM}      = the minutes in format "00"
     *     ${SS}      = the seconds in format "00"
     *     ${MSS}     = the milliseconds in format "000"
     *     ${yyyy-mm-dd} = alias to build the field format
     *     ${yyyymmdd}   = alias to build the field format
     *     ${HH-MM-SS}   = alias to build the field format
     *     ${HHMMSS}     = alias to build the field format
     *     ${HHMM}       = alias to build the field format
     *     ${HH-MM}      = alias to build the field format
     *     ${isodate}    = the date and time in "2011-10-05T14:48:00.000Z" iso format
     * @param {Date} aDate is the date to extract to fields into rules for fieldReplacement()
     * @param {object} options is a list of optional parameters
     * @param {string} options.datesep is the separator to use for the "yyyy-mm-dd" kind 
     *                  of format (default = '-')
     * @param {string} options.timesep is the separator to use for the "HH-MM" kind of 
     *                  format (default = ':')
     * @param {ex.MStringString} options.feedMap is a existing Map<string,string> to feed¨
     *                  instead of creating a new Map object
     * @returns {ex.MStringString} is the map of <field;value>
     */
    export function datetimeToFieldReplacement (aDate: Date,
                                                options?: {
                                                    datesep?: string
                                                    timesep?: string
                                                    feedMap?: ex.MStringString
                                                }): ex.MStringString {

        const result: ex.MStringString = (options?.feedMap ?? new Map<string, string>())
        const datesep: string = (options?.datesep, '-')
        const timesep: string = (options?.timesep, ':')

        result.set('d',     aDate.toLocaleString(window.navigator.language, { day: 'numeric' }))
              .set('dd',    aDate.toLocaleString(window.navigator.language, { day: '2-digit' }))
              .set('ddd',   aDate.toLocaleString(window.navigator.language, { weekday: 'short' }))
              .set('dddd',  aDate.toLocaleString(window.navigator.language, { weekday: 'long' }))
              .set('m',    aDate.toLocaleString(window.navigator.language,  { month: 'numeric' }))
              .set('mm',    aDate.toLocaleString(window.navigator.language, { month: '2-digit' }))
              .set('mmm',   aDate.toLocaleString(window.navigator.language, { month: 'short' }))
              .set('mmmm',  aDate.toLocaleString(window.navigator.language, { month: 'long' }))
              .set('mmmmm', aDate.toLocaleString(window.navigator.language, { month: 'narrow' }))
              .set('yy',    aDate.toLocaleString(window.navigator.language, { year: '2-digit' }))
              .set('yyyy',  aDate.toLocaleString(window.navigator.language, { year: 'numeric' }))
              .set('H',     aDate.getHours().toString())
              .set('HH',    ('00' + aDate.getHours().toString()).slice(-2))
              .set('H12',   aDate.toLocaleString(window.navigator.language, { hour: 'numeric', hour12: true }))
              .set('HH12',  aDate.toLocaleString(window.navigator.language, { hour: '2-digit', hour12: true }))
              .set('MM',    aDate.toLocaleString(window.navigator.language, { minute: '2-digit' }))
              .set('SS',    aDate.toLocaleString(window.navigator.language, { second: '2-digit' }))
              .set('MSS',   numberToStringRightAlign(aDate.getMilliseconds(), 3))
              .set('yyyy-mm-dd', (result.get('yyyy') ?? 'xxxx') + datesep
                               + (result.get('mm') ?? 'xx') + datesep
                               + (result.get('dd') ?? 'xx'))
              .set('yyyymmdd', (result.get('yyyy') ?? 'xxxx')
                             + (result.get('mm') ?? 'xx')
                             + (result.get('dd') ?? 'xx'))
              .set('HH-MM-SS', (result.get('HH') ?? 'xxxx') + timesep
                             + (result.get('MM') ?? 'xx') + timesep
                             + (result.get('SS') ?? 'xx'))
              .set('HHMMSS', (result.get('HH') ?? 'xxxx')
                           + (result.get('MM') ?? 'xx')
                           + (result.get('SS') ?? 'xx'))
              .set('HH-MM', (result.get('HH') ?? 'xx') + timesep
                          + (result.get('MM') ?? 'xx'))
              .set('HHMM', (result.get('HH') ?? 'xx')
                         + (result.get('MM') ?? 'xx'))
              .set('isodate', aDate.toISOString())

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


    /**
     * Replace the "${key}" fields of the template by the value associated to the
     * key in the fieldReplacement map.
     * Note: The "${" and "}" separator can be modified with "options" if necessary.
     * Note: Fields are replaced in the iterator order of the map (forEach() order)
     *       onces but in all occurrences found in the template in current state.
     * @param {string} template is the string to replace the fields into
     * @param {ex.MStringString} fieldReplacement is a Map<fieldName,fieldValue> containing
     *                   the values to replace the fields by in the template.
     *                   Every field is found with format "${field}" --> "value"
     * @param {object} options is a way to replace the opening and cloiing tags around
     *                  the field names used to retrieve the fields in template
     * @param {string} options.openTag is the prefix added to each field used to
     *                  search for the field (default='${')
     * @param {string} options.closeTag is the suffix added to each field used to
     *                  search for the field (default='}') 
     * @returns {string} is the template after replacement of fields
     */
    export function fieldReplacement (template: string,
                                      fieldReplacement: ex.MStringString,
                                      options?: { openTag?: string
                                                  closeTag?: string }): string {
        
        const cSourceName = 'exerma_base/exerma_misc.ts/fieldReplacement'

        log().trace(cSourceName, cInfoStarted)

        try {

            const openTag: string = (options?.openTag ?? '${')
            const closeTag: string = (options?.closeTag ?? '}')

            // Do
            let result = template
            fieldReplacement.forEach((value, key) => {

                result = result.replaceAll(openTag + key + closeTag, value)

            })

            return result

        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
            return cNullString

        }

    }

    /**
     * Compare the properties of the source with the provided template to assert it is
     * built correctly (or belongs to the good type / class)
     * @param {object} source is the object to check for the properties of
     * @param {object} template is the template object the source must match the properties of
     * @param {object} options is for optional parameters
     * @param {boolean} options.strict is used to assert that the source has no additional properties
     *                  compared to the template (if true) or only assert that the
     *                  source has *at least* the template properties (if false, default)
     * @returns {boolean} is true if the source matches the requirements, false if not
     *                  or if an error occurs
     */
    export function objectHasSameProperties (source: object,
                                             template: object,
                                             options?: { strict: boolean }): boolean {

        const cSourceName = 'exerma_base/exerma_misc.ts/objectHasSameProperties'

        log().trace(cSourceName, cInfoStarted)

        try {

            // Check if the source has all the properties of the template
            const keys: ex.AString = Object.keys(template)
            keys.forEach(property => { if (!Object.hasOwnProperty.call(source, property)) return false })

            // If strict, then assert that the source has no additionnal properties
            if (options?.strict === true) {
                const backKeys: ex.AString = Object.keys(source)
                backKeys.forEach(property => { if (!Object.hasOwnProperty.call(template, property)) return false })
            }

            // No failure is success
            return true
            
        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
            return false

        }

    }
