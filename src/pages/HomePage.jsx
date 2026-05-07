// 홈 화면이에요 - 시작 버튼과 최근 먹은 메뉴 표시

import { useEffect, useState } from 'react';
import { getRecentlyEatenNames, clearHistory } from '../services/historyService';
import Modal from '../components/Modal';

export default function HomePage({ onStart, onRoulette }) {
  const [recent, setRecent] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setRecent(getRecentlyEatenNames());
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
      <div style={styles.top}>
        <h1 style={styles.logo}>🍱 먹픽</h1>
        <p style={styles.tagline}>점심 고민 1분 컷.</p>
      </div>

      <div style={styles.middle}>
        <p style={styles.message}>
          버튼을 눌러 조건을 선택하고<br />
          오늘 뭐 먹을지 정해봐요.
        </p>

        <button style={styles.button} onClick={onStart}>
          ▶ 추천 시작
        </button>

        <button style={styles.rouletteButton} onClick={onRoulette}>
          🎰 룰렛 돌리기
        </button>
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

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '32px 20px 20px',
    boxSizing: 'border-box',
  },
  top: {
    textAlign: 'center',
  },
  logo: {
    margin: 0,
    fontSize: '32px',
    fontWeight: 'bold',
  },
  tagline: {
    margin: '4px 0 0',
    fontSize: '14px',
    color: '#888',
  },
  middle: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '14px',
    textAlign: 'center',
  },
  message: {
    margin: 0,
    fontSize: '17px',
    color: '#555',
    lineHeight: '1.6',
  },
  button: {
    width: '100%',
    padding: '16px 36px',
    fontSize: '17px',
    backgroundColor: '#FF6A00',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(255, 106, 0, 0.3)',
  },
  rouletteButton: {
    width: '100%',
    padding: '14px 36px',
    fontSize: '16px',
    backgroundColor: 'white',
    color: '#FF6A00',
    border: '2px solid #FF6A00',
    borderRadius: '14px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  historyBox: {
    backgroundColor: '#f8f8f8',
    borderRadius: '12px',
    padding: '14px 16px',
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
