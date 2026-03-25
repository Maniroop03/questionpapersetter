import type { Question } from '../types';

export const findRelevantQuestions = (
    questions: Question[],
    syllabus: string,
    count: number
): Question[] => {
    if (!syllabus || !syllabus.trim()) {
        // If no syllabus, return random questions
        return shuffleArray(questions).slice(0, count);
    }

    const keywords = extractKeywords(syllabus);

    // Score each question
    const scoredQuestions = questions.map(q => {
        const score = calculateRelevance(q.text, keywords);
        return { question: q, score };
    });

    // Sort by score (descending) and then random for ties/variety
    scoredQuestions.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return Math.random() - 0.5;
    });

    return scoredQuestions.slice(0, count).map(sq => sq.question);
};

const extractKeywords = (text: string): string[] => {
    // Simple tokenizer: split by non-alphanumeric, lowercase, remove short words
    return text.toLowerCase()
        .split(/[^a-z0-9]+/i)
        .filter(word => word.length > 3)
        .filter(word => !['this', 'that', 'what', 'describe', 'explain', 'with', 'from'].includes(word));
};

const calculateRelevance = (text: string, keywords: string[]): number => {
    const lowerText = text.toLowerCase();
    let score = 0;
    keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
            score++;
        }
    });
    return score;
};

const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};
