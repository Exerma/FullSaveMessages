# Message exfiltration extension for Thunderbird

Version: 28.08.2025

## License

This work is under CreativeCommon licence [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

## Summary

This project aims to allow user to save bulks of emails to local disk as archive, documentation or other traceability reasons as mailboxes are not the best place for long terme messages (because of limitation of volume, duration and sensibility). It is also interesting to keel messages related to a project with its other files.

It is currently proposed in French only.

## What the extension does

This extension adds a « Full Save » action button in Thunderbird. This button allows user to chose the following actions:

- Archive (« Archiver »)
- Save attachments (« Pièces jointes »)

### Archive

Archiving will save all selected messages in current folder into EML, HTML and PDF format.

First, a list of unique message subjects and senders is proposed into a window to allow the user to choose the exported file names. Actually, the final names will be build with the `YYYY-MM-DD HHMM__SenderName__MessageSubject` format (it is planned to allow the user to choose format in next versions). This window allow user to choose to save attachments as separated files or not (in format `YYYY-MM-DD HHMM一一Filename`).

Then user is asked to choose the target directory with a « Download » window for the first file to save. All other files will be saved in the same directory using the providing message subject and sender name.

Each email is saved into three different files: EML, HTML and PDF version. The PDF version is the HTML file converted using the « jspdf » package.

### Save attachment

This features is used to save all attachments of the selected messages (and only attachments).

As for archives, first file is saved using the « download » window and next files are saved in same directory. File names are built using the same syntax than attachments in Archive.
