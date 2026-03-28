import React from 'react';
import { useNavigate } from 'react-router-dom';

const CARD_STYLE: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 20,
  padding: '30px 24px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 16,
  textAlign: 'center',
};

const ICON_BG: React.CSSProperties = {
  width: 64,
  height: 64,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 32,
  marginBottom: 8,
};

interface HomeViewProps {
  currentUser: string;
  isAdmin: boolean;
}

const HomeView: React.FC<HomeViewProps> = ({ currentUser, isAdmin }) => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Generate Paper',
      desc: 'Create a new question paper with multiple sets',
      icon: '📝',
      color: 'linear-gradient(135deg, #6366f1, #4338ca)',
      path: '/generator',
    },
    {
      title: 'Previous Papers',
      desc: 'View, load or delete previously generated papers',
      icon: '📂',
      color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      path: '/history',
    },
    {
      title: 'Question Bank',
      desc: 'Manage your subject-wise question repository',
      icon: '🏛',
      color: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      path: '/bank',
    },
  ];

  if (isAdmin) {
    actions.push({
      title: 'Admin Panel',
      desc: 'Manage faculty accounts and monitor login activity',
      icon: '🔐',
      color: 'linear-gradient(135deg, #10b981, #059669)',
      path: '/admin',
    });
  }

  return (
    <div style={{ padding: '60px 24px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
          Welcome back, <span style={{ color: '#a5b4fc' }}>{currentUser}</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
          What would you like to do today? Select an option below to get started.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        {actions.map((act) => (
          <div
            key={act.path}
            onClick={() => navigate(act.path)}
            style={CARD_STYLE}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          >
            <div style={{ ...ICON_BG, background: act.color }}>{act.icon}</div>
            <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>{act.title}</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0, lineHeight: 1.5 }}>
              {act.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeView;
