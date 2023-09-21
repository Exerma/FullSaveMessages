/* ----------------------------
 *  (c) Patrick Seuret, 2023  
 * ----------------------------
 *  exerma_tb_types.ts
 * ----------------------------
 *
 * Versions:
 *   2023-09-07: Add: Tab and nTab types 
 *   2023-08-13: First version
 * 
 */

    import '../../dependancies/generate-mail-extension-typings'

    // Thunderbird prototypes
    export const messenger = browser
    
    // Types related to Thunderbird Messenger
    export type nMessageList   = messenger.messages.MessageList | null
    export type nMessageHeader = messenger.messages.MessageHeader | null
    export type AMessageHeader = messenger.messages.MessageHeader[]
    export type  mailTab       = messenger.mailTabs.MailTab
    export type nMailTab       = messenger.mailTabs.MailTab | null
    export type uMailTab       = messenger.mailTabs.MailTab | undefined
    export type nMailFolder    = messenger.folders.MailFolder | null
    export type uMailFolder    = messenger.folders.MailFolder | undefined
    export type nWindow        = messenger.windows.Window | null

    export type  Tab           = messenger.tabs.Tab
    export type nTab           = messenger.tabs.Tab | null
