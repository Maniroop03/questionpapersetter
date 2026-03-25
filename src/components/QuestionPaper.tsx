import React from 'react';
import type { ExamDetails, QuestionPaperSet } from '../types';

interface QuestionPaperProps {
    details: ExamDetails;
    set: QuestionPaperSet;
    id?: string;
}

const QuestionPaper: React.FC<QuestionPaperProps> = ({ details, set, id }) => {
    return (
        <div id={id || "question-paper"} className="w-[210mm] mx-auto bg-white px-10 py-12 shadow-xl print:shadow-none print:w-full print:p-0 print:m-0 text-black font-['Cambria','Times_New_Roman',serif] text-[11.5pt] leading-[1.35] box-border relative flex flex-col">
            
            {/* Logical Page 1 Wrapper for PDF Generation */}
            <div className="pdf-page w-full bg-white print:bg-transparent print:break-after-page">
                {/* Header — flex row: R22 box | College Info | SET box */}
                <div className="flex items-center justify-between mb-4">
                    <div className="border-2 border-black px-3 py-1 font-bold italic text-[13pt] self-stretch flex items-center">
                        R22
                    </div>
                    <div className="flex-1 text-center px-2">
                        <div className="font-bold uppercase text-[13pt] leading-tight">NALLA NARASIMHA REDDY EDUCATION SOCIETY'S</div>
                        <div className="font-bold uppercase text-[13pt] leading-tight">GROUP OF INSTITUTIONS</div>
                        <div className="font-bold text-[11pt] leading-tight">(Autonomous Institution)</div>
                        <div className="font-bold uppercase text-[14pt] leading-tight">SCHOOL OF ENGINEERING</div>
                    </div>
                    <div className="border-2 border-black px-3 py-1 font-bold italic text-[13pt] self-stretch flex items-center">
                        {set.setName}
                    </div>
                </div>

                <div className="text-center font-bold text-[11.5pt] uppercase mt-4 block border-b-2 border-black pb-1 mb-3">
                    {details.examName}
                </div>

                {/* Exam Details */}
                <div className="flex justify-between text-[11pt] italic font-bold mb-4 mx-6">
                    <div className="w-1/2 flex flex-col gap-0.5">
                        <p>Subject: {details.subject}</p>
                        <p>Time: {details.time}</p>
                        <p>Branch: {details.branch}</p>
                    </div>
                    <div className="w-1/2 flex flex-col gap-0.5 pl-4">
                        <p>Subject Code: {details.subjectCode}</p>
                        <p>Max Marks: {details.maxMarks}</p>
                        <p>Date: {details.date}</p>
                    </div>
                </div>

                <div className="flex justify-between items-end mb-6 font-bold mx-6 text-[11.5pt]">
                    <div className="flex items-end w-full">
                        <span>Name of the Student: </span>
                        <div className="border-b border-black flex-grow mx-2"></div>
                        <span>Hall Ticket No:</span>
                        <div className="border border-black h-8 w-44 ml-2"></div>
                    </div>
                </div>

                {/* Part A */}
                <div className="text-center font-bold underline mb-4 text-[11.5pt]">
                    PART-A (10 MARKS)
                </div>

                <div className="font-bold mb-4 ml-6 text-[11.5pt]">
                    Answer All Questions. All Questions Carry Equal Marks.
                </div>

                <div className="mb-4 ml-6">
                    <div className="flex justify-between font-bold mb-3">
                        <h4 className="text-[11.5pt]">I. Choose the correct alternative:</h4>
                        <span className="mr-8 text-[11.5pt]">[10*0.5=5M]</span>
                    </div>
                    {set.mcqs.map((q, i) => (
                        <div key={i} className="mb-1.5 break-inside-avoid">
                            <div className="flex justify-between items-start">
                                <div className="flex-1 pr-4 text-[11.5pt]">
                                    {i + 1}. {q.text}
                                </div>
                                <div className="mr-8 whitespace-nowrap font-bold text-[11.5pt]">
                                    [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-2 mt-0.5 text-[11.5pt]">
                                {q.options?.map((opt, optIndex) => (
                                    <div key={optIndex}>
                                        {String.fromCharCode(65 + optIndex)}) {opt}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Logical Page 2 Wrapper for PDF Generation */}
            <div className="pdf-page w-full bg-white print:bg-transparent mt-2">
                <div className="mb-6 ml-6">
                    <div className="flex justify-between font-bold mb-3 mt-4">
                        <h4 className="text-[11.5pt]">II. Fill in the Blanks</h4>
                        <span className="mr-6">[10*0.5=5M]</span>
                    </div>
                    {set.fibs.map((q, i) => (
                        <div key={i} className="mb-1 ml-0 break-inside-avoid text-[11.5pt]">
                            <p>
                                {i + 11}. {q.text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Part B */}
                <div className="text-center font-bold text-[11.5pt] mb-4 mt-8 break-before-auto">
                    PART-B (20 MARKS)
                </div>

                <div className="font-bold mb-4 ml-6 text-[11.5pt]">
                    <span>I) &nbsp;&nbsp;&nbsp; Answer any four of the following questions. Each Question carries 5 marks.</span>
                </div>

                <div className="mx-6 break-inside-avoid">
                    <table className="w-full border-collapse border border-black mb-4 text-[11.5pt]">
                        <thead>
                            <tr>
                                <th className="border border-black p-2 w-16 text-center font-bold">Q.NO</th>
                                <th className="border border-black p-2 w-28 text-center font-bold">
                                    Bloom’s<br />Level/CO
                                </th>
                                <th className="border border-black p-2 text-center font-bold">Question</th>
                                <th className="border border-black p-2 w-20 text-center font-bold">Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {set.partB.map((q, i) => (
                                <tr key={i} className="break-inside-avoid">
                                    <td className="border border-black p-2 text-center font-bold">{i + 1}</td>
                                    <td className="border border-black p-2 text-center font-bold italic">{q.bloomLevel}</td>
                                    <td className="border border-black p-2 text-left italic">{q.text}</td>
                                    <td className="border border-black p-2 text-center font-bold">{q.marks}M</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default QuestionPaper;
