/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023  
 * ---------------------------------------------------------------------------
 *  exerma_dom.js
 * ---------------------------------------------------------------------------
 *
 * Versions:
 *   2024-07-29: Add: getCheckboxStateById() to retrieve the check state of a checkbox
 *   2024-06-09: Fix: createAndAddElement() now accept multiple occurrence of same attribute
 *   2023-08-20: Chg: Make this module an export class with static functions
 *   2023-07-23: First version
 * 
 */

    // ---------- Imports
    import { addSyntheticLeadingComment } from '../../node_modules/typescript/lib/tsserverlibrary'
    import log, { cRaiseUnexpected } from './exerma_log'
    import type { uHTMLElement, nHTMLElement, uBoolean } from './exerma_types'
    
    
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
     *             created element. Multiple occurrence of the same attribute will add 
     *             successive values separated by space
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
                options.setAttribute.forEach((pair) => {
                    if (result.hasAttribute(pair.name)) {
                        result.setAttribute(pair.name,
                                            result.getAttribute(pair.name) + ' ' + pair.value)
                    } else {
                        result.setAttribute(pair.name, pair.value)
                    }
                })
                    
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

    /**
     * Look for an Html element by Id and assign a value to one of her attribute (if found)
     * @param {Document} doc is the HTML DOM document to alter an element of
     * @param {string} elementId is the Id of the element to alter the display property of
     * @param {string} attribute is the name of the property to alter
     * @param {string} value is the new value to assign to the required property
     * @returns {Promise<boolean>} is true if success, false if an error occurs
     */
    export async function setElementByIdAttribute (doc: Document,
                                                   elementId: string,
                                                   attribute: string,
                                                   value: string ): Promise<boolean> {

        const cSourceName = 'exerma_base/exerma_dom/setElementByIdAttribute'

        try {

            const element = doc.getElementById(elementId)
            if (element != null) {
                element.setAttribute(attribute, value)
                return true
            }

        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }
        
        return false

    }

    /**
     * # Set content of a DOM element
     * 
     * Look for an Html element by Id and assign its text value (if found)
     * 
     * Versions: 29.07.2024
     * @param {Document} doc is the HTML DOM document to alter an element of
     * @param {string} elementId is the Id of the element to alter the content of
     * @param {string} value is the new value to assign to the contant
     * @param {boolean} isHtml is true if 'value' is an Html text, false if it is a
     *                  simple text string
     * @returns {Promise<boolean>} is true if success, false if an error occurs
     */
    export async function setElementByIdInnerContent (doc: Document,
                                                      elementId: string,
                                                      value: string,
                                                      isHtml: boolean ): Promise<boolean> {

        const cSourceName = 'exerma_base/exerma_dom/setElementByIdInnerContent'

        try {
            
            const element = doc.getElementById(elementId)
            if (element !== null) {
                
                if (isHtml) {
                
                    // Set the Html content of the element
                    element.innerHTML = value
                    return true
                
                } else {
                
                    // Set the Text content of the element
                    element.innerText = value
                    return true

                }

            }

        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }
        
        return false

    }


    /**
     * Get the state (checked or not) of a checkbox input field
     * @param {Document} doc is the HTML DOM document to alter an element of
     * @param {string} checkboxId is the ID of the checkbox to get the state of
     * @param {uBoolean} ifError is the value to return if the checkbox wasn't
     *                  found or if it is not a checkbox input field (default = undefined)
     * @returns {boolean} is true if the checkbox is checked, false if not, or 
     *                  undefined if the checkbox wasn't found
     */
    export async function getCheckboxStateById (doc: Document,
                                                checkboxId: string,
                                                ifError: uBoolean = undefined): Promise<boolean | undefined> {

        const cSourceName = 'exerma_base/exerma_dom/getCheckboxStateById'

        try {
            
            const element = doc.getElementById(checkboxId)
            if (   (element !== null)
                && (element instanceof HTMLInputElement)
                && (element.type === 'checkbox')) {
                
                return element.checked
                
            }

        } catch (error) {

            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }

        return ifError

    }
