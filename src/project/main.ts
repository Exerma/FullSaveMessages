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

//---------- Import
import "../exerma_tb/exerma_tb_types"
import { exTbMessages }   from "../exerma_tb/exerma_tb_messages";
import "./messages";
import { showSaveFilePicker } from "../../dependancies/native-file-system-adapter-master/src/es6";

export class exMain {

    // Consts
    static readonly cPopupBody:string ="popupBody";
    static readonly cPopupArchiveButton:string = "cmdArchive";
    static readonly cPopupSaveAttachButton:string = "cmdSaveAttachment";
    static readonly cPopupTestButton:string = "cmdTest";

    // Global objects
    private static globalInput:HTMLInputElement;
    
    /**
     * Initialization
     */ 
    public static async Init():Promise<void> {

        try {
            console.log("exMain::Init: Start");
            this.globalInput=document.createElement("input");
            this.globalInput.type="file";
   
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

    }

    public static async saveAndArchiveMessages(): Promise<void> {

        const cSourceFile:string="main.ts::saveAndArchiveMessages";

        console.log(cSourceFile + " has started");

        const inputBox:HTMLInputElement=<HTMLInputElement>document.getElementById('exerma_input_file');

        // Ask user where to save
        // let newTab:messenger.tabs.Tab|null=await messenger.tabs.create({url: "../exerma_base/exerma_base.html", 
        //                                                                 active: false});
        // console.log("saveAndArchiveMessages: inputBox = " + (newTab?.id));
        // let inputBox:HTMLInputElement=<HTMLInputElement>document.getElementById("exerma_input_file");
        // console.log("saveAndArchiveMessages: inputBox = " + (inputBox?.id));

        //let files:nFileList = await exFiles.AskUserForFile({useInputBox: inputBox});
        //console.log("saveAndArchiveMessages: result count = " + files?.length);
        //if (files!=null) Array.from(files).map(file => console.log("File: " + file))
            
        // Load messages by chunks (about 100 per chunk)
        let selection = exTbMessages.LoadSelectedMessages();
        for await (let messageHeader of selection) {
            console.log(cSourceFile + " -> " + messageHeader.subject);
            let rawMessage:nFile=<nFile>await messenger.messages.getRaw(messageHeader.id);
            if (rawMessage) {
                // https://developer.mozilla.org/en-US/docs/Web/API/File_System_API
                // https://github.com/jimmywarting/native-file-system-adapter
                let fileHandle=await showSaveFilePicker({suggestedName: messageHeader.subject + ".eml"});
                let fileStream=await fileHandle.createWritable();
                await fileStream.write(rawMessage);
                await fileStream.close();
            }

            
        }
    }

 } // End of exMain
