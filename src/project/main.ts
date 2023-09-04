/**
 * ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023
 * ---------------------------------------------------------------------------
 *  main.js
 * ---------------------------------------------------------------------------
 *
 * Versions:
 *   2023-08-21: Add: First implementation of
 *   2023-08-20: First version
 *
 */
import type * as tb              from '../exerma_base/exerma_types'
import { loadSelectedMessages }  from '../exerma_tb/exerma_tb_messages'
import { jsPDF }                 from 'jspdf'
import { showSaveFilePicker }    from '../../dependancies/native-file-system-adapter/native-file-system-adapter'

// Consts
export const cPopupBody: string = 'popupBody'
export const cPopupArchiveButton: string = 'cmdArchive'
export const cPopupSaveAttachButton: string = 'cmdSaveAttachment'
export const cPopupTestButton: string = 'cmdTest'

/**
 * Archive selected files
 */
export function onActionButtonClick (event: Event): void {

    console.log('User has clicked the main button')

}

export async function onArchiveButtonClick (event: Event): Promise<void> {

    console.log('User has clicked the archive button')

    await saveAndArchiveMessages()

    // window.close()

}

export function onSaveAttachButtonClick (event: Event): void {

    console.log('User has clicked the save attachment button')

}

export function onTestButtonClick (event: Event): void {

    console.log('User has clicked the test button')

}

export async function saveAndArchiveMessages (): Promise<void> {

    const cSourceFile: string = 'main.ts::saveAndArchiveMessages'

    console.log(cSourceFile + ' has started')

    // https://stackoverflow.com/questions/18191893/generate-pdf-from-html-in-div-using-javascript
    // https://github.com/parallax/jsPDF
    const element = document.getElementById('test')
    const doc: jsPDF = new jsPDF()
    const options = {

        filename: '/Users/patrick/Temp/test.pdf'

    }

    await doc.html(document.body, options)

    // Ask user where to save
    // let newTab:messenger.tabs.Tab|null=await messenger.tabs.create({url: '../exerma_base/exerma_base.html', 
    //                                                                 active: false});
    // console.log('saveAndArchiveMessages: inputBox = ' + (newTab?.id));
    // let inputBox:HTMLInputElement=<HTMLInputElement>document.getElementById('exerma_input_file');
    // console.log('saveAndArchiveMessages: inputBox = ' + (inputBox?.id));

    // let files:nFileList = await exFiles.AskUserForFile({useInputBox: inputBox});
    // console.log('saveAndArchiveMessages: result count = ' + files?.length);
    // if (files!=null) Array.from(files).map(file => console.log('File: ' + file))

    // Load messages by chunks (about 100 per chunk)
    const selection = loadSelectedMessages()
    for await (const messageHeader of selection) {

        console.log(cSourceFile + ' -> ' + messageHeader.subject)
        const rawMessage: tb.nFile = await messenger.messages.getRaw(messageHeader.id) as tb.nFile

        if (rawMessage != null) {

            // https://developer.mozilla.org/en-US/docs/Web/API/File_System_API
            // https://github.com/jimmywarting/native-file-system-adapter
            const fileHandle = await showSaveFilePicker({ suggestedName: messageHeader.subject + '.eml' })
            const fileStream = await fileHandle.createWritable()
            await fileStream.write(rawMessage)
            await fileStream.close()

            // Print message
            // Show the message in a temporary window
            // let tabMessage:messenger.tabs.Tab = messenger.messageDisplay.open({messageId: messageHeader.id});

        }

    }

}
