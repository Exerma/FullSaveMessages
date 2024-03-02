/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023  
 * ---------------------------------------------------------------------------
 *  exerma_i18n.js
 * ---------------------------------------------------------------------------
 *
 * Versions:
 *   2023-12-03: First version
 * 
 */

    // --------------- Imports
    import { cNewLine } from './exerma_consts'
    // import { datetimeToStringTag } from './exerma_misc'  --> Use a locally optimised version of it


    // --------------- Types


    // --------------- Constants


    // --------------- Class

    export class CLanguage {

        // ---------- Private members
        /**
         * Language managed by this object
         */
        private readonly _language: browser.i18n.LanguageCode

        // ---------- Big four
        /**
         * Initialize the object managing a specific language
         * @param {string} language is the language managed by this instence
         */
        constructor (language: messenger.i18n.LanguageCode) {

            this._language = language

        }

        // ---------- Public functions
        /**
         * Get the localized version of the provided message (with the optional field substitutions)
         * @param {string} message is the name of the message to retrieve the localized value of
         * @param {object} options allows the user to provide optional parameters
         * @param {string | string[]} options.substitution is used to replace fields in the string with the
         *              provided value(s)
         * @param {string} options.ifNotFound is the value to return if the native getMessage() returns '' or
         *              is undefined
         * @returns {string} is the localized string corresponding to the provided message name
         */
        public getMessage (message: string,
                           options: {
                                substitution?: string | string[]
                                ifNotFound?: string
                            }): string {

            const result = messenger.i18n.getMessage(message, options?.substitution ?? '')
            if ((result === undefined) || (result === '')) {
                return options?.ifNotFound ?? ''
            } else {
                return result
            }

        }

    }


    // ---------- Declare main internationalisation object
    let mainCLanguage: Map<string, CLanguage>

    /**
     * Get the main centralized CLanguage
     * @param {string} language is the name of the log to retrieve
     * @returns {CLanguage} is the main CLanguage object (built on demand)
     */
    export function lang (language: string = ''): CLanguage {

        if (mainCLanguage === undefined) {

            // Create map of CLanguage on demand
            mainCLanguage = new Map<string, CLanguage>()

        }

        if (language === '') {
            language = messenger.i18n.getUILanguage()
        }
        if (!mainCLanguage.has(language)) {

            // Create CLanguage on demand
            mainCLanguage.set(language, new CLanguage(language))

        }

        return mainCLanguage.get(language) as CLanguage

    }

    /**
     * Dummy function to retrieve messages to translate in future
     * @param {string} message is the localized message to translate later
     * @returns {string} is the untranslated message as this is only for later
     *                  translations
     */
    export function exLangFuture (message: string): string {

        return message

    }

    export default lang
