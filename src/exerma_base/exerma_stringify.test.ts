/**
 * ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023
 * ---------------------------------------------------------------------------
 *  exerma_stringify.test.js
 * ---------------------------------------------------------------------------
 *
 * Versions:
 *   2023-10-09: First version
 *
 */
    import { safeStringify } from './exerma_stringify'

    // --------------- Import
    test.each([[true, ''],
               [false, ''],
               [0, '']]
             )('safeStringify basic type values',

        (fixture, result) => { expect(safeStringify(fixture)).toBe(result) }
        
    )

