/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023  
 * ---------------------------------------------------------------------------
 *  exerma_types.ts
 * ---------------------------------------------------------------------------
 *
 * Versions:
 *   2023-08-04: First version
 * 
 */

import { cTypeNameObject } from './exerma_consts'
import log, { cInfoStarted, cRaiseUnexpected } from './exerma_log'

    // Types relative to DOM
    export type uHTMLElement = HTMLElement | undefined
    export type nHTMLElement = HTMLElement | null
    export type nHTMLInputElement = HTMLInputElement | null

    // Type relative to files
    export type nFileList = FileList | null  // FileList is returned by Input.files
    export type nFile = File | null

    // Basic types
    export type nBoolean = boolean | null
    export type uBoolean = boolean | undefined
    export type nNumber  = number  | null
    export type uNumber  = number  | undefined
    export type nString  = string  | null
    export type uString  = string  | undefined
    export type nDate    = Date    | null
    export type uDate    = Date    | undefined

    // Advanced types
    export type  MStringString = Map<string, string>
    export type uMStringString = MStringString | undefined
    export type  MNumberString = Map<number, string>
    export type uMNumberString = MNumberString | undefined
    export type  AString       = string[]
    export type uAString       = AString | undefined

    /**
     * Manage a safe way to determine if an unknown object (type "any") belongs to
     * the ExClass class hierarchy.
     */
    

    /**
     * Manage a safe way to determine if an unknown object (type "any") belongs to
     * the ExClass class hierarchy.
     * 
     */
    export class CClass {

        static readonly CClassType: string = 'CClass'
        static readonly CClassHeritage: string[] = [CClass.CClassType]
        public readonly classHeritage: string[] = CClass.CClassHeritage

    }

    /**
     * Check if an object belongs to a class (directly or by heritage)
     * @param {any} candidate is the undefined class object to check if it is actually
     *                  a class of the "classType" category
     * @param {symbol} classType is the symbol associated to the class type we want
     *                  to check if the candidate belongs to.
     * @returns {boolean} is true if the candidate has the exClassHeritage property and
     *                  this property contains the required classType symbol.
     */
    export function isCClass (candidate: any, classType: string): boolean {
        
        const cSourceName = 'exerma_base/exerma_types.ts/isCClass'

        try {

            /*
                log().debugInfo(cSourceName, cInfoStarted)

                log().debugInfo(cSourceName, ': Type = ' + (typeof candidate))
                log().debugInfo(cSourceName, ': Name = ' + (candidate.name))
                log().debugInfo(cSourceName, ': Heritage = ' + ((candidate as CClass).classHeritage.length))
            */

            // Check if the candidate has the exClassType map and, if yes,
            // if this map contains the required class symbol
            if ((typeof candidate === 'object') && ('classHeritage' in candidate)) {

                const descendant: CClass = (candidate as CClass)
                return (descendant.classHeritage.find((item: string) =>  item === classType ) !== undefined)
    
            }
    
            // Specific symbol not found
            return false
    
        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
            return false

        }

    }

    // Example of heritage
    export class CClassTest extends CClass {

        // Extends CClass
        static readonly CClassType: string = 'CClassTest'
        static readonly CClassHeritage: string[] = [...CClass.CClassHeritage, CClassTest.CClassType]
        public readonly classHeritage: string[] = CClassTest.CClassHeritage

    }
    
    /**
     * Example of use
     */
    function exClassTest (): void {

        const aTest = new CClassTest()

        console.log('exerma_types::exClassTest: test if CClass = ' + isCClass(aTest, CClass.CClassType))
        console.log('exerma_types::exClassTest: test if CClassTest = ' + isCClass(aTest, CClassTest.CClassType))

    }
