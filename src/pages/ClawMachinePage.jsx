// 인형뽑기 화면이에요 - 먹픽의 시그니처 기능!
// 집게가 좌우로 움직이다가, 버튼을 누르면 내려가서 음식을 뽑아요.
// 가끔 실패 연출(놓침)이 나오고, 결국엔 하나를 뽑아줘요.

import { useState, useEffect, useRef } from 'react';
import { MENUS, CATEGORIES, ALL_CATEGORY, getMenuEmoji } from '../data/menuData';
import { addToHistory } from '../services/historyService';
import { addToCollection } from '../services/collectionService';
import { shareResult } from '../services/shareService';
import Capsule, { colorForName } from '../components/Capsule';
import NavBar from '../components/NavBar';

// 뽑기 통 안에 깔아둘 음식 개수
const PILE_SIZE = 12;

// 금색 캡슐이 나올 확률 (희귀!)
const RARE_CHANCE = 0.05;

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function ClawMachinePage({ onHome, onCollection }) {
  const [category, setCategory] = useState(ALL_CATEGORY);
  const [phase, setPhase] = useState('idle'); // idle | dropping | grabbing | failed | lifting | done
  const [clawX, setClawX] = useState(50); // 가로 위치 %
  const [clawDown, setClawDown] = useState(false); // 집게 하강 여부
  const [pincerClosed, setPincerClosed] = useState(false);
  const [holding, setHolding] = useState(null); // 집게가 들고 있는 이모지
  const [result, setResult] = useState(null); // { name, emoji, ... }
  const [pile, setPile] = useState([]); // 통 안 음식 더미
  const swingRef = useRef(null);
  const timersRef = useRef([]);

  const pool = category === ALL_CATEGORY
    ? MENUS
    : MENUS.filter((m) => m.category === category);

  // 통 안 음식 더미 새로 채우기
  function refillPile() {
    const next = Array.from({ length: PILE_SIZE }, () => pickRandom(pool));
    setPile(next);
  }

  // 카테고리 바뀌면 더미 갱신 + 상태 초기화
  useEffect(() => {
    refillPile();
    resetClaw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (swingRef.current) clearInterval(swingRef.current);
  }

  function later(fn, ms) {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }

  function resetClaw() {
    setPhase('idle');
    setClawDown(false);
    setPincerClosed(false);
    setHolding(null);
    setResult(null);
  }

  // idle 상태에서 집게가 좌우로 흔들흔들
  useEffect(() => {
    if (phase !== 'idle') return;
    swingRef.current = setInterval(() => {
      setClawX((x) => (x <= 50 ? 80 : 20));
    }, 1400);
    return () => clearInterval(swingRef.current);
  }, [phase]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => () => clearTimers(), []);

  // 뽑기 시작!
  function handleGrab(attempt = 1) {
    if (phase !== 'idle' && phase !== 'failed') return;
    if (swingRef.current) clearInterval(swingRef.current);

    // 뽑을 음식 미리 결정 (통 안 더미 중 하나)
    const targetIndex = Math.floor(Math.random() * pile.length);
    const target = pile[targetIndex];
    // 집게를 그 음식 위치로 이동 (더미를 가로로 분포시켰다고 가정)
    const targetX = 15 + (targetIndex / (PILE_SIZE - 1)) * 70;

    setPhase('moving');
    setClawX(targetX);

    // 1) 이동 후 하강
    later(() => {
      setPhase('dropping');
      setClawDown(true);
    }, 700);

    // 2) 바닥에서 집게 오므림 (긴장의 순간)
    later(() => {
      setPhase('grabbing');
      setPincerClosed(true);
    }, 700 + 900);

    // 3) 성공/실패 판정
    later(() => {
      // 1차 시도는 35% 실패, 2차부터는 무조건 성공 (답답하지 않게)
      const failed = attempt === 1 && Math.random() < 0.35;

      if (failed) {
        setPhase('failed');
        setPincerClosed(false);
        setClawDown(false);
        // 잠깐 후 자동 재시도
        later(() => handleGrab(attempt + 1), 1100);
        return;
      }

      // 성공! 캡슐을 들고 올라감 (5% 확률로 금색 캡슐!)
      const rare = Math.random() < RARE_CHANCE;
      setHolding({ emoji: getMenuEmoji(target), color: colorForName(target.name), rare });
      setPhase('lifting');
      setClawDown(false);

      // 4) 위로 올라온 뒤 배출구로 이동
      later(() => {
        setClawX(50);
      }, 800);

      // 5) 결과 공개 + 도감 등록
      later(() => {
        setPincerClosed(false);
        setHolding(null);
        const reg = addToCollection(target.name, { rare });
        setResult({ ...target, rare, isNew: reg.isNew, rareUpgraded: reg.rareUpgraded });
        setPhase('done');
        addToHistory(target.name);
        refillPile();
      }, 800 + 700);
    }, 700 + 900 + 700);
  }

  function handleRetry() {
    resetClaw();
    setClawX(50);
  }

  function handleShare() {
    if (!result) return;
    shareResult({
      title: '먹픽 인형뽑기',
      text: `🎮 먹픽 인형뽑기로 뽑은 오늘 점심: ${getMenuEmoji(result)} ${result.name}! 너도 뽑아볼래?`,
    });
  }

  const busy = phase !== 'idle' && phase !== 'done' && phase !== 'failed';

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes ait-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        @keyframes ait-pop { 0%{transform:scale(0.3);opacity:0} 60%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
        @keyframes ait-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
      `}</style>

      <NavBar title="🎮 인형뽑기" onBack={onHome} />

      {/* 카테고리 선택 (조건 걸기) */}
      <div style={styles.catRow}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => !busy && setCategory(c)}
            style={{
              ...styles.catChip,
              backgroundColor: category === c ? '#FF6A00' : '#f3f3f3',
              color: category === c ? 'white' : '#666',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* 인형뽑기 기계 */}
      <div style={styles.machine}>
        {/* 레일 */}
        <div style={styles.rail} />

        {/* 집게 + 줄 */}
        <div style={{ ...styles.clawWrap, left: `${clawX}%` }}>
          <div
            style={{
              ...styles.string,
              height: clawDown ? 150 : 40,
            }}
          />
          <div style={styles.clawHead}>
            <div
              style={{
                ...styles.pincer,
                ...styles.pincerLeft,
                transform: pincerClosed
                  ? 'rotate(8deg)'
                  : 'rotate(-32deg)',
              }}
            />
            <div
              style={{
                ...styles.pincer,
                ...styles.pincerRight,
                transform: pincerClosed
                  ? 'rotate(-8deg)'
                  : 'rotate(32deg)',
              }}
            />
            {holding && (
              <div style={styles.holdingItem}>
                <Capsule emoji={holding.emoji} color={holding.color} rare={holding.rare} size={40} />
              </div>
            )}
          </div>
        </div>

        {/* 음식 캡슐 더미 */}
        <div style={styles.pile}>
          {pile.map((m, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                animation: `ait-float ${2 + (i % 4) * 0.4}s ease-in-out ${i * 0.1}s infinite`,
              }}
            >
              <Capsule emoji={getMenuEmoji(m)} color={colorForName(m.name)} size={42} />
            </span>
          ))}
        </div>

        {/* 배출구 */}
        <div style={styles.chute}>
          <div style={styles.chuteHole} />
        </div>

        {/* 상태 메시지 */}
        {phase === 'grabbing' && (
          <div style={styles.statusMsg}>두구두구... 🥁</div>
        )}
        {phase === 'failed' && (
          <div style={{ ...styles.statusMsg, color: '#FF3B30', animation: 'ait-shake 0.4s' }}>
            앗, 놓쳤다! 다시! 😵
          </div>
        )}
      </div>

      {/* 결과 */}
      {result && phase === 'done' ? (
        <div style={styles.resultBox}>
          {/* 도감 뱃지 */}
          {(result.rare || result.isNew || result.rareUpgraded) && (
            <div style={styles.badgeRow}>
              {result.rare && <span style={styles.rareBadge}>🏆 금색 캡슐!</span>}
              {result.isNew && <span style={styles.newBadge}>NEW! 도감 등록</span>}
              {result.rareUpgraded && <span style={styles.newBadge}>금색 승급!</span>}
            </div>
          )}
          <div style={styles.resultCapsule}>
            <Capsule emoji={getMenuEmoji(result)} color={colorForName(result.name)} rare={result.rare} size={72} opened />
          </div>
          <p style={styles.resultLabel}>캡슐 속 오늘 점심은</p>
          <p style={styles.resultName}>{result.name}</p>
          <p style={styles.resultMeta}>
            {result.category} · {result.price.toLocaleString()}원
          </p>
          <div style={styles.resultBtnRow}>
            <button style={styles.shareBtn} onClick={handleShare}>
              결과 공유 📤
            </button>
            <button style={styles.retryBtn} onClick={handleRetry}>
              다시 뽑기 🎮
            </button>
          </div>
          <button style={styles.collectionLink} onClick={onCollection}>
            📚 내 캡슐 도감 보기 →
          </button>
        </div>
      ) : (
        <button
          style={{
            ...styles.grabBtn,
            opacity: busy ? 0.5 : 1,
          }}
          onClick={() => handleGrab(1)}
          disabled={busy}
        >
          {busy ? '뽑는 중...' : '🎮 뽑기!'}
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
  catRow: {
    display: 'flex',
    gap: '6px',
    overflowX: 'auto',
    padding: '12px 16px 4px',
    flexShrink: 0,
  },
  catChip: {
    padding: '7px 14px',
    borderRadius: '100px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  machine: {
    position: 'relative',
    margin: '12px 16px',
    height: '380px',
    background: 'linear-gradient(165deg, #FFE8D6 0%, #FFD0A8 100%)',
    borderRadius: '24px',
    border: '4px solid #FF6A00',
    overflow: 'hidden',
    flexShrink: 0,
  },
  rail: {
    position: 'absolute',
    top: '24px',
    left: '6%',
    right: '6%',
    height: '6px',
    backgroundColor: '#FF6A00',
    borderRadius: '3px',
  },
  clawWrap: {
    position: 'absolute',
    top: '24px',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'left 0.8s ease-in-out',
    zIndex: 3,
  },
  string: {
    width: '3px',
    backgroundColor: '#8a4b1f',
    transition: 'height 0.8s ease-in-out',
  },
  clawHead: {
    position: 'relative',
    width: '46px',
    height: '30px',
    display: 'flex',
    justifyContent: 'center',
  },
  pincer: {
    position: 'absolute',
    top: 0,
    width: '8px',
    height: '34px',
    backgroundColor: '#5a3010',
    borderRadius: '4px',
    transition: 'transform 0.4s ease',
    transformOrigin: 'top center',
  },
  pincerLeft: { left: '14px' },
  pincerRight: { right: '14px' },
  holdingItem: {
    position: 'absolute',
    top: '26px',
    fontSize: '34px',
    animation: 'ait-pop 0.4s ease',
  },
  pile: {
    position: 'absolute',
    bottom: '54px',
    left: '8%',
    right: '8%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: '6px',
  },
  pileItem: {
    fontSize: '30px',
  },
  chute: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '46px',
    backgroundColor: 'rgba(255,106,0,0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chuteHole: {
    width: '90px',
    height: '20px',
    backgroundColor: '#5a3010',
    borderRadius: '10px',
  },
  statusMsg: {
    position: 'absolute',
    top: '46%',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#FF6A00',
    zIndex: 4,
  },
  resultBox: {
    margin: '4px 16px 16px',
    backgroundColor: '#FFF5EB',
    border: '2px solid #FF6A00',
    borderRadius: '18px',
    padding: '20px',
    textAlign: 'center',
    flexShrink: 0,
  },
  resultCapsule: {
    display: 'flex',
    justifyContent: 'center',
    animation: 'ait-pop 0.5s ease',
  },
  resultLabel: {
    margin: '6px 0 2px',
    fontSize: '14px',
    color: '#FF6A00',
    fontWeight: '600',
  },
  resultName: {
    margin: 0,
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#222',
  },
  resultMeta: {
    margin: '4px 0 14px',
    fontSize: '13px',
    color: '#888',
  },
  resultBtnRow: {
    display: 'flex',
    gap: '8px',
  },
  badgeRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '6px',
    marginBottom: '10px',
  },
  rareBadge: {
    padding: '5px 12px',
    background: 'linear-gradient(150deg, #FFE259 0%, #FFA751 100%)',
    color: '#7a4a00',
    borderRadius: '100px',
    fontSize: '13px',
    fontWeight: 'bold',
    animation: 'ait-pop 0.5s ease',
  },
  newBadge: {
    padding: '5px 12px',
    backgroundColor: '#FF3B7B',
    color: 'white',
    borderRadius: '100px',
    fontSize: '13px',
    fontWeight: 'bold',
    animation: 'ait-pop 0.5s ease',
  },
  collectionLink: {
    marginTop: '10px',
    padding: '8px',
    width: '100%',
    background: 'none',
    border: 'none',
    color: '#FF6A00',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
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
  grabBtn: {
    margin: '4px 16px 20px',
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
