/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023  
 * ---------------------------------------------------------------------------
 *  exerma_tb_storage.ts
 * ---------------------------------------------------------------------------
 *
 * This module standardise the use of the Thunderbird "storage" API by providing
 * functions converting data formats
 * 
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage
 * 
 * Versions:
 *   2023-10-02: Add: Map as accepted type for setStorage() and getStorageAsMap() to retrieve it as a Map<any, any> object
 *   2023-09-23: First version
 * 
 */

    // --------------- Imports
    import {
            type uString,
            type uNumber,
            type uBoolean
            }                                      from '../exerma_base/exerma_types'
    import log, { cInfoStarted, cRaiseUnexpected, cInfoToImplement } from '../exerma_base/exerma_log'
    import { retrieveValueFromUnstructuredObject } from '../exerma_base/exerma_misc'

    // --------------- Inteface with messenger.storage
    /**
     * Different kind of storage proposed by the "storage" API of Thunderbird
     * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage
     */
    export enum StorageKind {

        session = 1,   // Store in memory and only for this session
        local = 2,     // Use local storage
        managed = 3,   // managed storage is normally read-only and set by administrator
        sync = 4       // This storage is shared with other instance of Thunderbird

    }

    /**
     * Save a value in Thunderbird storage
     * @param {StorageKind} kind is the kind of storage to use
     * @param {string} key is the storage key to use for later get() operation
     * @param {value} value is the value to store
     * @returns {boolean} is true if success and false if an error occurs
     */
    export async function setStorage (kind: StorageKind,
                                      key: string,
                                      value: string | object | number | boolean | Map<any, any> | undefined ): Promise<boolean> {

        const cSourceName = 'exerma_tb/exerma_tb_storage/setStorage'

        log().trace(cSourceName, cInfoStarted)

        try {
        
            // Convert Maps and Arrays
            let storeValue: any
            if (value instanceof Map) {
                storeValue = JSON.stringify(Array.from(value.entries()))
                log().debugInfo(cSourceName, 'Is a Map (' + value.size + '): ' + storeValue)
            } else
            if (value instanceof Array) {
                // Create an object with 
                let tempObj: object = { type: 'array', count: value.length }
                value.forEach((iValue, index) => { tempObj = { ...tempObj, [index]: JSON.stringify(iValue) } } )
                storeValue = JSON.stringify(tempObj)
                log().debugInfo(cSourceName, 'Is an Array: ' + storeValue)
            } else {
                storeValue = value
            }

            switch (kind) {
    
                case StorageKind.session:
                    await messenger.storage.session.set({ [key]: storeValue })
                    return true
                    
                case StorageKind.local:
                    await messenger.storage.local.set({ [key]: storeValue })
                    return true

                case StorageKind.managed:
                    await messenger.storage.managed.set({ [key]: storeValue })
                    return true

                case StorageKind.sync:
                    await messenger.storage.sync.set({ [key]: storeValue })
                    return true

            }
    
        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
            return false

        }

    }



    /**
     * Retrieve a value from the storage
     * @param {StorageKind} kind is the kind of storage to use
     * @param {string}      key is the key to retrive from storage
     * @returns {object | undefined} is the object found as value associated to
     *                  the provided key, or if undefined if an error occurs (or
     *                  if the key doesn't exist)
     */
    export async function getStorage (kind: StorageKind,
                                      key: string | string[]): Promise<object | undefined> {

        const cSourceName = 'exerma_tb/exerma_tb_storage/getStorage'

        try {
        
            let result: object

            switch (kind) {
    
                case StorageKind.session:
                    result = await messenger.storage.session.get(key)
                    break
                    
                case StorageKind.local:
                    result = await messenger.storage.local.get(key)
                    break

                case StorageKind.managed:
                    result = await messenger.storage.managed.get(key)
                    break

                case StorageKind.sync:
                    result = await messenger.storage.sync.get(key)
                    break

            }

            return result
    
        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }

    }

    /**
     * Retrive the value associated to the provided key in the required storage and
     * return it as a string
     * @param {StorageKind} kind is the kind of storage to retrieve the value from
     * @param {string}      key is the key to retrieve the value of
     * @param {boolean}     forceAsString is used to convert the value into a string if
     *                  not the native type (if true) or return undefined if not a string
     *                  (if false, default)
     * @returns {uString} is the found value (if a string) or undefined if the key doesn't
     *                  exist, if the value is not a string or if an error occurs
     */
    export async function getStorageAsString (kind: StorageKind,
                                              key: string,
                                              forceAsString: boolean = false): Promise<uString> {

        const cSourceName = 'exerma_tb/exerma_tb_storage/getStorageAsString'

        try {
            
            const foundObject: object | undefined = await getStorage(kind, key)
            const foundValue: any = retrieveValueFromUnstructuredObject(foundObject, key)
            
            if (typeof foundValue === 'string') {

                return foundValue

            }

            if (forceAsString) {

                return `${foundValue}`

            }


        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }
        
    }

    /**
     * Retrive the value associated to the provided key in the required storage and
     * return it as a number
     * @param {StorageKind} kind is the kind of storage to retrieve the value from
     * @param {string}      key is the key to retrieve the value of
     * @returns {uNumber} is the found value (if a number) or undefined if the key doesn't
     *                  exist, if the value is not a number or if an error occurs
     */
    export async function getStorageAsNumber (kind: StorageKind,
                                              key: string): Promise<uNumber> {

        const cSourceName = 'exerma_tb/exerma_tb_storage/getStorageAsNumber'

        try {
            
            const foundObject: object | undefined = await getStorage(kind, key)
            const foundValue: any = retrieveValueFromUnstructuredObject(foundObject, key)
            
            if (typeof foundValue === 'number') {

                return foundValue

            }


        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }
        
    }


    /**
     * Retrive the value associated to the provided key in the required storage and
     * return it as a boolean
     * @param {StorageKind} kind is the kind of storage to retrieve the value from
     * @param {string}      key is the key to retrieve the value of
     * @returns {uBoolean} is the found value (if a boolean) or undefined if the key doesn't
     *                  exist, if the value is not a boolean or if an error occurs
     */
    export async function getStorageAsBoolean (kind: StorageKind,
                                               key: string): Promise<uBoolean> {

        const cSourceName = 'exerma_tb/exerma_tb_storage/getStorageAsBoolean'

        try {
            
            const foundObject: object | undefined = await getStorage(kind, key)
            const foundValue: any = retrieveValueFromUnstructuredObject(foundObject, key)
            
            if (typeof foundValue === 'boolean') {

                return foundValue

            }


        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }
        
    }

    /**
     * Retrive the value associated to the provided key in the required storage and
     * return it as a Map object
     * Source: https://stackoverflow.com/questions/50153172/how-to-serialize-a-map-in-javascript
     * @param {StorageKind} kind is the kind of storage to retrieve the value from
     * @param {string}      key is the key to retrieve the value of
     * @returns {Map<any, any> | undefined} is the found Map in Map<any, any> format
     *                  or undefined if the key doesn't exist, if the value cannot be
     *                  converted into a Map or if an error occurs
     */
    export async function getStorageAsMap (kind: StorageKind,
                                           key: string): Promise<Map<any, any> | undefined> {

        const cSourceName = 'exerma_tb/exerma_tb_storage/getStorageAsMap'

        try {
            
            const foundObject: object | undefined = await getStorage(kind, key)
            const foundValue: any = retrieveValueFromUnstructuredObject(foundObject, key)
            
            if (typeof foundValue === 'string') {

                return new Map(JSON.parse(foundValue))

            }


        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }
        
    }


    /**
     * Retrive the value associated to the provided key in the required storage and
     * return it as an Array object
     * Source: https://stackoverflow.com/questions/50153172/how-to-serialize-a-map-in-javascript
     * @param {StorageKind} kind is the kind of storage to retrieve the value from
     * @param {string}      key is the key to retrieve the value of
     * @returns {Map<any, any> | undefined} is the found Array in any[] format
     *                  or undefined if the key doesn't exist, if the value cannot be
     *                  converted into a Map or if an error occurs
     */
    export async function getStorageAsArray<T> (kind: StorageKind,
                                                key: string): Promise<T[] | undefined> {

        const cSourceName = 'exerma_tb/exerma_tb_storage/getStorageAsArray'

        try {
            
            const foundObject: object | undefined = await getStorage(kind, key)
            const foundValue: any = retrieveValueFromUnstructuredObject(foundObject, key)
            
            if (typeof foundValue === 'string') {

                // TODO: Find a way to convert the found value
                log().debugInfo(cSourceName, cInfoToImplement)
                return undefined

            }


        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)

        }
        
    }
