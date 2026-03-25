import type { Question, QuestionPaperSet } from '../types';

export const generateSets = (
    mcqs: Question[],
    fibs: Question[],
    partB: Question[]
): QuestionPaperSet[] => {
    const rotate = (questions: Question[], count: number) => {
        if (questions.length === 0) return [];
        const cut = count % questions.length;
        // For "from 4th question (index 3) should be first", we need to bring index 3 to 0.
        // This is equivalent to rotating left by 3.
        // slice(3) gives [3, 4, ... end]
        // slice(0, 3) gives [0, 1, 2]
        // Combined: [3, 4, ... end, 0, 1, 2]
        return [...questions.slice(cut), ...questions.slice(0, cut)];
    };

    const createSet = (setName: string, shift: number): QuestionPaperSet => {
        return {
            setName,
            mcqs: rotate(mcqs, shift),
            fibs: rotate(fibs, shift),
            partB: [...partB], // Part B is not shuffled
        };
    };

    // Set 1: Original (Shift 0)
    // Set 2: From 4th question (Index 3) -> Shift 3
    // Set 3: From 6th question (Index 5) -> Shift 5
    // Set 4: From 8th question (Index 7) -> Shift 7
    return [
        createSet('SET-1', 0),
        createSet('SET-2', 3),
        createSet('SET-3', 5),
        createSet('SET-4', 7),
    ];
};
