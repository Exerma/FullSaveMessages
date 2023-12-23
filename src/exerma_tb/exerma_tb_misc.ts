/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023  
 * ---------------------------------------------------------------------------
 *  exerma_tb_misc.js
 * ---------------------------------------------------------------------------
 *
 * Versions:
 *   2023-12-22: Add: loadResourceFond()
 *   2023-12-03: Fix: Correction of othe cSourceName constant of loadResourceHtml()
 *   2023-09-09: Add: loadResourceHtml() moved from project/main.ts
 *   2023-09-09: First version
 * 
 */

    // --------------- Imports
    import { cNullString } from '../exerma_base/exerma_consts'
    import { log } from '../exerma_base/exerma_log'



    // --------------- Access resources of extension
    /**
     * Load a HTML page from the resources of the extension
     * @param {string} resourcePath is the name of the resource HTML to load (in format 'pages/my_page.html')
     * @returns {Promise<Document | undefined>} is the loaded HTML page as a Document object
     *                or undefined if load failed.
     *                Typically cause of error if the page is not available or wasn't made 
     *                available in the manifest in the "web_accessible_resources" section
     *   https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions/manifest.json/web_accessible_resources
     */
    export async function loadResourceHtml (resourcePath: string): Promise<Document | undefined> {

        // https://stackoverflow.com/questions/48969495/in-javascript-how-do-i-should-i-use-async-await-with-xmlhttprequest

        const cSourceName: string = 'exerma_tb/exerma_tb_misc.ts/loadResourceHtml'

        return await new Promise<Document | undefined>(function (resolve, reject) {

            void loadResource(resourcePath, 'document')
                        .then(result => { resolve(result as Document) },
                              reason => { reject(new URIError(reason)) } )

        })

    }

    /**
     * Load a resource of the extension
     * @param {string} resourcePath is the name of the resource to load
     * @param {XMLHttpRequestResponseType} responseType is the expected response type to provide to the HMLHttpRequest call
     * @returns {Promise<any | undefined>} is the loaded resource or undefined if load failed.
     *                Typically cause of error if the page is not available or wasn't made 
     *                available in the manifest in the "web_accessible_resources" section
     *   https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions/manifest.json/web_accessible_resources
     */
    export async function loadResource (resourcePath: string,
                                        responseType?: XMLHttpRequestResponseType): Promise<any | undefined> {

        // https://stackoverflow.com/questions/48969495/in-javascript-how-do-i-should-i-use-async-await-with-xmlhttprequest

        const cSourceName: string = 'exerma_tb/exerma_tb_misc.ts/loadResource'

        return await new Promise<any | undefined>(function (resolve, reject) {

            // Build extension context-dependant URL of the resource
            const resourceUrl: string = messenger.runtime.getURL(resourcePath)
            if (resourceUrl === cNullString) {

                log().raiseBenine(cSourceName, 'Invalid resourcePath value: ' + resourcePath)
                resolve(undefined)

            }

            // Request the Html page
            const xhr = new XMLHttpRequest()
            xhr.open('GET', resourceUrl)
            if (responseType !== undefined) {
                xhr.responseType = responseType
            }
            xhr.onload = function () {

                // Possible status:
                //  https://developer.mozilla.org/fr/docs/Web/API/XMLHttpRequest/status
                //  https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
                if (this.status >= 200 && this.status < 300) {

                    // Success
                    log().debugInfo(cSourceName, 'success')
                    resolve(xhr.response)

                } else {

                    log().raiseBenine(cSourceName, 'failure because of status: ' + this.status)
                    reject(new URIError(xhr.statusText))

                }

            }

            xhr.onerror = function () {

                log().raiseBenine(cSourceName, 'failure because of error: ' + xhr.statusText)
                reject(new URIError(xhr.statusText))
                
            }
            
            xhr.send()

        })

    }
