/*----------------------------
 *  (c) Patrick Seuret, 2023  
 *----------------------------
 *  main.js
 *----------------------------
 *
 * Versions:
 *   2023-08-21: Add: First implementation o f
 *   2023-08-20: First version
 * 
 */

//----- Import
import "../exerma_tb/exerma_tb_types"
import { exTbMessages } from "../exerma_tb/exerma_tb_messages";
import { exFiles }      from "../exerma_base/exerma_files";



export class exMain {

    // Consts
    static readonly cPopupBody:string ="popupBody";
    static readonly cPopupArchiveButton:string = "cmdArchive";
    static readonly cPopupSaveAttachButton:string = "cmdSaveAttachment";
    static readonly cPopupTestButton:string = "cmdTest";

    // Global objects
    private static globalFiles:HTMLInputElement;
    private static globalValue:number;
    
    /**
     * Initialization
     */ 
    public static async Init():Promise<void> {

        try {
            console.log("exMain::Init: Start");
            this.globalFiles=document.createElement("input");
            this.globalFiles.type="file";
            this.globalValue=100;
   
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * Archive selected files
     */ 
    public static async onActionButtonClick(event:any) {

        console.log("User has clicked the main button");

    }

    public static async onArchiveButtonClick(event:Event): Promise<void> {

        console.log("User has clicked the archive button");

        exMain.saveAndArchiveMessages();

        //window.close();

    }

    public static async onSaveAttachButtonClick(event:Event): Promise<void> {

        console.log("User has clicked the save attachment button");

    }

    public static async onTestButtonClick(event:Event): Promise<void> {

        console.log("User has clicked the test button");
        console.log("Global value: " + this.globalValue);

        if (this.globalFiles!==undefined) {
            console.log("onTestButtonClick: Reuse existing");
        } else {
            console.log("onTestButtonClick: build on demand");
            this.globalFiles=document.createElement("input");
        }
        this.globalFiles.type = 'file';
        this.globalFiles.onchange=() => {
            console.log("onTestButtonClick:  has changed: " + this.globalFiles.name);
        }
        this.globalFiles.oncancel=() => {
            console.log("onTestButtonClick:  was cancelled: " + this.globalFiles.name);
        }
        this.globalFiles.click();


    }

    public static async saveAndArchiveMessages(): Promise<void> {

        console.log("saveAndArchiveMessages has started");

        // Ask user where to save
        let files:nFileList = await exFiles.AskUserForFile();
         console.log("saveAndArchiveMessages: result count = " + files?.length);
        if (files!=null) Array.from(files).map(file => console.log("File: " + file))
            
        // Load messages by chunks (about 100 per chunk)
        let selection = exTbMessages.LoadSelectedMessages();
        
        for await (let message of selection) {

            console.log(message.subject);
            //exFiles.openFileDialog();
            
        }
    }

 } // End of exMain
