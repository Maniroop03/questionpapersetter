import React, { useState } from 'react';
import type { QuestionBank, Question, Bit } from '../types';
import { parseDocument } from '../utils/documentParser';

interface QuestionBankViewProps {
    questionBank: QuestionBank;
    setQuestionBank: React.Dispatch<React.SetStateAction<QuestionBank>>;
    onBack: () => void;
}

// ── Dark-theme helpers ──────────────────────────────────────────────────────
const INPUT: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    padding: '9px 12px', borderRadius: 8,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#e0e7ff', fontSize: 13, outline: 'none',
};
const CARD: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12, padding: '16px 18px', marginBottom: 10,
};
const SECTION: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14, padding: '20px 22px', marginBottom: 20,
};
const PRIMARY_BTN: React.CSSProperties = {
    padding: '9px 18px', borderRadius: 9, border: 'none',
    background: 'linear-gradient(90deg, #4338ca, #7c3aed)',
    color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
};
const DEL_BTN: React.CSSProperties = {
    padding: '5px 12px', borderRadius: 7, border: 'none',
    background: 'rgba(239,68,68,0.15)',
    color: '#fca5a5', fontWeight: 600, fontSize: 12, cursor: 'pointer',
};

const QuestionBankView: React.FC<QuestionBankViewProps> = ({ questionBank, setQuestionBank, onBack }) => {
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [activeTab, setActiveTab] = useState<'mcq' | 'fib' | 'partB' | 'syllabus' | 'bits'>('mcq');

    const [newMcq, setNewMcq] = useState<Question>({ id: 0, text: '', type: 'MCQ', options: ['', '', '', ''] });
    const [newFib, setNewFib] = useState<Question>({ id: 0, text: '', type: 'FIB' });
    const [newPartB, setNewPartB] = useState<Question>({ id: 0, text: '', type: 'PART_B', bloomLevel: '', marks: 5 });
    const [newBit, setNewBit] = useState<Bit>({ id: 0, question: '', answer: '', unit: '' });

    const handleAddSubject = () => {
        if (newSubjectName.trim() && !questionBank[newSubjectName.trim()]) {
            setQuestionBank({ ...questionBank, [newSubjectName.trim()]: { mcqs: [], fibs: [], partB: [], bits: [] } });
            setSelectedSubject(newSubjectName.trim());
            setNewSubjectName('');
        }
    };

    const handleDeleteSubject = (subject: string) => {
        if (window.confirm(`Delete subject "${subject}" and all its questions?`)) {
            const n = { ...questionBank }; delete n[subject]; setQuestionBank(n);
            if (selectedSubject === subject) setSelectedSubject(null);
        }
    };

    const handleAddMcq = () => {
        if (!selectedSubject || !newMcq.text) return;
        const sd = questionBank[selectedSubject];
        setQuestionBank({ ...questionBank, [selectedSubject]: { ...sd, mcqs: [...sd.mcqs, { ...newMcq, id: Date.now() }] } });
        setNewMcq({ id: 0, text: '', type: 'MCQ', options: ['', '', '', ''] });
    };

    const handleAddFib = () => {
        if (!selectedSubject || !newFib.text) return;
        const sd = questionBank[selectedSubject];
        setQuestionBank({ ...questionBank, [selectedSubject]: { ...sd, fibs: [...sd.fibs, { ...newFib, id: Date.now() }] } });
        setNewFib({ id: 0, text: '', type: 'FIB' });
    };

    const handleAddPartB = () => {
        if (!selectedSubject || !newPartB.text) return;
        const sd = questionBank[selectedSubject];
        setQuestionBank({ ...questionBank, [selectedSubject]: { ...sd, partB: [...sd.partB, { ...newPartB, id: Date.now() }] } });
        setNewPartB({ id: 0, text: '', type: 'PART_B', bloomLevel: '', marks: 5 });
    };

    const handleDeleteQuestion = (type: 'mcq' | 'fib' | 'partB', id: number) => {
        if (!selectedSubject) return;
        const sd = questionBank[selectedSubject];
        if (type === 'mcq') setQuestionBank({ ...questionBank, [selectedSubject]: { ...sd, mcqs: sd.mcqs.filter(q => q.id !== id) } });
        else if (type === 'fib') setQuestionBank({ ...questionBank, [selectedSubject]: { ...sd, fibs: sd.fibs.filter(q => q.id !== id) } });
        else setQuestionBank({ ...questionBank, [selectedSubject]: { ...sd, partB: sd.partB.filter(q => q.id !== id) } });
    };

    const handleAddBit = () => {
        if (!selectedSubject || !newBit.question) return;
        const sd = questionBank[selectedSubject];
        setQuestionBank({ ...questionBank, [selectedSubject]: { ...sd, bits: [...(sd.bits || []), { ...newBit, id: Date.now() }] } });
        setNewBit({ id: 0, question: '', answer: '', unit: '' });
    };

    const handleDeleteBit = (id: number) => {
        if (!selectedSubject) return;
        const sd = questionBank[selectedSubject];
        setQuestionBank({ ...questionBank, [selectedSubject]: { ...sd, bits: (sd.bits || []).filter(b => b.id !== id) } });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedSubject) return;
        try {
            const parsed = await parseDocument(file);
            const sd = questionBank[selectedSubject];
            setQuestionBank({ ...questionBank, [selectedSubject]: { mcqs: [...sd.mcqs, ...parsed.mcqs], fibs: [...sd.fibs, ...parsed.fibs], partB: [...sd.partB, ...parsed.partB] } });
            alert(`Imported ${parsed.mcqs.length} MCQs, ${parsed.fibs.length} FIBs, and ${parsed.partB.length} Part B questions.`);
        } catch { alert('Error parsing document. Please ensure it is a valid .docx or .pdf file.'); }
        e.target.value = '';
    };

    const handleUpdateSyllabus = (text: string) => {
        if (!selectedSubject) return;
        const sd = questionBank[selectedSubject];
        setQuestionBank({ ...questionBank, [selectedSubject]: { ...sd, syllabus: text } });
    };

    const TABS = [
        { key: 'mcq', label: '🔵 MCQs' },
        { key: 'fib', label: '📝 Fill in Blanks' },
        { key: 'partB', label: '📖 Part B' },
        { key: 'bits', label: `⚡ Bits ${selectedSubject ? `(${(questionBank[selectedSubject]?.bits || []).length})` : ''}` },
        { key: 'syllabus', label: '📑 Syllabus' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)' }}>

            {/* ── Sidebar ── */}
            <div style={{ width: 240, flexShrink: 0, background: 'rgba(255,255,255,0.04)', borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', padding: '20px 12px' }}>
                <button
                    onClick={onBack}
                    style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 700, fontSize: 13, cursor: 'pointer', textAlign: 'left', marginBottom: 20, padding: '4px 8px' }}
                >
                    ← Back to Dashboard
                </button>

                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10, paddingLeft: 8 }}>
                    Subjects
                </div>

                <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                    <input
                        type="text" value={newSubjectName}
                        onChange={e => setNewSubjectName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddSubject()}
                        placeholder="New subject…"
                        style={{ ...INPUT, flex: 1, fontSize: 12 }}
                    />
                    <button onClick={handleAddSubject} style={{ ...PRIMARY_BTN, padding: '0 12px', fontSize: 18 }}>+</button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {Object.keys(questionBank).length === 0 && (
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', marginTop: 20 }}>No subjects yet.</p>
                    )}
                    {Object.keys(questionBank).map(subject => (
                        <div
                            key={subject}
                            onClick={() => setSelectedSubject(subject)}
                            style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '9px 10px', borderRadius: 8, cursor: 'pointer',
                                background: selectedSubject === subject ? 'linear-gradient(90deg, rgba(99,102,241,0.35), rgba(124,58,237,0.15))' : 'transparent',
                                borderLeft: selectedSubject === subject ? '3px solid #818cf8' : '3px solid transparent',
                                transition: 'all 0.14s',
                            }}
                        >
                            <span style={{ color: selectedSubject === subject ? '#e0e7ff' : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: selectedSubject === subject ? 600 : 400 }}>
                                {subject}
                            </span>
                            <button
                                onClick={e => { e.stopPropagation(); handleDeleteSubject(subject); }}
                                style={{ background: 'none', border: 'none', color: 'rgba(239,68,68,0.6)', cursor: 'pointer', fontSize: 14, padding: '0 2px' }}
                            >✕</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Main Content ── */}
            <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
                {selectedSubject ? (
                    <>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                            <div>
                                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Managing</div>
                                <h1 style={{ color: '#e0e7ff', fontWeight: 800, fontSize: 20, margin: '4px 0 0' }}>{selectedSubject}</h1>
                            </div>
                            <label style={{ ...PRIMARY_BTN, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                <span>📂 Import Word/PDF</span>
                                <input type="file" accept=".docx,.pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
                            </label>
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 0 }}>
                            {TABS.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key as any)}
                                    style={{
                                        padding: '9px 16px', background: 'none', border: 'none', cursor: 'pointer',
                                        color: activeTab === tab.key ? '#a5b4fc' : 'rgba(255,255,255,0.35)',
                                        fontWeight: activeTab === tab.key ? 700 : 500, fontSize: 13,
                                        borderBottom: activeTab === tab.key ? '2px solid #818cf8' : '2px solid transparent',
                                        marginBottom: -1,
                                        transition: 'all 0.14s',
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* ── MCQ TAB ── */}
                        {activeTab === 'mcq' && (
                            <div>
                                <div style={SECTION}>
                                    <h3 style={{ color: '#e0e7ff', fontWeight: 700, fontSize: 15, margin: '0 0 14px' }}>Add New MCQ</h3>
                                    <input style={INPUT} placeholder="Question Text" value={newMcq.text} onChange={e => setNewMcq({ ...newMcq, text: e.target.value })} />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '10px 0 14px' }}>
                                        {newMcq.options?.map((opt, i) => (
                                            <input key={i} style={{ ...INPUT, fontSize: 12 }} placeholder={`Option ${String.fromCharCode(65 + i)}`} value={opt}
                                                onChange={e => { const o = [...(newMcq.options || [])]; o[i] = e.target.value; setNewMcq({ ...newMcq, options: o }); }} />
                                        ))}
                                    </div>
                                    <button onClick={handleAddMcq} style={PRIMARY_BTN}>Add MCQ</button>
                                </div>
                                {questionBank[selectedSubject].mcqs.length === 0
                                    ? <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>No MCQs in bank yet.</p>
                                    : questionBank[selectedSubject].mcqs.map((q, i) => (
                                        <div key={q.id} style={{ ...CARD, borderLeft: '3px solid #818cf8' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ color: '#e0e7ff', fontWeight: 600, fontSize: 13, margin: '0 0 8px' }}>{i + 1}. {q.text}</p>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                                                        {q.options?.map((opt, oi) => (
                                                            <span key={oi} style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{String.fromCharCode(65 + oi)}) {opt}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <button onClick={() => handleDeleteQuestion('mcq', q.id)} style={DEL_BTN}>Delete</button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}

                        {/* ── FIB TAB ── */}
                        {activeTab === 'fib' && (
                            <div>
                                <div style={SECTION}>
                                    <h3 style={{ color: '#e0e7ff', fontWeight: 700, fontSize: 15, margin: '0 0 14px' }}>Add New Fill in the Blank</h3>
                                    <input style={INPUT} placeholder="Question Text (Use _____ for blank)" value={newFib.text} onChange={e => setNewFib({ ...newFib, text: e.target.value })} />
                                    <button onClick={handleAddFib} style={{ ...PRIMARY_BTN, marginTop: 12 }}>Add FIB</button>
                                </div>
                                {questionBank[selectedSubject].fibs.length === 0
                                    ? <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>No FIBs in bank yet.</p>
                                    : questionBank[selectedSubject].fibs.map((q, i) => (
                                        <div key={q.id} style={{ ...CARD, borderLeft: '3px solid #10b981', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p style={{ color: '#e0e7ff', fontWeight: 600, fontSize: 13, margin: 0 }}>{i + 1}. {q.text}</p>
                                            <button onClick={() => handleDeleteQuestion('fib', q.id)} style={DEL_BTN}>Delete</button>
                                        </div>
                                    ))}
                            </div>
                        )}

                        {/* ── PART B TAB ── */}
                        {activeTab === 'partB' && (
                            <div>
                                <div style={SECTION}>
                                    <h3 style={{ color: '#e0e7ff', fontWeight: 700, fontSize: 15, margin: '0 0 14px' }}>Add New Part B Question</h3>
                                    <textarea style={{ ...INPUT, resize: 'vertical', fontFamily: 'inherit', marginBottom: 10 } as React.CSSProperties}
                                        placeholder="Question Text" rows={3} value={newPartB.text}
                                        onChange={e => setNewPartB({ ...newPartB, text: e.target.value })} />
                                    <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                                        <input style={{ ...INPUT, flex: 1 }} placeholder="Bloom's Level / CO (e.g., L2, CO-1)" value={newPartB.bloomLevel}
                                            onChange={e => setNewPartB({ ...newPartB, bloomLevel: e.target.value })} />
                                        <input type="number" style={{ ...INPUT, width: 90 }} placeholder="Marks" value={newPartB.marks}
                                            onChange={e => setNewPartB({ ...newPartB, marks: Number(e.target.value) })} />
                                    </div>
                                    <button onClick={handleAddPartB} style={PRIMARY_BTN}>Add Question</button>
                                </div>
                                {questionBank[selectedSubject].partB.length === 0
                                    ? <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>No Part B questions yet.</p>
                                    : questionBank[selectedSubject].partB.map((q, i) => (
                                        <div key={q.id} style={{ ...CARD, borderLeft: '3px solid #a78bfa' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ color: '#e0e7ff', fontWeight: 600, fontSize: 13, margin: '0 0 8px' }}>{i + 1}. {q.text}</p>
                                                    <div style={{ display: 'flex', gap: 8 }}>
                                                        <span style={{ background: 'rgba(124,58,237,0.2)', color: '#c4b5fd', fontSize: 11, padding: '2px 8px', borderRadius: 6 }}>{q.bloomLevel}</span>
                                                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{q.marks} Marks</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleDeleteQuestion('partB', q.id)} style={DEL_BTN}>Delete</button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}

                        {/* ── SYLLABUS TAB ── */}
                        {activeTab === 'syllabus' && (
                            <div style={SECTION}>
                                <h3 style={{ color: '#e0e7ff', fontWeight: 700, fontSize: 15, margin: '0 0 6px' }}>Subject Syllabus</h3>
                                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginBottom: 14 }}>
                                    Enter the syllabus topics, units, and outcomes here. Auto-saved.
                                </p>
                                <textarea
                                    style={{ ...INPUT, height: 360, resize: 'vertical', fontFamily: 'monospace', fontSize: 12, lineHeight: 1.6 } as React.CSSProperties}
                                    placeholder="Unit 1: Introduction…"
                                    value={questionBank[selectedSubject].syllabus || ''}
                                    onChange={e => handleUpdateSyllabus(e.target.value)}
                                />
                            </div>
                        )}

                        {/* ── BITS TAB ── */}
                        {activeTab === 'bits' && (
                            <div>
                                <div style={{ ...SECTION, borderTop: '3px solid #f59e0b' }}>
                                    <h3 style={{ color: '#fde68a', fontWeight: 700, fontSize: 15, margin: '0 0 4px' }}>⚡ Add Bit (Previous Year Objective Question)</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginBottom: 14 }}>Short questions asked in previous exams — MCQ stems, one-liners, definitions, etc.</p>
                                    <input style={{ ...INPUT, marginBottom: 8 }} placeholder="Question / Bit" value={newBit.question} onChange={e => setNewBit({ ...newBit, question: e.target.value })} />
                                    <input style={{ ...INPUT, marginBottom: 8 }} placeholder="Answer (optional)" value={newBit.answer || ''} onChange={e => setNewBit({ ...newBit, answer: e.target.value })} />
                                    <input style={{ ...INPUT, marginBottom: 14 }} placeholder="Unit / Topic (e.g. Unit 2 — ER Model)" value={newBit.unit || ''} onChange={e => setNewBit({ ...newBit, unit: e.target.value })} />
                                    <button onClick={handleAddBit} style={{ ...PRIMARY_BTN, background: 'linear-gradient(90deg, #d97706, #f59e0b)' }}>Add Bit</button>
                                </div>
                                {(questionBank[selectedSubject].bits || []).length === 0
                                    ? <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>No bits added yet.</p>
                                    : (questionBank[selectedSubject].bits || []).map((bit, i) => (
                                        <div key={bit.id} style={{ ...CARD, borderLeft: '3px solid #f59e0b' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ color: '#e0e7ff', fontWeight: 600, fontSize: 13, margin: '0 0 6px' }}>{i + 1}. {bit.question}</p>
                                                    {bit.answer && <p style={{ color: '#6ee7b7', fontSize: 12, margin: '0 0 4px' }}>✅ {bit.answer}</p>}
                                                    {bit.unit && <span style={{ background: 'rgba(245,158,11,0.15)', color: '#fde68a', fontSize: 11, padding: '2px 8px', borderRadius: 6 }}>{bit.unit}</span>}
                                                </div>
                                                <button onClick={() => handleDeleteBit(bit.id)} style={DEL_BTN}>Delete</button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'rgba(255,255,255,0.2)', gap: 12 }}>
                        <span style={{ fontSize: 56 }}>🗂</span>
                        <span style={{ fontSize: 14 }}>Select or create a subject to get started</span>
                    </div>
                )}
            </div>

            <style>{`input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25); }`}</style>
        </div>
    );
};

export default QuestionBankView;
