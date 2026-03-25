import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, PageBreak } from 'docx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { ExamDetails, QuestionPaperSet } from '../types';

const noBorder = { style: BorderStyle.NIL, size: 0, color: "FFFFFF" } as const;
const thinBorder = { style: BorderStyle.SINGLE, size: 2, color: "000000" } as const;
const allNoBorders = { 
    top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, 
    insideHorizontal: noBorder, insideVertical: noBorder 
};
const allThinBorders = { 
    top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder, 
    insideHorizontal: thinBorder, insideVertical: thinBorder 
};

const sp = (before = 0, after = 0) => ({ spacing: { before, after, line: 240, lineRule: "exact" as const } });

const createQuestionPaperContent = (details: ExamDetails, set: QuestionPaperSet) => {
    const F = "Cambria";
    const S = 22; // 11pt
    const H = 24; // 12pt

    const mcqTableBorders = { 
        top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, 
        insideHorizontal: noBorder, insideVertical: noBorder 
    };

    return [
        // ── HEADER TABLE ────────────────────────────────────────────────────
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: allNoBorders, 
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 12, type: WidthType.PERCENTAGE },
                            verticalAlign: "center",
                            borders: allThinBorders,
                            children: [new Paragraph({ alignment: AlignmentType.CENTER, ...sp(0,0), children: [new TextRun({ text: "R22", bold: true, size: H, font: F, italics: true })] })],
                        }),
                        new TableCell({
                            width: { size: 76, type: WidthType.PERCENTAGE },
                            borders: allNoBorders,
                            children: [
                                new Paragraph({ alignment: AlignmentType.CENTER, ...sp(0,0), children: [new TextRun({ text: "NALLA NARASIMHA REDDY EDUCATION SOCIETY'S", bold: true, size: H, font: F })] }),
                                new Paragraph({ alignment: AlignmentType.CENTER, ...sp(0,0), children: [new TextRun({ text: "GROUP OF INSTITUTIONS", bold: true, size: H, font: F })] }),
                                new Paragraph({ alignment: AlignmentType.CENTER, ...sp(0,0), children: [new TextRun({ text: "(Autonomous Institution)", bold: true, size: S, font: F })] }),
                                new Paragraph({ alignment: AlignmentType.CENTER, ...sp(0,0), children: [new TextRun({ text: "SCHOOL OF ENGINEERING", bold: true, size: 26, font: F })] }),
                            ],
                        }),
                        new TableCell({
                            width: { size: 12, type: WidthType.PERCENTAGE },
                            verticalAlign: "center",
                            borders: allThinBorders,
                            children: [new Paragraph({ alignment: AlignmentType.CENTER, ...sp(0,0), children: [new TextRun({ text: set.setName, bold: true, size: H, font: F, italics: true })] })],
                        }),
                    ],
                }),
            ],
        }),

        // ── EXAM NAME ───────────────────────────────────────────────────────
        new Paragraph({ 
            alignment: AlignmentType.CENTER, 
            ...sp(80, 40), 
            border: {
                bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 12 }
            },
            children: [new TextRun({ text: details.examName, bold: true, size: S, font: F })] 
        }),

        // ── EXAM DETAILS TABLE ──────────────────────────────────────────────
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: allNoBorders,
            rows: [
                new TableRow({ children: [
                    new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, borders: allNoBorders, children: [new Paragraph({ ...sp(0,0), children: [new TextRun({ text: `Subject: ${details.subject}`, bold: true, size: S, font: F, italics: true })] })] }),
                    new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, borders: allNoBorders, children: [new Paragraph({ ...sp(0,0), children: [new TextRun({ text: `Subject Code: ${details.subjectCode}`, bold: true, size: S, font: F, italics: true })] })] }),
                ]}),
                new TableRow({ children: [
                    new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, borders: allNoBorders, children: [new Paragraph({ ...sp(0,0), children: [new TextRun({ text: `Branch: ${details.branch}`, bold: true, size: S, font: F, italics: true })] })] }),
                    new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, borders: allNoBorders, children: [new Paragraph({ ...sp(0,0), children: [new TextRun({ text: `Date: ${details.date}`, bold: true, size: S, font: F, italics: true })] })] }),
                ]}),
                new TableRow({ children: [
                    new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, borders: allNoBorders, children: [new Paragraph({ ...sp(0,0), children: [new TextRun({ text: `Time: ${details.time}`, bold: true, size: S, font: F, italics: true })] })] }),
                    new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, borders: allNoBorders, children: [new Paragraph({ ...sp(0,0), children: [new TextRun({ text: `Max Marks: ${details.maxMarks}`, bold: true, size: S, font: F, italics: true })] })] }),
                ]}),
            ],
        }),

        // ── PART A ──────────────────────────────────────────────────────────
        new Paragraph({ alignment: AlignmentType.CENTER, ...sp(60, 20), children: [new TextRun({ text: "PART-A (10 MARKS)", bold: true, underline: {}, size: S, font: F })] }),
        new Paragraph({ ...sp(0, 40), children: [new TextRun({ text: "Answer All Questions. All Questions Carry Equal Marks.", bold: true, size: S, font: F })] }),

        // MCQs Header
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: mcqTableBorders,
            rows: [
                new TableRow({ children: [
                    new TableCell({ borders: mcqTableBorders, width: { size: 80, type: WidthType.PERCENTAGE }, children: [new Paragraph({ ...sp(0,0), children: [new TextRun({ text: "I. Choose the correct alternative:", bold: true, size: S, font: F })] })] }),
                    new TableCell({ borders: mcqTableBorders, width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, ...sp(0,0), children: [new TextRun({ text: "[10*0.5=5M]", bold: true, size: S, font: F })] })] }),
                ]})
            ]
        }),

        // MCQs
        ...set.mcqs.flatMap((q, i) => [
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: mcqTableBorders,
                rows: [
                    // Question text & Bracket
                    new TableRow({ children: [
                        new TableCell({ borders: mcqTableBorders, width: { size: 85, type: WidthType.PERCENTAGE }, children: [new Paragraph({ ...sp(30,0), children: [new TextRun({ text: `${i + 1}. ${q.text}`, size: S, font: F })] })] }),
                        new TableCell({ borders: mcqTableBorders, width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, ...sp(30,0), children: [new TextRun({ text: "[        ]", bold: true, size: S, font: F })] })] }),
                    ]}),
                    // Options A & B
                    new TableRow({ children: [
                        new TableCell({ borders: mcqTableBorders, width: { size: 50, type: WidthType.PERCENTAGE }, children: [new Paragraph({ indent: { left: 240 }, ...sp(10,0), children: [new TextRun({ text: `A) ${q.options?.[0] || ''}`, size: S, font: F })] })] }),
                        new TableCell({ borders: mcqTableBorders, width: { size: 50, type: WidthType.PERCENTAGE }, children: [new Paragraph({ indent: { left: 240 }, ...sp(10,0), children: [new TextRun({ text: `B) ${q.options?.[1] || ''}`, size: S, font: F })] })] }),
                    ]}),
                    // Options C & D
                    new TableRow({ children: [
                        new TableCell({ borders: mcqTableBorders, width: { size: 50, type: WidthType.PERCENTAGE }, children: [new Paragraph({ indent: { left: 240 }, ...sp(10,0), children: [new TextRun({ text: `C) ${q.options?.[2] || ''}`, size: S, font: F })] })] }),
                        new TableCell({ borders: mcqTableBorders, width: { size: 50, type: WidthType.PERCENTAGE }, children: [new Paragraph({ indent: { left: 240 }, ...sp(10,0), children: [new TextRun({ text: `D) ${q.options?.[3] || ''}`, size: S, font: F })] })] }),
                    ]}),
                ],
            }),
        ]),

        // ── PAGE BREAK ───────────────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),

        // FIBs Header
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: mcqTableBorders,
            rows: [
                new TableRow({ children: [
                    new TableCell({ borders: mcqTableBorders, width: { size: 80, type: WidthType.PERCENTAGE }, children: [new Paragraph({ ...sp(0,0), children: [new TextRun({ text: "II. Fill in the Blanks", bold: true, size: S, font: F })] })] }),
                    new TableCell({ borders: mcqTableBorders, width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, ...sp(0,0), children: [new TextRun({ text: "[10*0.5=5M]", bold: true, size: S, font: F })] })] }),
                ]})
            ]
        }),
        
        // FIBs Questions
        ...set.fibs.map((q, i) =>
            new Paragraph({ ...sp(20, 0), children: [new TextRun({ text: `${i + 11}. ${q.text}`, size: S, font: F })] })
        ),

        // ── PART B ──────────────────────────────────────────────────────────
        new Paragraph({ alignment: AlignmentType.CENTER, ...sp(120, 20), children: [new TextRun({ text: "PART-B (20 MARKS)", bold: true, underline: {}, size: S, font: F })] }),
        new Paragraph({ ...sp(0, 40), children: [new TextRun({ text: "I)  Answer any four of the following questions. Each Question carries 5 marks.", bold: true, size: S, font: F })] }),

        // Part B Table
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: allThinBorders,
            rows: [
                new TableRow({ children: [
                    new TableCell({ borders: allThinBorders, width: { size: 8, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, ...sp(20,20), children: [new TextRun({ text: "Q.NO", bold: true, size: S, font: F })] })] }),
                    new TableCell({ borders: allThinBorders, width: { size: 22, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, ...sp(20,20), children: [new TextRun({ text: "Bloom's Level/CO", bold: true, size: S, font: F })] })] }),
                    new TableCell({ borders: allThinBorders, width: { size: 58, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, ...sp(20,20), children: [new TextRun({ text: "Question", bold: true, size: S, font: F })] })] }),
                    new TableCell({ borders: allThinBorders, width: { size: 12, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, ...sp(20,20), children: [new TextRun({ text: "Marks", bold: true, size: S, font: F })] })] }),
                ]}),
                ...set.partB.map((q, i) =>
                    new TableRow({ children: [
                        new TableCell({ borders: allThinBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, ...sp(40,40), children: [new TextRun({ text: `${i + 1}`, size: S, font: F })] })] }),
                        new TableCell({ borders: allThinBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, ...sp(40,40), children: [new TextRun({ text: q.bloomLevel || "", italics: true, size: S, font: F })] })] }),
                        new TableCell({ borders: allThinBorders, children: [new Paragraph({ ...sp(40,40), children: [new TextRun({ text: q.text, italics: true, size: S, font: F })] })] }),
                        new TableCell({ borders: allThinBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, ...sp(40,40), children: [new TextRun({ text: `${q.marks}M`, size: S, font: F })] })] }),
                    ]})
                ),
            ],
        }),
    ];
};

export const generateWordDocument = async (details: ExamDetails, set: QuestionPaperSet) => {
    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: { font: "Cambria", size: 20 },
                    paragraph: { spacing: { line: 240, lineRule: "exact", before: 0, after: 0 } },
                },
            },
        },
        sections: [
            {
                properties: {
                    page: {
                        margin: { top: 720, bottom: 720, left: 900, right: 900 }, // ~1.27cm margins
                    },
                },
                children: createQuestionPaperContent(details, set),
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${set.setName}.docx`);
};

export const generateAllWordDocuments = async (details: ExamDetails, sets: QuestionPaperSet[]) => {
    const children: any[] = [];

    sets.forEach((set, index) => {
        const setChildren = createQuestionPaperContent(details, set);
        children.push(...setChildren);

        if (index < sets.length - 1) {
            children.push(new Paragraph({ children: [new PageBreak()] }));
        }
    });

    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: { font: "Cambria", size: 20 },
                    paragraph: { spacing: { line: 240, lineRule: "exact", before: 0, after: 0 } },
                },
            },
        },
        sections: [
            {
                properties: {
                    page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } }, // ~1.27cm margins
                },
                children: children,
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${details.examName}_All_Sets.docx`);
};

export const generatePDF = async (elementId: string, fileName: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Look for explicit page elements to prevent text-slicing
    const pages = Array.from(element.querySelectorAll('.pdf-page')) as HTMLElement[];
    
    if (pages.length > 0) {
        for (let i = 0; i < pages.length; i++) {
            const pageEl = pages[i];
            const canvas = await html2canvas(pageEl, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            
            const imgProps = pdf.getImageProperties(imgData);
            const ratio = imgProps.width / imgProps.height;
            const renderedHeight = pdfWidth / ratio;
            
            let drawWidth = pdfWidth;
            let drawHeight = renderedHeight;
            let xOffset = 0;
            
            if (renderedHeight > pdfHeight) {
                const scale = pdfHeight / renderedHeight;
                drawHeight = pdfHeight;
                drawWidth = pdfWidth * scale;
                xOffset = (pdfWidth - drawWidth) / 2;
            }
            
            if (i > 0) pdf.addPage();
            pdf.addImage(imgData, 'PNG', xOffset, 0, drawWidth, drawHeight);
        }
    } else {
        // Fallback to original slicing logic
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const totalPdfHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = totalPdfHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position -= pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
            heightLeft -= pdfHeight;
        }
    }

    pdf.save(`${fileName}.pdf`);
};

export const generateAllPDFs = async (elementIds: string[], fileName: string) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    let isFirstPage = true;

    for (let i = 0; i < elementIds.length; i++) {
        const element = document.getElementById(elementIds[i]);
        if (element) {
            const pages = Array.from(element.querySelectorAll('.pdf-page')) as HTMLElement[];
            
            if (pages.length > 0) {
                for (let j = 0; j < pages.length; j++) {
                    const pageEl = pages[j];
                    const canvas = await html2canvas(pageEl, { scale: 2 });
                    const imgData = canvas.toDataURL('image/png');
                    
                    const imgProps = pdf.getImageProperties(imgData);
                    const ratio = imgProps.width / imgProps.height;
                    const renderedHeight = pdfWidth / ratio;
                    
                    let drawWidth = pdfWidth;
                    let drawHeight = renderedHeight;
                    let xOffset = 0;
                    
                    if (renderedHeight > pdfHeight) {
                        const scale = pdfHeight / renderedHeight;
                        drawHeight = pdfHeight;
                        drawWidth = pdfWidth * scale;
                        xOffset = (pdfWidth - drawWidth) / 2;
                    }
                    
                    if (!isFirstPage) pdf.addPage();
                    pdf.addImage(imgData, 'PNG', xOffset, 0, drawWidth, drawHeight);
                    isFirstPage = false;
                }
            } else {
                const canvas = await html2canvas(element, { scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                const totalPdfHeight = (canvas.height * pdfWidth) / canvas.width;

                let heightLeft = totalPdfHeight;
                let position = 0;

                if (!isFirstPage) pdf.addPage();
                
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
                heightLeft -= pdfHeight;
                isFirstPage = false;

                while (heightLeft > 0) {
                    position -= pdfHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
                    heightLeft -= pdfHeight;
                }
            }
        }
    }
    pdf.save(`${fileName}.pdf`);
};
