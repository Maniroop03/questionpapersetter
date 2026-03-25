import { useState, useEffect } from 'react';

interface StudyGlancePanelProps {
    isOpen: boolean;
    onClose: () => void;
    currentSubject?: string;
    facultySubject?: string;
    isAdmin?: boolean;
}

type ResourceTab = 'notes' | 'questions' | 'ppts';

interface SubjectResources {
    label: string;
    notes: { title: string; url: string }[];
    questions: { title: string; url: string }[];
    ppts: { title: string; url: string }[];
}

const RESOURCES: Record<string, SubjectResources> = {
    'Database Management Systems': {
        label: 'Database Management Systems',
        notes: [
            { title: 'DBMS Unit-1 Lecture Notes', url: 'https://studyglance.in/lecturenotes/display.php?tno=1&subject=Database Management Systems&title=DBMS Unit-1 Lecture Notes' },
            { title: 'DBMS Unit-2 Lecture Notes', url: 'https://studyglance.in/lecturenotes/display.php?tno=2&subject=Database Management Systems&title=DBMS Unit-2 Lecture Notes' },
            { title: 'DBMS Unit-3 Lecture Notes', url: 'https://studyglance.in/lecturenotes/display.php?tno=3&subject=Database Management Systems&title=DBMS Unit-3 Lecture Notes' },
            { title: 'DBMS Unit-4 Lecture Notes', url: 'https://studyglance.in/lecturenotes/display.php?tno=4&subject=Database Management Systems&title=DBMS Unit-4 Lecture Notes' },
            { title: 'DBMS Unit-5 Lecture Notes', url: 'https://studyglance.in/lecturenotes/display.php?tno=5&subject=Database Management Systems&title=DBMS Unit-5 Lecture Notes' },
        ],
        questions: [
            { title: 'DBMS Important / Previously Asked Questions', url: 'https://studyglance.in/questions/index.php' },
        ],
        ppts: [
            { title: 'DBMS PPTs', url: 'https://studyglance.in/ppts/index.php' },
        ],
    },
    'Web Technologies': {
        label: 'Web Technologies',
        notes: [
            { title: 'WT Unit-1 (PHP) Lecture Notes', url: 'https://studyglance.in/lecturenotes/display.php?tno=1&subject=Web Technologies&title=Web Technologies Unit-1 Lecture Notes' },
            { title: 'WT Unit-2 (XML) Lecture Notes', url: 'https://studyglance.in/lecturenotes/display.php?tno=2&subject=Web Technologies&title=Web Technologies Unit-2 Lecture Notes' },
            { title: 'WT Unit-3 (Servlets) Lecture Notes', url: 'https://studyglance.in/lecturenotes/display.php?tno=3&subject=Web Technologies&title=Web Technologies Unit-3 Lecture Notes' },
            { title: 'WT Unit-4 (JSP) Lecture Notes', url: 'https://studyglance.in/lecturenotes/display.php?tno=4&subject=Web Technologies&title=Web Technologies Unit-4 Lecture Notes' },
            { title: 'WT Unit-5 (JavaScript) Lecture Notes', url: 'https://studyglance.in/lecturenotes/display.php?tno=5&subject=Web Technologies&title=Web Technologies Unit-5 Lecture Notes' },
        ],
        questions: [
            { title: 'WT Unit-1 (PHP) Important Questions', url: 'https://studyglance.in/questions/display.php?url=wtunit1questions.xlsx&title=Web Technologies-Unit-1 (PHP) Important / Previously Asked Questions&subject=Web Technologies' },
            { title: 'WT Unit-2 (XML) Important Questions', url: 'https://studyglance.in/questions/display.php?url=wtunit2questions.xlsx&title=Web Technologies-Unit-2 (XML) Important / Previously Asked Questions&subject=Web Technologies' },
            { title: 'WT Unit-3 (Servlets) Important Questions', url: 'https://studyglance.in/questions/display.php?url=wtunit3questions.xlsx&title=Web Technologies-Unit-3 (Servlets) Important / Previously Asked Questions&subject=Web Technologies' },
            { title: 'WT Unit-4 (JSP) Important Questions', url: 'https://studyglance.in/questions/display.php?url=wtunit4questions.xlsx&title=Web Technologies-Unit-4 (JSP) Important / Previously Asked Questions&subject=Web Technologies' },
            { title: 'WT Unit-5 (JavaScript) Important Questions', url: 'https://studyglance.in/questions/display.php?url=wtunit5questions.xlsx&title=Web Technologies-Unit-5 (JavaScript) Important / Previously Asked Questions&subject=Web Technologies' },
        ],
        ppts: [
            { title: 'Web Technologies PPTs', url: 'https://studyglance.in/ppts/index.php' },
        ],
    },
    'Python Programming': {
        label: 'Python Programming',
        notes: [
            { title: 'Python Programming Lecture Notes (All Units)', url: 'https://studyglance.in/lecturenotes/index.php' },
        ],
        questions: [
            { title: 'Python - Important / Previously Asked Questions', url: 'https://studyglance.in/questions/display.php?url=pyunit1questions.xlsx&title=Python Programming - Important / Previously Asked Questions&subject=Python Programming' },
        ],
        ppts: [
            { title: 'Python PPTs', url: 'https://studyglance.in/ppts/index.php' },
        ],
    },
    'Java Programming': {
        label: 'Java Programming',
        notes: [
            { title: 'Java Part-1 (OOP & Introduction)', url: 'https://studyglance.in/lecturenotes/display.php?tno=1&subject=Java Programming&title=Java Programming Part-1 Lecture Notes' },
            { title: 'Java Part-2 (Basic Programming)', url: 'https://studyglance.in/lecturenotes/display.php?tno=2&subject=Java Programming&title=Java Programming Part-2 Lecture Notes' },
            { title: 'Java Part-3 (Arrays, IO)', url: 'https://studyglance.in/lecturenotes/display.php?tno=3&subject=Java Programming&title=Java Programming Part-3 Lecture Notes' },
            { title: 'Java Part-4 (String, Overloading)', url: 'https://studyglance.in/lecturenotes/display.php?tno=4&subject=Java Programming&title=Java Programming Part-4 Lecture Notes' },
            { title: 'Java Part-5 (Inheritance)', url: 'https://studyglance.in/lecturenotes/display.php?tno=5&subject=Java Programming&title=Java Programming Part-5 Lecture Notes' },
            { title: 'Java Part-6 (Polymorphism, Packages)', url: 'https://studyglance.in/lecturenotes/display.php?tno=6&subject=Java Programming&title=Java Programming Part-6 Lecture Notes' },
            { title: 'Java Part-7 (Exception Handling)', url: 'https://studyglance.in/lecturenotes/display.php?tno=7&subject=Java Programming&title=Java Programming Part-7 Lecture Notes' },
            { title: 'Java Part-8 (Multithreading)', url: 'https://studyglance.in/lecturenotes/display.php?tno=8&subject=Java Programming&title=Java Programming Part-8 Lecture Notes' },
            { title: 'Java Part-9 (JDBC)', url: 'https://studyglance.in/lecturenotes/display.php?tno=9&subject=Java Programming&title=Java Programming Part-9 Lecture Notes' },
            { title: 'Java Part-10 (GUI/AWT)', url: 'https://studyglance.in/lecturenotes/display.php?tno=10&subject=Java Programming&title=Java Programming Part-10 Lecture Notes' },
            { title: 'Java Part-11 (Swing & Applet)', url: 'https://studyglance.in/lecturenotes/display.php?tno=11&subject=Java Programming&title=Java Programming Part-11 Lecture Notes' },
        ],
        questions: [
            { title: 'Java Important Questions', url: 'https://studyglance.in/questions/index.php' },
        ],
        ppts: [
            { title: 'Java PPTs', url: 'https://studyglance.in/ppts/index.php' },
        ],
    },
    'Data Mining': {
        label: 'Data Mining',
        notes: [
            { title: 'Data Mining Unit-1 Lecture Notes', url: 'https://studyglance.in/lecturenotes/display.php?tno=1&subject=Data Mining&title=Data Mining Unit-1 Lecture Notes' },
            { title: 'Data Mining Unit-2 Lecture Notes', url: 'https://studyglance.in/lecturenotes/display.php?tno=2&subject=Data Mining&title=Data Mining Unit-2 Lecture Notes' },
            { title: 'Data Mining Unit-4 Lecture Notes', url: 'https://studyglance.in/lecturenotes/display.php?tno=4&subject=Data Mining&title=Data Mining Unit-4 Lecture Notes' },
        ],
        questions: [
            { title: 'Data Mining Important Questions', url: 'https://studyglance.in/questions/index.php' },
        ],
        ppts: [
            { title: 'Data Mining PPTs', url: 'https://studyglance.in/ppts/index.php' },
        ],
    },
    'Cyber Forensics': {
        label: 'Cyber Forensics',
        notes: [
            { title: 'Cyber Forensics Unit-1 Lecture Notes', url: 'https://studyglance.in/lecturenotes/display.php?tno=1&subject=Cyber Forensics&title=Cyber Forensics Unit-1 Lecture Notes' },
            { title: 'Cyber Forensics Unit-2 Lecture Notes', url: 'https://studyglance.in/lecturenotes/display.php?tno=2&subject=Cyber Forensics&title=Cyber Forensics Unit-2 Lecture Notes' },
            { title: 'Cyber Forensics Unit-3 Lecture Notes', url: 'https://studyglance.in/lecturenotes/display.php?tno=3&subject=Cyber Forensics&title=Cyber Forensics Unit-3 Lecture Notes' },
            { title: 'Cyber Forensics Unit-4 Lecture Notes', url: 'https://studyglance.in/lecturenotes/display.php?tno=4&subject=Cyber Forensics&title=Cyber Forensics Unit-4 Lecture Notes' },
            { title: 'Cyber Forensics Unit-5 Lecture Notes', url: 'https://studyglance.in/lecturenotes/display.php?tno=5&subject=Cyber Forensics&title=Cyber Forensics Unit-5 Lecture Notes' },
        ],
        questions: [
            { title: 'Cyber Forensics Important Questions', url: 'https://studyglance.in/questions/index.php' },
        ],
        ppts: [
            { title: 'Cyber Forensics PPTs', url: 'https://studyglance.in/ppts/index.php' },
        ],
    },
    'Computer Networks': {
        label: 'Computer Networks',
        notes: [
            { title: 'Computer Networks Lecture Notes', url: 'https://studyglance.in/lecturenotes/index.php' },
        ],
        questions: [
            { title: 'Computer Networks Important Questions', url: 'https://studyglance.in/questions/index.php' },
        ],
        ppts: [
            { title: 'Computer Networks PPTs', url: 'https://studyglance.in/ppts/index.php' },
        ],
    },
    'Operating Systems': {
        label: 'Operating Systems',
        notes: [
            { title: 'OS Lecture Notes', url: 'https://studyglance.in/lecturenotes/index.php' },
        ],
        questions: [
            { title: 'OS Important Questions', url: 'https://studyglance.in/questions/index.php' },
        ],
        ppts: [
            { title: 'OS PPTs', url: 'https://studyglance.in/ppts/index.php' },
        ],
    },
};

const ALL_SUBJECTS = Object.keys(RESOURCES);

const RESOURCE_TABS: { key: ResourceTab; label: string; icon: string }[] = [
    { key: 'notes', label: 'Lecture Notes', icon: '📄' },
    { key: 'questions', label: 'Previous Questions', icon: '❓' },
    { key: 'ppts', label: 'PPTs', icon: '📊' },
];

export default function StudyGlancePanel({ isOpen, onClose, currentSubject, facultySubject, isAdmin }: StudyGlancePanelProps) {
    const [activeTab, setActiveTab] = useState<ResourceTab>('notes');

    // Filter available subjects based on faculty specialization
    const availableSubjects = isAdmin 
        ? ALL_SUBJECTS 
        : (facultySubject && RESOURCES[facultySubject] ? [facultySubject] : ALL_SUBJECTS);

    const [selectedSubject, setSelectedSubject] = useState<string>(() => {
        if (isAdmin) {
            return currentSubject && RESOURCES[currentSubject] ? currentSubject : ALL_SUBJECTS[0];
        }
        return (facultySubject && RESOURCES[facultySubject]) ? facultySubject : (currentSubject && RESOURCES[currentSubject] ? currentSubject : ALL_SUBJECTS[0]);
    });
    
    // Reset selection if props change significantly
    useEffect(() => {
        if (isAdmin) return;
        if (facultySubject && RESOURCES[facultySubject]) {
            setSelectedSubject(facultySubject);
        }
    }, [facultySubject, isAdmin]);

    const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
    const [selectedTitle, setSelectedTitle] = useState<string>('');
    const [iframeLoading, setIframeLoading] = useState(false);

    if (!isOpen) return null;

    const resources = RESOURCES[selectedSubject];
    const links: { title: string; url: string }[] = resources ? (resources[activeTab] || []) : [];

    const tabColor = activeTab === 'notes'
        ? 'rgba(59,130,246,0.2)'
        : activeTab === 'questions'
            ? 'rgba(16,185,129,0.2)'
            : 'rgba(245,158,11,0.2)';

    const tabIcon = activeTab === 'notes' ? '📄' : activeTab === 'questions' ? '❓' : '📊';

    const handleSelectLink = (url: string, title: string) => {
        setSelectedUrl(url);
        setSelectedTitle(title);
        setIframeLoading(true);
    };

    return (
        <>
            {/* Full-screen overlay */}
            <div style={{
                position: 'fixed', inset: 0,
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)',
                zIndex: 200,
                display: 'flex', flexDirection: 'column',
                animation: 'sgFadeIn 0.22s ease-out',
            }}>
                {/* ── Top Bar ── */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 24px',
                    background: 'linear-gradient(90deg, #4338ca, #7c3aed)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                    flexShrink: 0,
                }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>📚 Study Resources</div>
                        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>
                            {selectedUrl ? selectedTitle : 'Click a resource card to view it here — no redirect'}
                        </div>
                    </div>
                    {selectedUrl && (
                        <a
                            href={selectedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                padding: '7px 14px', borderRadius: 8,
                                background: 'rgba(255,255,255,0.15)',
                                color: '#fff', fontSize: 12, textDecoration: 'none',
                                border: '1px solid rgba(255,255,255,0.25)', fontWeight: 600,
                            }}
                        >
                            Open in new tab ↗
                        </a>
                    )}
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)',
                            color: '#fff', width: 34, height: 34, borderRadius: '50%',
                            cursor: 'pointer', fontSize: 20, display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                        }}
                    >×</button>
                </div>

                {/* ── Body ── */}
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                    {/* Col 1: Subject Sidebar */}
                    <div style={{
                        width: 210, flexShrink: 0,
                        background: 'rgba(255,255,255,0.04)',
                        borderRight: '1px solid rgba(255,255,255,0.08)',
                        overflowY: 'auto', padding: '16px 10px',
                        display: 'flex', flexDirection: 'column', gap: 4,
                    }}>
                        <div style={{
                            color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: 1.2,
                            marginBottom: 8, paddingLeft: 8,
                        }}>
                            Subjects
                        </div>
                        {availableSubjects.map(s => (
                            <button
                                key={s}
                                onClick={() => { setSelectedSubject(s); setSelectedUrl(null); }}
                                style={{
                                    width: '100%', textAlign: 'left',
                                    padding: '9px 10px', borderRadius: 8, border: 'none',
                                    background: selectedSubject === s
                                        ? 'linear-gradient(90deg, rgba(99,102,241,0.35), rgba(124,58,237,0.15))'
                                        : 'transparent',
                                    borderLeft: selectedSubject === s ? '3px solid #818cf8' : '3px solid transparent',
                                    color: selectedSubject === s ? '#e0e7ff' : 'rgba(255,255,255,0.5)',
                                    fontSize: 12, fontWeight: selectedSubject === s ? 600 : 400,
                                    cursor: 'pointer', transition: 'all 0.14s',
                                }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* Col 2: Resource List */}
                    <div style={{
                        width: selectedUrl ? 280 : 'calc(100% - 210px)',
                        flexShrink: 0,
                        borderRight: selectedUrl ? '1px solid rgba(255,255,255,0.08)' : 'none',
                        display: 'flex', flexDirection: 'column',
                        transition: 'width 0.28s ease',
                        overflow: 'hidden',
                    }}>
                        {/* Tabs */}
                        <div style={{
                            display: 'flex', flexShrink: 0,
                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                            padding: '0 12px',
                        }}>
                            {RESOURCE_TABS.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => { setActiveTab(tab.key); setSelectedUrl(null); }}
                                    style={{
                                        flex: 1, padding: '10px 4px 11px',
                                        background: 'none', border: 'none',
                                        cursor: 'pointer', fontSize: 12, fontWeight: 600,
                                        color: activeTab === tab.key ? '#a5b4fc' : 'rgba(255,255,255,0.35)',
                                        borderBottom: activeTab === tab.key ? '2px solid #818cf8' : '2px solid transparent',
                                        marginBottom: -1, transition: 'color 0.14s',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Heading */}
                        <div style={{ padding: '14px 16px 8px', flexShrink: 0 }}>
                            <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{selectedSubject}</div>
                            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 2 }}>
                                {links.length} resource{links.length !== 1 ? 's' : ''} — click to view inline
                            </div>
                        </div>

                        {/* Cards */}
                        <div style={{
                            flex: 1, overflowY: 'auto', padding: '4px 12px 16px',
                            scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent',
                        }}>
                            {links.length === 0 ? (
                                <div style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 40, fontSize: 13 }}>
                                    🔍 No resources found
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {links.map((link, i) => {
                                        const isActive = selectedUrl === link.url;
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => handleSelectLink(link.url, link.title)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 10,
                                                    padding: '12px 12px', borderRadius: 10,
                                                    background: isActive
                                                        ? 'linear-gradient(90deg, rgba(99,102,241,0.3), rgba(124,58,237,0.15))'
                                                        : 'rgba(255,255,255,0.04)',
                                                    border: isActive
                                                        ? '1px solid rgba(99,102,241,0.5)'
                                                        : '1px solid rgba(255,255,255,0.08)',
                                                    cursor: 'pointer', textAlign: 'left',
                                                    transition: 'all 0.15s', width: '100%',
                                                }}
                                            >
                                                <span style={{
                                                    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                                                    background: tabColor,
                                                    display: 'flex', alignItems: 'center',
                                                    justifyContent: 'center', fontSize: 16,
                                                }}>
                                                    {tabIcon}
                                                </span>
                                                <span style={{
                                                    flex: 1, fontSize: 12, lineHeight: 1.45,
                                                    color: isActive ? '#c7d2fe' : 'rgba(255,255,255,0.7)',
                                                    fontWeight: isActive ? 600 : 400,
                                                }}>
                                                    {link.title}
                                                </span>
                                                {isActive && (
                                                    <span style={{ color: '#818cf8', fontSize: 14 }}>▶</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            <div style={{
                                marginTop: 20, padding: '10px 12px',
                                background: 'rgba(99,102,241,0.08)',
                                border: '1px solid rgba(99,102,241,0.15)',
                                borderRadius: 10, fontSize: 11,
                                color: 'rgba(255,255,255,0.4)', lineHeight: 1.6,
                            }}>
                                💡 Click a card to load it here. Use <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Open in new tab ↗</strong> at the top if the site blocks embedding.
                            </div>
                        </div>
                    </div>

                    {/* Col 3: Inline iframe Viewer */}
                    {selectedUrl ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                            {iframeLoading && (
                                <div style={{
                                    position: 'absolute', inset: 0, zIndex: 2,
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center',
                                    background: '#0f172a',
                                    color: 'rgba(255,255,255,0.5)', fontSize: 14, gap: 14,
                                }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: '50%',
                                        border: '3px solid rgba(99,102,241,0.2)',
                                        borderTopColor: '#818cf8',
                                        animation: 'sgSpin 0.8s linear infinite',
                                    }} />
                                    Loading content…
                                </div>
                            )}
                            <iframe
                                key={selectedUrl}
                                src={selectedUrl}
                                title={selectedTitle}
                                onLoad={() => setIframeLoading(false)}
                                style={{ flex: 1, border: 'none', width: '100%', height: '100%', background: '#fff' }}
                                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                            />
                        </div>
                    ) : (
                        /* Placeholder shown before any resource is selected */
                        <div style={{
                            flex: 1, display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            color: 'rgba(255,255,255,0.2)', gap: 12,
                        }}>
                            <span style={{ fontSize: 56 }}>📖</span>
                            <span style={{ fontSize: 14 }}>Select a resource from the list to view it here</span>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes sgFadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes sgSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </>
    );
}
