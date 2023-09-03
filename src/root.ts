/**
 * ----------------------------------------------------------------------------
 * (c) Patrick Seuret, 2023
 * ----------------------------------------------------------------------------
 * root.js
 * ----------------------------------------------------------------------------
 * This is the entry point for compilation, esbuild, etc.
 *
 * Import here the entry points of your project like "./project/main",
 * "./background/background" or "./action/action_popup" in mozilla addons
 * (important: always use relative paths)
 *
 * Versions:
 *   2023-08-27: First version
 *
 */


/**
 * Example to import a module and make it accessible from window object
 * source: https://www.metachris.com/2021/04/starting-a-typescript-project-in-2021/
 *
 *    // Import a function
 *    import { greet } from './main'
 *    // Make it accessible on the window object
 *    (window as any).greet = greet
 */

import './background/background'
import './action/action_popup'

export class exerma {

}
