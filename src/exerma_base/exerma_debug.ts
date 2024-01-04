/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023  
 * ---------------------------------------------------------------------------
 *  exerma_debug.js
 * ---------------------------------------------------------------------------
 *
  * 
 * Create / change environment variable in your ".vscode/launch.js" file to turn your
 * project into production ("production") or development (any other value)
 * 
 *     "env": {
 *                 "NODE_ENV": "production"
 *            }
 *
 * Sources:
 * https://stackoverflow.com/questions/29971572/how-do-i-add-environment-variables-to-launch-json-in-vscode
 * https://stackoverflow.com/questions/37208950/what-are-the-differences-between-webpack-development-and-production-build-modes
 * 
 * Versions:
 *   2024-01-02: First version
 * 
 */

    /**
     * Check if the current environnment is set to production
     * @returns {boolean} is true if the NODE_ENV is set to 'production', false if not
     */
    export function isProduction (): boolean {

        try {

            return (process?.env?.NODE_ENV === 'production')

        } catch (error) {
    
            return false
            
        }

    }

    export default isProduction
