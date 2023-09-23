/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023  
 * ---------------------------------------------------------------------------
 *  exerma_dom.js
 * ---------------------------------------------------------------------------
 *
 * Versions:
 *   2023-08-20: Chg: Make this module an export class with static functions
 *   2023-07-23: First version
 * 
 */

    // ---------- Imports
    import { addSyntheticLeadingComment } from '../../node_modules/typescript/lib/tsserverlibrary'
    import log, { cRaiseUnexpected } from './exerma_log'
    import type { uHTMLElement, nHTMLElement } from './exerma_types'
    
    
    // Export object

    // ===========================================================================
    // Help to manage DOM elements
    // ---------------------------------------------------------------------------
    // Source: 
    //
    /**
     * Retrieve an element from the DOM and build it if not found
     * @param {Document} domDoc is the DOM document to retrieve an entry from
     * @param {string} elementId is the ID of the element to retrieve or to create on demand
     * @param {string} htmlEntry is the string of the object to create on demand
     *                  if not already existing (example: `<input type="file" />`) 
     * @param {string} addToParentId is the ID of the parent element to add the new element
     *                  as a child of. If empty string, then add to the body of
     *                  the domDoc object (if provided but not found, then fails)
     * @returns {Promise<nHTMLElement>} is the required element
     */
    export async function getElementBuildOnDemand ( domDoc: Document,
                                                    elementId: string,
                                                    htmlEntry: string,
                                                    addToParentId: string = ''):
                                        Promise<nHTMLElement> {

        let result = null

        try {
            
            if (domDoc !== null) {

                result = domDoc.getElementById(elementId)

                if (result === undefined) {

                    let insertionPoint

                    // Build on demand
                    const newNode = document.createElement(htmlEntry)
                    if (addToParentId === '') {

                        insertionPoint = domDoc.body

                    } else {

                        insertionPoint = domDoc.getElementById(addToParentId)

                    }

                    if (insertionPoint !== null) {

                        insertionPoint.appendChild(newNode)

                    }

                    result = insertionPoint

                }
            
            }


        } catch (error) {
                
        }

        // Finished
        return result

    }

    /**
     * Create an element and, optionally, add it as child of another element
     * @param {Document} doc is the document to use for creation / addition
     * @param {keyof HTMLElementTagNameMap} tag is the tag of the element to create
     * @param {object} options is a list of options to apply to the created element
     * @param {string} options.innerHtml is an optional HTML content to inject into
     *             the newly created element with innerHtml
     * @param {string} options.innerText is an optional text to inject into the
     *             newcly created element with innerText
     * @param {{ name: string, value: string } | Map<string, string>} options.setAttribute 
     *             is used to add a single attribute or a list of attributes to the newly
     *             created element
     * @param {HTMLElement} options.target is an optional element to add the newly
     *             created as child of it. The position can be defined with the
     *             targetPosition parameter
     * @param {string} options.targetId is used to search for the target element by Id
     *             if options.target is undefined.
     *             If none of options.target and options.targetId allows the function
     *             to get a valid target, then the element will not be added but
     *             is returned as is
     * @param {InsertPosition} options.insertPosition is used to define how to insert the
     *             newly created relatively to the target (if provided/found)
     *             (default: add as last child)
     *             https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
     * @returns {uHTMLElement} is the newly created element or undefined if an error occurs
     */
    export function createAndAddElement (doc: Document,
                                        tag: keyof HTMLElementTagNameMap,
                                        options?: {
                                            innerHtml?: string
                                            innerText?: string
                                            setAttribute?: Array<{ name: string, value: string }>
                                            target?: HTMLElement
                                            targetId?: string
                                            insertPosition?: InsertPosition
                                        }): uHTMLElement {

        const cSourceName = 'exerma_base/exerma_dom/addElement'
            
        // Check params
        try {

            // Create element
            const result: uHTMLElement = doc.createElement(tag)

            // Set content
            if (options?.innerHtml !== undefined) {

                result.innerHTML = options.innerHtml

            }

            if (options?.innerText !== undefined) {

                result.innerText = options.innerText

            }

            // Set properties
            if ((options?.setAttribute !== undefined) && (result !== null)) {

                // Add each pair of the Map as {name,value} pairs
                options.setAttribute.forEach((pair) => { result.setAttribute(pair.name, pair.value) })
                    
            }

            // Add to DOM: retrieve the target element
            let target: nHTMLElement = (options?.target ?? null)
            if (target == null) {
                
                if (options?.targetId !== undefined) {

                    // Retrieve the target by Id
                    target = doc.getElementById(options.targetId)

                }

            }

            // Add to DOM: add to the target
            if (target != null) {


                if (options?.insertPosition !== undefined) {

                    target.insertAdjacentElement(options.insertPosition, result)

                } else {

                    target.appendChild(result)

                }

            }

            // Happy end
            return result

        } catch (error) {

            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
            return undefined

        }

    }
