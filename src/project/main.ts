/*----------------------------
 *  (c) Patrick Seuret, 2023  
 *----------------------------
 *  main.js
 *----------------------------
 *
 * Versions:
 *   2023-08-20: First version
 * 
 */

//----- Import
import "../exerma_tb/exerma_tb_types"

export class exMain {

    // Consts
    static readonly cPopupArchiveButton:string = "cmdArchive";
    static readonly cPopupSaveAttachButton:string = "cmdSaveAttachment";
    
    /**
     * Archive selected files
     */ 
    public static async onActionButtonClick(event:any) {

        console.log("User has clicked the main button");

    }

    public static async onArchiveButtonClick(event:Event): Promise<void> {

        console.log("User has clicked the archive button");

    }

    public static async onSaveAttachButtonClick(event:Event): Promise<void> {

        console.log("User has clicked the save attachment button");

    }

 } // End of exMain
