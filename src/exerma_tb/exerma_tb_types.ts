/* ----------------------------
 *  (c) Patrick Seuret, 2023  
 * ----------------------------
 *  exerma_tb_types.ts
 * ----------------------------
 *
 * Versions:
 *   2023-08-13: First version
 * 
 */

import '../../dependancies/generate-mail-extension-typings'

// Thunderbird prototypes
export const messenger = browser
 
// Types related to Thunderbird Messenger
export type nMessageList   = messenger.messages.MessageList | null
export type nMessageHeader = messenger.messages.MessageHeader | null
export type  mailTab       = messenger.mailTabs.MailTab
export type nMailTab       = messenger.mailTabs.MailTab | null
export type nMailFolder    = messenger.folders.MailFolder | null
export type uMailFolder    = messenger.folders.MailFolder | undefined
