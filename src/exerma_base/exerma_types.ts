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

    // Types relative to DOM
    export type uHTMLElement = HTMLElement | undefined
    export type nHTMLElement = HTMLElement | null
    export type nHTMLInputElement = HTMLInputElement | null

    // Type relative to files
    export type nFileList = FileList | null  // FileList is returned by Input.files
    export type nFile = File | null

    // Basic types
    export type nNumber = number | null
    export type uNumber = number | undefined
    export type nString = string | null

