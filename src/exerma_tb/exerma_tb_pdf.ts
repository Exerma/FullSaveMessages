/* ---------------------------------------------------------------------------
 *  (c) Patrick Seuret, 2023  
 * ---------------------------------------------------------------------------
 *  exerma_tb_pdf.js
 * ---------------------------------------------------------------------------
 *
 * Create the PDF of an email
 * Documentation about jsPDF: https://parall.ax/products/jspdf
 * 
 * Versions:
 *   2023-11-18: First version (move createPDF() from project_main.ts)
 * 
 */

    // --------------- Imports
    import { jsPDF }                 from 'jspdf'
    import { saveAs } from 'file-saver'
    import { exploreMessagePartStructure, getMessagePartBody } from './exerma_tb_messages'
    import { datetimeToFieldReplacement } from '../exerma_base/exerma_misc'
    import { loadResourceHtml, loadResource }      from './exerma_tb_misc'
    import { createAndAddElement, setElementByIdAttribute, setElementByIdInnerContent } from '../exerma_base/exerma_dom'
    import log, { cRaiseUnexpected, cInfoStarted } from '../exerma_base/exerma_log'
    import type { uString } from '../exerma_base/exerma_types'
    import lang from '../exerma_base/exerma_lang'

    // ----- PDF template
    const cResourcePdfTemplate: string   = './pdf_template.html'
    const cHtmlPdfTemplateSubjectLabelId: string = 'subjectLabelId'
    const cHtmlPdfTemplateSubjectContentId: string = 'subjectContentId'
    const cHtmlPdfTemplateSenderLabelId: string = 'senderLabelId'
    const cHtmlPdfTemplateSenderContentId: string = 'senderContentId'
    const cHtmlPdfTemplateDateLabelId: string = 'dateLabelId'
    const cHtmlPdfTemplateDateContentId: string = 'dateContentId'
    const cHtmlPdfTemplateToLabelId: string = 'toLabelId'
    const cHtmlPdfTemplateToContentId: string = 'toContentId'
    const cHtmlPdfTemplateCcLabelId: string = 'ccLabelId'
    const cHtmlPdfTemplateCcContentId: string = 'ccContentId'
    const cHtmlPdfTemplateBccLabelId: string = 'bccLabelId'
    const cHtmlPdfTemplateBccContentId: string = 'bccContentId'
    const cHtmlPdfTemplateMailBodyId: string = 'mailBodyId'

    /**
     * Create a jsPDF document displaying the provided message
     * Sources:
     *      https://stackoverflow.com/questions/18191893/generate-pdf-from-html-in-div-using-javascript
     *      https://github.com/parallax/jsPDF                  
     * @param {object.messages.MessageHeader} header is the header of the message (contains subject, sender or date)
     * @param {string} resourceName is the name of the resource containing the Html template file to feed
     *                  with the data of the provided message
     * @param {object} htmlTargets is an object giving alternative Id of the fields to feed instead of the 
     *                  default one (see cHtmlPdfTemplateXxxx constants, default Id is the name of each
     *                  parameter of this object).
     * @param {string} htmlTargets.subjectLabelId is the field Id to use instead of the default field
     * @param {string} htmlTargets.subjectContentId is the field Id to use instead of the default field
     * @param {string} htmlTargets.senderLabelId is the field Id to use instead of the default field
     * @param {string} htmlTargets.senderContentId is the field Id to use instead of the default field
     * @param {string} htmlTargets.dateLabelId is the field Id to use instead of the default field
     * @param {string} htmlTargets.dateContentId is the field Id to use instead of the default field
     * @param {string} htmlTargets.toLabelId is the field Id to use instead of the default field
     * @param {string} htmlTargets.toContentId is the field Id to use instead of the default field
     * @param {string} htmlTargets.ccLabelId is the field Id to use instead of the default field
     * @param {string} htmlTargets.ccContentId is the field Id to use instead of the default field
     * @param {string} htmlTargets.bccLabelId is the field Id to use instead of the default field
     * @param {string} htmlTargets.bccContentId is the field Id to use instead of the default field
     * @param {string} htmlTargets.mailBodyId is the field Id to use instead of the default field
     * @returns {Promise<jsPDF>} is the PDF file created from the provided message
     */
    export async function createPdf (header: messenger.messages.MessageHeader,
                                     resourceName: string,
                                     htmlTargets?: {
                                        subjectLabelId?: string
                                        subjectContentId?: string
                                        senderLabelId?: string
                                        senderContentId?: string
                                        dateLabelId?: string
                                        dateContentId?: string
                                        toLabelId?: string
                                        toContentId?: string
                                        ccLabelId?: string
                                        ccContentId?: string
                                        bccLabelId?: string
                                        bccContentId?: string
                                        mailBodyId?: string
                                     }): Promise<[jsPDF, Document]> {
        
        const cSourceName = 'exerma_tb/exerma_tb_pdf.ts/createPdf'

        log().trace(cSourceName, cInfoStarted)

        // Retrieve the template page
        let myDoc: Document | undefined = await loadResourceHtml(resourceName)

        log().debugInfo(cSourceName, 'Resource loaded: ' + (myDoc === undefined ? 'failure' : 'success'))
        if (myDoc === undefined) {

            log().debugInfo(cSourceName, 'Unable to load resource file: ' + resourceName)
            
            // Create a dummy Html page from scratch
            const myDOM: DOMImplementation = document.implementation
            myDoc = myDOM.createHTMLDocument(header.subject)
            const myTag: HTMLElement = myDoc.createElement('p')
            myTag.setAttribute('id', htmlTargets?.subjectContentId ?? cHtmlPdfTemplateSubjectContentId)
            myDoc.body.appendChild(myTag)

        }

        // Get html code of the page
        const rawHtml = myDoc.textContent
        log().debugInfo(cSourceName, 'Html code: ' + rawHtml)

        // Set properties of header
        // 1) Set subject
        void feedHeaderField(myDoc,
                             htmlTargets?.subjectLabelId ?? cHtmlPdfTemplateSubjectLabelId,
                             'Sujet:', // lang().getMessage('subject', { ifNotFound: 'Sujet:' }),
                             htmlTargets?.subjectContentId ?? cHtmlPdfTemplateSubjectContentId,
                             header.subject)

        // 2) Set sender
        void feedHeaderField(myDoc,
                             htmlTargets?.senderLabelId ?? cHtmlPdfTemplateSenderLabelId,
                             'De:',
                             htmlTargets?.senderContentId ?? cHtmlPdfTemplateSenderContentId,
                             header.author)

        // 3) Set date
        let mailDate: Date = new Date(Date.now())
        if (typeof header.date === 'string') {
            mailDate = new Date(Date.parse(header.date))
        } else
        if (typeof header.date === 'number') {
            mailDate = new Date(header.date)
        }
        void feedHeaderField(myDoc,
                             htmlTargets?.senderLabelId ?? cHtmlPdfTemplateDateLabelId,
                             'Date:',
                             htmlTargets?.senderContentId ?? cHtmlPdfTemplateDateContentId,
                             datetimeToFieldReplacement(mailDate).get('full'))

        // 4) Set To
        void feedHeaderField(myDoc,
                             htmlTargets?.senderLabelId ?? cHtmlPdfTemplateToLabelId,
                             'À:',
                             htmlTargets?.senderContentId ?? cHtmlPdfTemplateToContentId,
                             concatenateListOfPersons(header.recipients))

        // 5) Set Cc
        void feedHeaderField(myDoc,
                             htmlTargets?.senderLabelId ?? cHtmlPdfTemplateCcLabelId,
                             'Copie:',
                             htmlTargets?.senderContentId ?? cHtmlPdfTemplateCcContentId,
                             concatenateListOfPersons(header.ccList))

        // 6) Set Bcc
        void feedHeaderField(myDoc,
                             htmlTargets?.senderLabelId ?? cHtmlPdfTemplateBccLabelId,
                             'Caché:',
                             htmlTargets?.senderContentId ?? cHtmlPdfTemplateBccContentId,
                             concatenateListOfPersons(header.bccList))


        // Set body of email
        const message = await messenger.messages.getFull(header.id)
        let content = ''
        if (message === null) {
            log().debugInfo(cSourceName, 'Cannot retrieve main message')
            content = '<p>Cannot retrieve main message</p>'
        } else {
            content = getMessagePartBody(message, 'text/html')
            log().debugInfo(cSourceName, 'Found: ' + content)
            if (content === '') {
                content = exploreMessagePartStructure(message)
            }
        }

        // Extract head and body of the message
        const parser = new DOMParser()
        const msgDoc: Document = parser.parseFromString(content, 'text/html')
        const msgHead = msgDoc.getElementsByTagName('head')
        const msgBody = msgDoc.getElementsByTagName('body')

        // void setElementByIdInnerContent(myDoc,
        //                                 htmlTargets?.mailBodyId ?? cHtmlPdfTemplateMailBodyId,
        //                                 (message.size?.toString() ?? '(zero)')
        //                                 + ' coucou: ' + content
        //                                 + (message.body?.length.toString() ?? '(vide)')
        //                                 + (subject?.subject ?? '(no subject)'),
        //                                 false)
        const headContainer = myDoc.getElementsByTagName('head')[0]
        if ((headContainer !== null) && (msgHead.length > 0)) {
            headContainer.insertAdjacentHTML('beforeend', msgHead[0].innerHTML)
        }

        const bodyContainer = myDoc.getElementById(htmlTargets?.mailBodyId ?? cHtmlPdfTemplateMailBodyId)
        if ((bodyContainer !== null) && (msgBody.length > 0)) {
            bodyContainer.innerHTML = msgBody[0].innerHTML
        }

        // Set document title
        const titleContainers = myDoc.getElementsByTagName('title')
        if (titleContainers.length > 0) {
            titleContainers[0].innerText = header.subject
        }


        // Create the PDF from the Html
        //   export interface jsPDFOptions {
        //         orientation?: "p" | "portrait" | "l" | "landscape";
        //         unit?: "pt" | "px" | "in" | "mm" | "cm" | "ex" | "em" | "pc";
        //         format?: string | number[];
        //         compress?: boolean;
        //         precision?: number;
        //         filters?: string[];
        //         userUnit?: number;
        //         encryption?: EncryptionOptions;
        //         putOnlyUsedFonts?: boolean;
        //         hotfixes?: string[];
        //         floatPrecision?: number | "smart";
        //     }
        // Documentation: 
        //  - https://rawgit.com/MrRio/jsPDF/master/docs/jsPDF.html (main entry)
        //  - https://html2canvas.hertzen.com/proxy/ (about proxy for external images and fonts)
        //  - https://rawgit.com/MrRio/jsPDF/master/docs/module-html.html (about jsPDF.html() function)
        //  - 
        const pdfFile = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4',
            compress: false,
            // precision: 64,
            hotfixes: ['px_scaling']
        })
        await pdfFile.html(myDoc.documentElement, {
            // margin: [25, 50, 25, 50],
            html2canvas: {
                scale: 0.9,
                proxy: 'node.js'
            }
        })

        // Make html file self-consistant Save html file for control
        const cssFile: uString = await loadResource(resourceName.replace('html', 'css'), 'text') as uString
        void createAndAddElement(myDoc,
                                 'style', {
                                 innerHtml: cssFile,
                                 setAttribute: [{ name: 'type', value: 'text/css' }],
                                 target: myDoc.getElementsByTagName('head')[0],
                                 insertPosition: 'beforeend'
                                 })
        myDoc.close()

        // Finished
        return [pdfFile, myDoc]

    }


    /**
     * Feed a "label - content" pair of Html elements
     * @param {Document} doc is the Html DOM document to alter
     * @param {string} fieldLabelId is the Id of the html element to feed with the label value
     * @param {string} fieldLabelValue is the label text (not html) to show
     * @param {string} fieldContentId is the Id of the html element to feed with the provided
     *                  context text (not html)
     * @param {string | undefined} fieldContentValue is the innerText text (not html) content to
     *                  assign to the fieldContentId element. If undefined, then the "label - content"
     *                  pair will be hidden (using the "display: hide" attribute)
     * @returns {Promise<boolean>} is true if success, false if not
     */
    async function feedHeaderField (doc: Document,
                                    fieldLabelId: string,
                                    fieldLabelValue: string,
                                    fieldContentId: string,
                                    fieldContentValue: string | undefined): Promise<boolean> {

        const cSourceName = 'exerma_tb/exerma_tb_pdf.ts/feedHeaderField'

        log().trace(cSourceName, cInfoStarted)

        try {
            
            if ((fieldContentValue === undefined) || (fieldContentValue === '')) {

                // Hide the label and content boxes
                void setElementByIdAttribute(doc, fieldLabelId,   'hidden', 'true')
                void setElementByIdAttribute(doc, fieldContentId, 'hidden', 'true')
                return true

            } else {

                // Set label and content
                void setElementByIdInnerContent(doc, fieldContentId, fieldContentValue, false)
                void setElementByIdInnerContent(doc, fieldLabelId, fieldLabelValue, false)
                return true

            }
            
        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
            return false

        }

    }

    /**
     * Concatenate a list of "Person <email@address.com>" into a single string
     * @param {string[]} listOfPersons is the list of persons (with email addresses) to concatenate into a single
     *                  string containing all of them
     * @returns {string} is the concatenation of all the provided individual persons (with or 
     *                  without their adresses)
     */
    function concatenateListOfPersons (listOfPersons: string[]): string {

        const cSourceName = 'exerma_tb/exerma_tb_pdf.ts/concatenateListOfPersons'

        log().trace(cSourceName, cInfoStarted)

        try {
            
            if (listOfPersons.length === 0) {
                return ''
            }

            return listOfPersons.reduce((previousValue, currentValue) => {
                                            return previousValue
                                                + ((previousValue.length === 0 ? '' : ', ')
                                                + currentValue)
                                        })

            
        } catch (error) {
            
            log().raiseError(cSourceName, cRaiseUnexpected, error as Error)
            return ''

        }

    }
