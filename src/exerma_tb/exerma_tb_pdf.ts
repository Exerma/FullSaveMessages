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
    import { loadResourceHtml }      from './exerma_tb_misc'
    import { setElementByIdAttribute, setElementByIdInnerContent } from '../exerma_base/exerma_dom'
    import log, { cRaiseUnexpected, cInfoStarted } from '../exerma_base/exerma_log'
    
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

    /**
     * Create a jsPDF document displaying the provided message
     * Sources:
     *      https://stackoverflow.com/questions/18191893/generate-pdf-from-html-in-div-using-javascript
     *      https://github.com/parallax/jsPDF                  
     * @param {object.messages.MessageHeader} header is the header of the message (contains subject, sender or date)
     * @param {object.messages.MessagePart} message is the full message (contains body and attachments)
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
     * @returns {Promise<jsPDF>} is the PDF file created from the provided message
     */
    export async function createPdf (header: messenger.messages.MessageHeader,
                                     message: messenger.messages.MessagePart,
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
                                     }): Promise<jsPDF> {
        
        const cSourceName: string = 'exerma_tb/exerma_tb_pdf.ts/createPdf'

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
                             'Sujet:',
                             htmlTargets?.subjectContentId ?? cHtmlPdfTemplateSubjectContentId,
                             header.subject)
                             
        // 2) Set sender
        void feedHeaderField(myDoc,
                             htmlTargets?.senderLabelId ?? cHtmlPdfTemplateSenderLabelId,
                             'De:',
                             htmlTargets?.senderContentId ?? cHtmlPdfTemplateSenderContentId,
                             header.author)


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
        // Doc: https://rawgit.com/MrRio/jsPDF/master/docs/jsPDF.html
        const pdfFile = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: 'a4',
            compress: true,
            precision: 64,
            hotfixes: ['px_scaling']
        })
        await pdfFile.html(myDoc.body, {   // Doc: https://rawgit.com/MrRio/jsPDF/master/docs/module-html.html
            // margin: [17, 15, 20, 15],
            html2canvas: { scale: 0.9 }
        })
        myDoc.close()
        return pdfFile

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

        const cSourceName: string = 'exerma_tb/exerma_tb_pdf.ts/feedHeaderField'

        log().trace(cSourceName, cInfoStarted)

        try {
            
            if (fieldContentValue === undefined) {

                // Hide the label and content boxes
                void setElementByIdAttribute(doc, fieldLabelId, 'display', 'hide')
                void setElementByIdAttribute(doc, fieldContentId, 'display', 'hide')
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
