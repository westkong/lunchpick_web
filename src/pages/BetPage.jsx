// 내기 뽑기 화면이에요 - "오늘 커피 누가 사?" 를 정해줘요
// 이름을 등록하면 캡슐 중 하나가 당첨돼요 (회사 단톡방 공유용!)

import { useState, useEffect, useRef } from 'react';
import { shareResult } from '../services/shareService';
import Capsule, { colorForName } from '../components/Capsule';
import NavBar from '../components/NavBar';

const NAMES_KEY = 'meokpick_bet_names';
const MAX_NAMES = 10;

const BET_TYPES = [
  { id: 'coffee', label: '☕ 커피' },
  { id: 'lunch', label: '🍚 점심값' },
  { id: 'drink', label: '🧋 음료수' },
  { id: 'dessert', label: '🍦 디저트' },
];

const FACE_EMOJIS = ['😀', '😎', '🤓', '😏', '🥳', '😺', '🦊', '🐻', '🐶', '🐼'];

// 이름으로 얼굴 이모지를 항상 같게 정해줘요
function faceForName(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return FACE_EMOJIS[h % FACE_EMOJIS.length];
}

function loadNames() {
  try {
    const raw = localStorage.getItem(NAMES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export default function BetPage({ onHome }) {
  const [names, setNames] = useState(loadNames);
  const [input, setInput] = useState('');
  const [betType, setBetType] = useState(BET_TYPES[0]);
  const [phase, setPhase] = useState('setup'); // setup | spinning | done
  const [highlight, setHighlight] = useState(-1);
  const [winner, setWinner] = useState(null);
  const timersRef = useRef([]);

  // 이름 목록은 localStorage에 저장 (매일 다시 입력 안 해도 되게)
  useEffect(() => {
    localStorage.setItem(NAMES_KEY, JSON.stringify(names));
  }, [names]);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  function addName() {
    const name = input.trim();
    if (!name) return;
    if (names.includes(name)) {
      setInput('');
      return;
    }
    if (names.length >= MAX_NAMES) return;
    setNames([...names, name]);
    setInput('');
  }

  function removeName(name) {
    if (phase === 'spinning') return;
    setNames(names.filter((n) => n !== name));
  }

  // 운명의 뽑기! 하이라이트가 빙글빙글 돌다가 점점 느려지며 멈춰요
  function handleSpin() {
    if (names.length < 2 || phase === 'spinning') return;
    setPhase('spinning');
    setWinner(null);

    const winnerIndex = Math.floor(Math.random() * names.length);
    // 3바퀴 돌고 + 당첨자 위치에서 멈춤
    const totalSteps = names.length * 3 + winnerIndex + 1;

    let step = 0;
    function tick() {
      setHighlight(step % names.length);
      step += 1;
      if (step > totalSteps) {
        setWinner(names[winnerIndex]);
        setPhase('done');
        return;
      }
      // 점점 느려지는 연출 (긴장감!)
      const progress = step / totalSteps;
      const delay = 70 + progress * progress * 380;
      timersRef.current.push(setTimeout(tick, delay));
    }
    tick();
  }

  function handleRetry() {
    setPhase('setup');
    setWinner(null);
    setHighlight(-1);
  }

  function handleShare() {
    if (!winner) return;
    shareResult({
      title: '먹픽 내기 뽑기',
      text: `🎲 먹픽 내기 뽑기 결과!\n오늘 ${betType.label}는 "${winner}" 당첨~ 🎉`,
    });
  }

  const spinning = phase === 'spinning';

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes ait-pop { 0%{transform:scale(0.3);opacity:0} 60%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
      `}</style>

      <NavBar title="🎲 내기 뽑기" onBack={onHome} />

      <p style={styles.subtitle}>오늘 누가 쏠지 운명에 맡겨봐요</p>

      {/* 내기 종류 */}
      <div style={styles.betRow}>
        {BET_TYPES.map((b) => (
          <button
            key={b.id}
            onClick={() => !spinning && setBetType(b)}
            style={{
              ...styles.betChip,
              backgroundColor: betType.id === b.id ? '#FF6A00' : '#f3f3f3',
              color: betType.id === b.id ? 'white' : '#666',
            }}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* 이름 입력 */}
      {phase !== 'done' && (
        <div style={styles.inputRow}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addName()}
            placeholder="이름 입력 (예: 김토스)"
            maxLength={8}
            disabled={spinning || names.length >= MAX_NAMES}
          />
          <button
            style={{ ...styles.addBtn, opacity: input.trim() ? 1 : 0.4 }}
            onClick={addName}
            disabled={spinning}
          >
            추가
          </button>
        </div>
      )}

      {/* 참가자 캡슐 그리드 */}
      {names.length > 0 ? (
        <div style={styles.grid}>
          {names.map((name, i) => {
            const isHighlight = highlight === i && (spinning || phase === 'done');
            const isWinner = phase === 'done' && winner === name;
            const dimmed = phase === 'done' && winner !== name;
            return (
              <div
                key={name}
                style={{
                  ...styles.cell,
                  transform: isHighlight || isWinner ? 'scale(1.18)' : 'scale(1)',
                  opacity: dimmed ? 0.35 : 1,
                  transition: 'transform 0.15s ease, opacity 0.3s ease',
                }}
              >
                <div style={{
                  borderRadius: '50%',
                  boxShadow: isHighlight || isWinner ? '0 0 0 3px #FF6A00, 0 4px 12px rgba(255,106,0,0.4)' : 'none',
                  transition: 'box-shadow 0.15s ease',
                }}>
                  <Capsule emoji={faceForName(name)} color={colorForName(name)} size={54} rare={isWinner} />
                </div>
                <span style={styles.cellName}>{name}</span>
                {phase === 'setup' && (
                  <button style={styles.removeBtn} onClick={() => removeName(name)}>
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.emptyBox}>
          <p style={styles.emptyText}>참가자를 2명 이상 추가해 주세요!</p>
          <p style={styles.emptyHint}>입력한 이름은 다음에도 기억돼요</p>
        </div>
      )}

      {/* 결과 */}
      {phase === 'done' && winner && (
        <div style={styles.resultBox}>
          <p style={styles.resultLabel}>오늘 {betType.label}는</p>
          <p style={styles.resultName}>"{winner}" 당첨! 🎉</p>
          <div style={styles.resultBtnRow}>
            <button style={styles.shareBtn} onClick={handleShare}>
              결과 공유 📤
            </button>
            <button style={styles.retryBtn} onClick={handleRetry}>
              다시 뽑기 🎲
            </button>
          </div>
        </div>
      )}

      {/* 뽑기 버튼 */}
      {phase !== 'done' && (
        <button
          style={{
            ...styles.spinBtn,
            opacity: names.length >= 2 && !spinning ? 1 : 0.5,
          }}
          onClick={handleSpin}
          disabled={names.length < 2 || spinning}
        >
          {spinning ? '두구두구... 🥁' : '🎲 운명의 뽑기!'}
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  subtitle: {
    margin: '10px 20px 0',
    fontSize: '14px',
    color: '#888',
    flexShrink: 0,
  },
  betRow: {
    display: 'flex',
    gap: '6px',
    overflowX: 'auto',
    padding: '10px 16px 4px',
    flexShrink: 0,
  },
  betChip: {
    padding: '8px 14px',
    borderRadius: '100px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  inputRow: {
    display: 'flex',
    gap: '8px',
    padding: '10px 16px 0',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    padding: '13px 14px',
    fontSize: '15px',
    border: '2px solid #eee',
    borderRadius: '12px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  addBtn: {
    padding: '0 18px',
    fontSize: '15px',
    fontWeight: 'bold',
    backgroundColor: '#FF6A00',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(76px, 1fr))',
    gap: '18px 8px',
    padding: '20px 16px',
  },
  cell: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    minWidth: 0,
  },
  cellName: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#444',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  removeBtn: {
    position: 'absolute',
    top: '-6px',
    right: '4px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#ddd',
    color: '#666',
    fontSize: '11px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  emptyBox: {
    margin: '24px 16px',
    padding: '32px 20px',
    backgroundColor: '#f8f8f8',
    borderRadius: '16px',
    textAlign: 'center',
  },
  emptyText: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#666',
  },
  emptyHint: {
    margin: '6px 0 0',
    fontSize: '12px',
    color: '#aaa',
  },
  resultBox: {
    margin: '4px 16px 12px',
    backgroundColor: '#FFF5EB',
    border: '2px solid #FF6A00',
    borderRadius: '18px',
    padding: '20px',
    textAlign: 'center',
    flexShrink: 0,
    animation: 'ait-pop 0.4s ease',
  },
  resultLabel: {
    margin: '0 0 4px',
    fontSize: '14px',
    color: '#FF6A00',
    fontWeight: '600',
  },
  resultName: {
    margin: '0 0 14px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#222',
  },
  resultBtnRow: {
    display: 'flex',
    gap: '8px',
  },
  shareBtn: {
    flex: 1,
    padding: '13px',
    backgroundColor: 'white',
    color: '#FF6A00',
    border: '2px solid #FF6A00',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  retryBtn: {
    flex: 1,
    padding: '13px',
    backgroundColor: '#FF6A00',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  spinBtn: {
    margin: 'auto 16px 20px',
    padding: '18px',
    fontSize: '19px',
    backgroundColor: '#FF6A00',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    flexShrink: 0,
    boxShadow: '0 6px 16px rgba(255,106,0,0.35)',
  },
};
