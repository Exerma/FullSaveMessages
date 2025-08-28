/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023  
 * ---------------------------------------------------------------------------
 *  exerma_tb_misc.js
 *  https://github.com/thunderbird/webext-file-system-access/blob/main/README.md
 * ---------------------------------------------------------------------------
 *
 * Versions:
 *   2024-08-09: Add: saveBlob()
 *   2023-12-22: Add: loadResourceFond()
 *   2023-12-03: Fix: Correction of othe cSourceName constant of loadResourceHtml()
 *   2023-09-09: Add: loadResourceHtml() moved from project/main.ts
 *   2023-09-09: First version
 * 
 */

    // --------------- Imports
    import * as fsa from '../../api/modules/fsa.mjs'
    import { cNullString } from '../exerma_base/exerma_consts'
    import { cRaiseUnexpected, log } from '../exerma_base/exerma_log'
    import { buildFullname, setFileExt } from '../exerma_base/exerma_files'



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

    /**
     * Save the provided blob on disk using the experiment API saveFile().
     * @param {ArrayBuffer} dataBuffer is an array with the data to save
     * @param {string} filename is the name of the file to save
     * @param {fsa.tbFolderIdType} folderId is the ID of the folder where to save the file (returned 
     *                       by a FSA directory picker).
     *                       If not provided or is an empty string, then ask the user where to save it.
     *                       If provided, then use it without asking
     * @param {object} options contains optional options
     * @param {string} options.setExt is an optional extension to set to the filename (only used if both
     *                       the filename and folderId are provided)
     * @returns {[any, boolean]} is the folderIds (as first member) and if success (second member):
     *                       Syntax:
     *                           const saveResult = await saveBlob(...)
     *                           const folderId = saveResult[0]
     *                           const cancelled = saveResult[1]
     */
    export async function saveBlob (dataBuffer: ArrayBuffer,
                                    filename: string,
                                    folderId: fsa.tbFolderIdType,
                                    options?: {
                                        setExt: string
                                    }): Promise<[fsa.tbFolderIdType, boolean]> {

        const cSourceName: string = 'exerma_tb/exerma_tb_misc.ts/saveBlob'

        try {

            // Check if the FSA proxy is available and bail out if not.
            let fsaAvailable = false
            try {
                await fsa.getVersion()
                fsaAvailable = true
            } catch {
                // fsa not available
            }
            if (!fsaAvailable) {
                log().debugInfo(cSourceName, 'FSA not available')
                // return [null, false] as const
            }

            log().debugInfo(cSourceName, 'folderId: ' + folderId)

            // Need to ask user where to save it ?
            if (filename === cNullString) {
                // No filename provided: ask user for both folder and filename
                const dataBlob: Blob = new Blob([dataBuffer])
                const resultFile = await fsa.writeFileWithPicker(
                                            dataBlob,
                                            {
                                                read: false,
                                                write: true
                                            },
                                            {
                                                filters: [{ type: 'all' }],
                                                defaultName: cNullString,
                                                defaultFolderId: folderId
                                            }
                                        )
                return [resultFile.folderId, resultFile.file != null] as const
            } else
            if ((folderId === null) || (folderId === undefined) || (folderId === cNullString)) {

                log().debugInfo(cSourceName, 'getFolderWithPicker')
                // Filename provided but not the directory
                const newFolderId = await fsa.getFolderWithPicker(
                                            {
                                                read: true,
                                                write: true
                                            },
                                            {
                                                filters: [],
                                                defaultName: cNullString,
                                                defaultFolderId: folderId
                                            }
                                        )
                if (newFolderId == null) {
                    // User has cancelled or an error has occurred
                    return [null, false]
                }
                log().trace(cSourceName, 'Folder ID: $newFolderId')

                // Save file in the selected folder
                const dataBlob: Blob = new Blob([dataBuffer])
                const resultFile = await fsa.writeFile(dataBlob, folderId, filename)
                return [resultFile.folderId, resultFile == null] as const

            } else {

                // Both the directory and filename are known
                const dataBlob: Blob = new Blob([dataBuffer])
                const resultFile = await fsa.writeFile(dataBlob, folderId, filename)
                return [folderId, resultFile != null] as const

            }

        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
            return [null, false] as const

        }

    }
