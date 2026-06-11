// 홈 화면이에요 - 시작 버튼과 최근 먹은 메뉴 표시

import { useEffect, useState } from 'react';
import { getRecentlyEatenNames, clearHistory } from '../services/historyService';
import { getCollectionStats } from '../services/collectionService';
import { MENUS } from '../data/menuData';
import Modal from '../components/Modal';
import { requestNotificationAgreement } from '@apps-in-toss/web-framework';

// ✅ 승인 후 콘솔 → 스마트 발송 → 알림동의문에서 확인한 코드로 교체
const NOTIFICATION_TEMPLATE_CODE = 'REPLACE_WITH_TEMPLATE_CODE';

export default function HomePage({ onStart, onRoulette, onClaw, onCollection }) {
  const [recent, setRecent] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [collectionStats, setCollectionStats] = useState({ collected: 0, total: MENUS.length });

  useEffect(() => {
    setRecent(getRecentlyEatenNames());
    setCollectionStats(getCollectionStats(MENUS.length));
    // 알림 동의 팝업 (앱 첫 방문 시 1회만)
    // 토스 앱 밖(일반 브라우저)에서는 에러가 나므로 try-catch로 감싸요
    if (!localStorage.getItem('push_asked')) {
      try {
        requestNotificationAgreement({
          options: { templateCode: NOTIFICATION_TEMPLATE_CODE },
          onEvent: () => {
            localStorage.setItem('push_asked', '1');
          },
          onError: () => {},
        });
      } catch {
        // 토스 밖 환경 - 알림 동의 건너뛰기
      }
    }
  }, []);

  function handleClearHistory() {
    setShowModal(true);
  }

  function handleConfirmClear() {
    clearHistory();
    setRecent([]);
    setShowModal(false);
  }

  return (
    <div style={styles.container}>
      {showModal && (
        <Modal
          message="최근 먹은 메뉴 기록을 모두 지울까요?"
          onConfirm={handleConfirmClear}
          onCancel={() => setShowModal(false)}
        />
      )}

      <div style={styles.heroSection}>
        <div style={styles.logoRow}>
          <BentoLogo />
          <h1 style={styles.logoText}>먹픽</h1>
        </div>
        <p style={styles.tagline}>점심 고민 1분 컷.</p>
      </div>

      <div style={styles.buttonSection}>
        <button style={styles.heroButton} onClick={onClaw}>
          <span style={styles.heroEmoji}>🎮</span>
          <span style={styles.heroTextWrap}>
            <span style={styles.heroTitle}>인형뽑기로 점심 뽑기</span>
            <span style={styles.heroSub}>오늘은 운명에 맡겨봐!</span>
          </span>
        </button>
        <div style={styles.subButtonRow}>
          <button style={styles.subButton} onClick={onStart}>
            🎯 추천
          </button>
          <button style={styles.subButton} onClick={onRoulette}>
            🎰 룰렛
          </button>
          <button style={styles.subButton} onClick={onCollection}>
            📚 도감
            {collectionStats.collected > 0 && (
              <span style={styles.collectionCount}>
                {collectionStats.collected}/{collectionStats.total}
              </span>
            )}
          </button>
        </div>
      </div>

      {recent.length > 0 && (
        <div style={styles.historyBox}>
          <div style={styles.historyHeader}>
            <span style={styles.historyTitle}>최근 24시간 내 먹은 메뉴</span>
            <button style={styles.clearButton} onClick={handleClearHistory}>
              지우기
            </button>
          </div>
          <div style={styles.chipList}>
            {recent.map((name) => (
              <span key={name} style={styles.chip}>{name}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 먹픽 로고 아이콘 (도시락)
function BentoLogo() {
  return (
    <svg width="56" height="56" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bentoBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF6A00" />
          <stop offset="100%" stopColor="#FF9A3C" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#bentoBg)" />
      <ellipse cx="32" cy="42" rx="22" ry="6" fill="rgba(255,255,255,0.2)" />
      <ellipse cx="32" cy="38" rx="22" ry="14" fill="white" />
      <ellipse cx="32" cy="34" rx="14" ry="8" fill="#FFE0B2" />
      <rect x="44" y="12" width="3" height="26" rx="1.5" fill="white" transform="rotate(15 44 12)" />
      <rect x="48" y="12" width="3" height="26" rx="1.5" fill="rgba(255,255,255,0.7)" transform="rotate(15 48 12)" />
      <ellipse cx="18" cy="16" rx="4" ry="5" fill="white" />
      <rect x="16" y="20" width="3" height="16" rx="1.5" fill="white" />
    </svg>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '20px',
    boxSizing: 'border-box',
  },
  heroSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  logoText: {
    margin: 0,
    fontSize: '52px',
    fontWeight: 900,
    letterSpacing: '-2px',
    color: '#222',
  },
  tagline: {
    margin: 0,
    fontSize: '16px',
    color: '#888',
    letterSpacing: '-0.5px',
  },
  buttonSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingBottom: '8px',
  },
  heroButton: {
    width: '100%',
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: 'linear-gradient(135deg, #FF6A00 0%, #FF9A3C 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '18px',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(255, 106, 0, 0.4)',
    textAlign: 'left',
  },
  heroEmoji: {
    fontSize: '40px',
    flexShrink: 0,
  },
  heroTextWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  heroTitle: {
    fontSize: '19px',
    fontWeight: 900,
    letterSpacing: '-0.5px',
  },
  heroSub: {
    fontSize: '13px',
    opacity: 0.9,
    fontWeight: 500,
  },
  subButtonRow: {
    display: 'flex',
    gap: '10px',
  },
  subButton: {
    flex: 1,
    padding: '14px 6px',
    fontSize: '15px',
    backgroundColor: 'white',
    color: '#FF6A00',
    border: '2px solid #FF6A00',
    borderRadius: '14px',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  collectionCount: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#FF9A3C',
  },
  historyBox: {
    backgroundColor: '#f8f8f8',
    borderRadius: '12px',
    padding: '14px 16px',
    marginTop: '12px',
  },
  historyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  historyTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#666',
  },
  clearButton: {
    background: 'none',
    border: 'none',
    color: '#999',
    fontSize: '12px',
    cursor: 'pointer',
    padding: '4px',
  },
  chipList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  chip: {
    padding: '6px 12px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '20px',
    fontSize: '12px',
    color: '#555',
  },
};
