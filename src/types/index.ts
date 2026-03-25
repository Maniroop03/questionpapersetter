export interface Question {
  id: number;
  text: string;
  type: 'MCQ' | 'FIB' | 'PART_B';
  options?: string[]; // For MCQs, exactly 4 usually
  bloomLevel?: string; // e.g., L2, CO-1
  co?: string;
  marks?: number;
}

export interface ExamDetails {
  collegeName: string;
  examName: string;
  subject: string;
  subjectCode: string;
  branch: string;
  date: string;
  time: string;
  maxMarks: number;
}

export interface QuestionPaperSet {
  setName: string;
  mcqs: Question[];
  fibs: Question[];
  partB: Question[];
}

export interface SavedPaper {
  id: string; // timestamp or uuid
  date: string; // creation date
  details: ExamDetails;
  sets: QuestionPaperSet[];
  mcqs: Question[]; 
  fibs: Question[];
  partB: Question[];
  createdBy?: string; 
  isSample?: boolean;
}

export interface Bit {
  id: number;
  question: string;
  answer?: string;
  unit?: string;
}

export interface SubjectData {
  mcqs: Question[];
  fibs: Question[];
  partB: Question[];
  syllabus?: string;
  bits?: Bit[];
}

export type QuestionBank = Record<string, SubjectData>; // Key is Subject Name
