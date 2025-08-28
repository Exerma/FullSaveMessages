export type tbFolderIdType = any // long | null
export function getVersion (): Promise<any>
export function readFileWithPicker ({ read, write }: {
    read: boolean
    write: boolean
}, { filters, defaultName, defaultFolderId }: {
    filters: any
    defaultName: string
    defaultFolderId: tbFolderIdType
}): Promise<any>
export function writeFileWithPicker (file: Blob, { read, write }: {
    read: boolean
    write: boolean
}, { filters, defaultName, defaultFolderId }: {
    filters: any
    defaultName: string
    defaultFolderId: tbFolderIdType
}): Promise<any>
export function getFolderWithPicker ({ read, write }: {
    read: boolean
    write: boolean
}, { filters, defaultName, defaultFolderId }: {
    filters: any
    defaultName: string
    defaultFolderId: tbFolderIdType
}): Promise<any>
export function getPermissions (folderId: tbFolderIdType, fileName: string): Promise<any>
export function readFile (folderId: tbFolderIdType, fileName: string): Promise<any>
export function writeFile (file: Blob, folderId: tbFolderIdType, fileName: string): Promise<any>
