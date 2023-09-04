/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023  
 * ---------------------------------------------------------------------------
 *  native-file-system-adapter-master.js
 * ---------------------------------------------------------------------------
 *
 * This file is a manual compilation of all *.d.ts files of the 
 * native-file-system-adapter module.
 * 
 * Source: https://github.com/jimmywarting/native-file-system-adapter/tree/master
 * 
 * Versions:
 *   2023-09-04: First version
 * 
 */

declare const kAdapter: unique symbol
    
    export class FileSystemHandle {

        constructor (adapter: FileSystemHandle & {
            writable
        })

        name: string
        kind:('file' | 'directory')
        queryPermission ({ mode }?: {
            mode?: string
        }): Promise<any>
        
        requestPermission ({ mode }?: {
            mode?: string
        }): Promise<any>

        remove (options?: {
            recursive?: boolean
        }): Promise<void>

        isSameEntry (other: FileSystemHandle): Promise<any>;

        [kAdapter]: any

    }


    export class FileSystemFileHandle extends FileSystemHandle {
        
        constructor (adapter: any)

        createWritable (options?: {
            keepExistingData?: boolean
        }): Promise<FileSystemWritableFileStream>

        getFile (): Promise<File>;

        [kAdapter]: any

    }

    export class FileSystemDirectoryHandle extends FileSystemHandle {

        constructor (adapter: any)

        getDirectoryHandle (name: string, options?: {
            create?: boolean
        }): Promise<FileSystemDirectoryHandle>

        entries (): AsyncGenerator<[string, FileSystemHandle | FileSystemDirectoryHandle]>

        getEntries (): AsyncGenerator<FileSystemFileHandle | FileSystemDirectoryHandle, void, unknown>

        getFileHandle (name: string, options?: {
            create?: boolean
        }): Promise<FileSystemFileHandle>

        removeEntry (name: string, options?: {
            recursive?: boolean
        }): Promise<any>

        resolve (possibleDescendant: any): Promise<any[]>

        keys (): AsyncGenerator<any, void, unknown>

        values (): AsyncGenerator<FileSystemHandle | FileSystemDirectoryHandle, void, unknown>

        [kAdapter]: any;

        [Symbol.asyncIterator] (): AsyncGenerator<[string, FileSystemHandle | FileSystemDirectoryHandle], any, any>

    }

    
    export function showSaveFilePicker (options?: {

        excludeAcceptAllOption?: boolean

        accepts?: any[]

        suggestedName?: string

        _name?: string

        _preferPolyfill?: boolean

    }): Promise<FileSystemFileHandle>


    export function showDirectoryPicker (options?: {

        _preferPolyfill?: boolean

    }): Promise<FileSystemDirectoryHandle>


    export function showOpenFilePicker (options?: {

        multiple?: boolean

        excludeAcceptAllOption?: boolean

        accepts?: any[]

        _preferPolyfill?: boolean

    }): Promise<FileSystemFileHandle[]>

    export function getOriginPrivateDirectory (
        
        driver?: object | undefined,

        options?: unknown

    ): Promise<FileSystemDirectoryHandle>
