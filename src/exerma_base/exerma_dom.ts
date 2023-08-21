/*----------------------------
 *  (c) Patrick Seuret, 2023  
 *----------------------------
 *  exerma_dom.js
 *----------------------------
 *
 * Versions:
 *   2023-08-20: Chg: Make this module an export class with static functions
 *   2023-07-23: First version
 * 
 */

//---------- Imports
import "./exerma_types";
 
  
 // Export object
export class exDom {

//============================================================================
// Help to manage DOM elements
//---------------------------------------------------------------------------
// Source: 
//
    /**
     * Retrieve an element from the DOM and build it if not found
     * @param domDoc is the DOM document to retrieve an entry from
     * @param elementID is the ID of the element to retrieve or to create on demand
     * @param htmlEntry is the string of the object to create on demand
     *                  if not already existing (example: `<input type="file" />`) 
     * @param addToParentId is the ID of the parent element to add the new element
     *                  as a child of. If empty string, then add to the body of
     *                  the domDoc object (if provided but not found, then fails)
     */
    public static getElementBuildOnDemand(domDoc: Document, 
                                          elementId: string, 
                                          htmlEntry: string, 
                                          addToParentId: string = '') 
                                    : nHTMLElement {

        let result = null;

        try {
            
            if (domDoc !== null) {

                result = domDoc.getElementById(elementId);

                if (result===undefined) {

                    var insertionPoint;

                    // Build on demand
                    const newNode = document.createElement(htmlEntry);
                    if (addToParentId==='') {
                        insertionPoint = domDoc.body;                
                    } else {
                        insertionPoint = domDoc.getElementById(addToParentId);                
                    }

                    if (insertionPoint !== null) {
                        insertionPoint.appendChild(newNode);
                    }

                    result=insertionPoint;

                }
            
            }


        } catch (error) {
                
        }

        // Finished
        return result;

    }



} // End of exDom
