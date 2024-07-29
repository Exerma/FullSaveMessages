/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2024  
 * ---------------------------------------------------------------------------
 *  exerma_dom.js
 * ---------------------------------------------------------------------------
 *
 * Versions:
 *   2024-07-29: Add: cleanFilename()
 *   2024-02-22: First version
 * 
 */

    // ---------- Imports
    import type * as ex              from './exerma_types'
    import { cNullString } from './exerma_consts'

    // --------------- Numbers
    /**
     * Retrieve the folder path separator
     * 
     * Versions: 23.02.2024
     * @returns {string} is the char used as folder separator in a path
     */
    export function getDirectoryPathSep (): string {

        return '/'

    }

    /**
     * Check if the provided string ends with a path separator char.
     * Note that this functions doesn't check the validity of the string as a
     * real directory but only if it ends with a path separator or not
     * 
     * Versions: 23.02.2024
     * @param {string} fullname is the string to check if a valid path or not
     * @param {object} options are the optional parameters
     * @param {string} options.pathSep is the path separator to use (instead of getDirectoryPathSep())
     * @returns {boolean} is true if the fullname ends with a path separator
     */
    export function isPathName (fullname: string,
                                 options?: {
                                    pathSep?: string
                                 }): boolean {

        // The path separator
        const pathSep = options?.pathSep ?? getDirectoryPathSep()

        return (fullname.trim().slice(-1) === pathSep)

    }


    /**
     * Retrieve the path part of a full filename
     * 
     * Versions: 23.02.2024
     * @param {string} fullname is the path+filename fullname to extract the path of
     * @param {object} options are the optional parameters
     * @param {string} options.pathSep is the path separator to use (instead of getDirectoryPathSep())
     * @returns {string} is the path part of the provided fullname. If fullname is a path (finishing with
     *                  path separator) then return it. The returned path includes the final '/' char
     *                  Is empty if fullname is empty or has no path part
     */
    export function extractPath (fullname: string,
                                 options?: {
                                    pathSep?: string
                                 }): string {

        // The path separator
        const pathSep = options?.pathSep ?? getDirectoryPathSep()

        // Extract the
        const filename = extractFilename(fullname, { pathSep })
        return fullname.substring(0, (fullname.length - filename.length))

    }


    /**
     * Retrieve the file part of a full filename
     * 
     * Versions: 23.02.2024
     * @param {string} fullname is the path+filename fullname to extract the filename of
     * @param {object} options are the optional parameters
     * @param {string} options.pathSep is the path separator to use (instead of getDirectoryPathSep())
     * @returns {string} is the path part of the provided fullname. If fullname is a path (finishing with
     *                  path separator) then return it. The returned path includes the final '/' char
     *                  Is empty if fullname is empty or has no path part
     */
    export function extractFilename (fullname: string,
                                     options?: {
                                         pathSep?: string
                                     }): string {

        // The path separator
        const pathSep = options?.pathSep ?? getDirectoryPathSep()

        // Extract the filename
        // https://stackoverflow.com/questions/423376/how-to-get-the-file-name-from-a-full-path-using-javascript
        return fullname.split(pathSep).pop() ?? cNullString

    }


    /**
     * Add a final '/' if the provided path doesn't include it
     * 
     * Versions: 23.02.2024
     * @param {string} path is the path to add a tailing separator if not already set
     * @param {object} options are the optional parameters
     * @param {string} options.pathSep is the path separator to use (instead of getDirectoryPathSep())
     * @returns {string} is the path string including a tailing pathSep if not already set
     *                  If path is an empty string, then return an empty string
     */
    export function addDirectoryTail (path: string,
                                      options?: {
                                          pathSep?: string
                                      }): string {

        // Special case
        if (path === cNullString) return cNullString

        // The path separator
        const pathSep = options?.pathSep ?? getDirectoryPathSep()

        // Add tail if not already present
        const result = ( path.slice(-1) === pathSep
                       ? path
                       : path + pathSep)
        
        return result

    }


    /**
     * Build the "path + filename" from the provided path and filename
     * ---
     * Versions: 23.02.2024
     * ---
     * @param {string} path is the path to set (if it contains a filename, them it is removed)
     * @param {string} filename is the filename to use (if it contains a path, then it is removed)
     * @param {object} options are the optional parameters
     * @param {string} options.pathSep is the path separator to use (instead of getDirectoryPathSep())
     * @param {string} options.setExt is used to set the extention of the filename
     * @returns {string} is the path + filename string including a separating pathSep
     */
    export function buildFullname (path: string,
                                   filename: string,
                                   options?: {
                                       pathSep?: string
                                       setExt?: string
                                  }): string {

        const pathSep = options?.pathSep ?? getDirectoryPathSep()
        const setExt = options?.setExt ?? cNullString

        // Build full name
        if (path === cNullString) {
            return setFileExt(filename, setExt)
        }
        if (filename === cNullString) {
            return cNullString
        }
        
        const result = addDirectoryTail(extractPath(path, { pathSep }), { pathSep })
                     + setFileExt(extractFilename(filename, { pathSep }), setExt)

        return result

    }


    /**
     * Extract the extension of the provided filename
     * 
     * Versions: 23.02.2024
     * @param {string} filename is the filename to extract the extension of
     * @param {object} options are the optional parameters
     * @param {string} options.pathSep is the path separator to use (instead of getDirectoryPathSep())
     * @returns {string} is the found extension or an empty string if none was found
     */
    export function extractFileExt (filename: string,
                                    options?: {
                                        pathSep?: string
                                    }): string {

        const pathSep = options?.pathSep ?? getDirectoryPathSep()

        // Extract part after last '.'
        const ext = extractFilename(filename, { pathSep }).split('.').pop()

        // Avoid to return filename if there is no '.' delimiter
        const result = ( ext === filename
                       ? cNullString
                       : ext ?? cNullString)

        return result

    }


    /**
     * Extract the body of the provided filename. The body is the part between the path (if
     * provided) and the dot of the extension (if provided).
     * Example: extractFileBody('path/foo.bar') returns 'foo'
     * 
     * Versions: 23.02.2024
     * @param {string} filename is the filename to extract the body of
     * @param {object} options are the optional parameters
     * @param {string} options.pathSep is the path separator to use (instead of getDirectoryPathSep())
     * @returns {string} is the body part of the provided filename or empty if there is
     *                  no file body
     */
    export function extractFileBody (filename: string,
                                     options?: {
                                         pathSep?: string
                                     }): string {

        const pathSep = options?.pathSep ?? getDirectoryPathSep()

        const ext = extractFileExt(filename, { pathSep })
        const file = extractFilename(filename, { pathSep })
        const withDot = ( ext === cNullString
                        ? file
                        : file.slice(0, -ext.length))
        const result = ( withDot.slice(-1) === '.'
                       ? withDot.slice(0, -1)
                       : withDot)
        
        return result

    }


    /**
     * Replace existing extension by the provided one. If the filename has no
     * extension, then the required extension is added
     * 
     * Versions: 23.02.2024
     * @param {string} filename is the filename to replace the extension of
     * @param {string} newExt is the new extension to set to the filename.
     *                  If empty then the final dot will stay with no text after
     * @returns {string} is the filename modified with the new extension.
     *                  If the filename was including a path, the path stays
     */
    export function replaceFileExt (filename: string,
                                    newExt: string): string {

        const ext = extractFileExt(filename)
        const result = filename.slice(-ext.length) + cleanFileExt(newExt)
        return result

    }


    /**
     * Set the extension of the file (add it). If the filename has a final dot ('.')
     * 
     * Versions: 23.02.2024
     * then no additional '.' is added
     * @param {string} filename is the filename to replace the extension of
     * @param {string} setExt is the extension to set to the filename.
     *                  If empty then do nothing
     * @returns {string} is the filename modified with the new extension.
     *                  If the filename was including a path, the path stays
     */
    export function setFileExt (filename: string,
                                setExt: string): string {
        

        // Special case
        if (setExt === cNullString) return filename
        if (filename === cNullString) return cNullString

        const cleanExt = cleanFileExt(setExt)
        const result = ( filename.slice(-1) === '.'
                       ? filename + cleanExt
                       : filename + '.' + cleanExt)
        return result

    }


    /**
     * Remove forbidden chars from the provided extension (replace them by '_')
     * 
     * Versions: 23.02.2024
     * @param {string} ext is the extension to remove the forbidden chars of
     * @returns {string} is the cleaned extension text
     */
    export function cleanFileExt (ext: string): string {

        const result = ext.replaceAll(/[<>:"/\\|?]/g, '_')
        return result

    }


    /**
     * Remove forbidden chars from the provided filename (replace them by '_')
     * 
     * Versions: 29.07.2024
     * @param {string} filename is the filename to remove the forbidden chars of
     * @returns {string} is the cleaned extension text
     */
    export function cleanFilename (filename: string): string {

        const result = filename.replaceAll(/[<>:"/\\|?]/g, '_')
        return result

    }
