import React, { useState, useEffect } from 'react';

interface LoginRecord {
    id: number;
    username: string;
    timestamp: string;
}

interface User {
    username: string;
    fullName?: string;
    subject?: string;
    teachingYear?: string;
}

interface AdminDashboardProps {
    onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [history, setHistory] = useState<LoginRecord[]>([]);

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('facultyUsers') || '[]');
        const storedHistory = JSON.parse(localStorage.getItem('loginHistory') || '[]');
        setUsers(storedUsers);
        setHistory(storedHistory);
    }, []);

    const clearHistory = () => {
        if (window.confirm('Clear all login history?')) {
            localStorage.setItem('loginHistory', '[]');
            setHistory([]);
        }
    };

    const deleteUser = (username: string) => {
        if (username === 'admin') return;
        if (window.confirm(`Delete user "${username}"?`)) {
            const updatedUsers = users.filter(u => u.username !== username);
            localStorage.setItem('facultyUsers', JSON.stringify(updatedUsers));
            setUsers(updatedUsers);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)',
            padding: '40px 24px',
            color: '#fff',
        }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: '#a5b4fc' }}>Admin Monitoring Dashboard</h1>
                        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>Track faculty activity and manage accounts</p>
                    </div>
                    <button 
                        onClick={onBack}
                        style={{
                            padding: '10px 20px', borderRadius: 12, border: 'none',
                            background: 'rgba(255,255,255,0.1)', color: '#fff',
                            fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                    >
                        ← Back to App
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}>
                    {/* User Management */}
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 20, padding: 24,
                    }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 24 }}>👥</span> Registered Faculty
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {users.map(user => (
                                <div key={user.username} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '12px 16px', borderRadius: 12,
                                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ 
                                            width: 32, height: 32, borderRadius: 8, 
                                            background: user.username === 'admin' ? 'linear-gradient(135deg, #ef4444, #b91c1b)' : 'linear-gradient(135deg, #6366f1, #4338ca)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800
                                        }}>
                                            {user.username[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{user.fullName || user.username}</div>
                                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', display: 'flex', gap: 8, marginTop: 2 }}>
                                                {user.username === 'admin' ? (
                                                    <span>Administrator</span>
                                                ) : (
                                                    <>
                                                        <span style={{ color: '#a5b4fc' }}>@{user.username}</span>
                                                        <span>•</span>
                                                        <span>{user.subject || 'No Subject'}</span>
                                                        <span>•</span>
                                                        <span>{user.teachingYear || 'N/A'}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {user.username !== 'admin' && (
                                        <button 
                                            onClick={() => deleteUser(user.username)}
                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16 }}
                                            title="Delete User"
                                        >
                                            🗑
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Login History */}
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 20, padding: 24,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 24 }}>🕒</span> Login History
                            </h2>
                            <button 
                                onClick={clearHistory}
                                style={{ background: 'none', border: 'none', color: '#a5b4fc', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Clear All
                            </button>
                        </div>
                        <div style={{ 
                            display: 'flex', flexDirection: 'column', gap: 1, 
                            maxHeight: 500, overflowY: 'auto',
                            background: 'rgba(255,255,255,0.05)', borderRadius: 12, overflow: 'hidden'
                        }}>
                            {history.length === 0 ? (
                                <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
                                    No login activity recorded yet.
                                </div>
                            ) : (
                                history.map((record, idx) => (
                                    <div key={record.id} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '12px 16px',
                                        background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                                    }}>
                                        <div style={{ fontWeight: 600, color: record.username === 'admin' ? '#fca5a5' : '#e0e7ff' }}>
                                            {record.username}
                                        </div>
                                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
                                            {record.timestamp}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
