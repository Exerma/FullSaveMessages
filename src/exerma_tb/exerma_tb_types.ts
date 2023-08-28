/*----------------------------
 *  (c) Patrick Seuret, 2023  
 *----------------------------
 *  exerma_tb_types.ts
 *----------------------------
 *
 * Versions:
 *   2023-08-13: First version
 * 
 */

 // Thunderbird prototypes
 var messenger = browser;
 
 declare namespace tb {
    
    // Types related to Thunderbird Messenger
    type nMessageList = messenger.messages.MessageList | null;
    type  mailTab     = messenger.mailTabs.MailTab;
    type nMailTab     = messenger.mailTabs.MailTab | null;
    type nMailFolder  = messenger.folders.MailFolder | null;
    type uMailFolder  = messenger.folders.MailFolder | undefined;

 }
