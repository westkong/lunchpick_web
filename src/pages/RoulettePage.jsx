// 룰렛 화면이에요 - 내가 먹고 싶은 후보 음식들을 넣고 랜덤으로 하나를 뽑아요
// useState로 목록을 관리하고, 버튼을 누르면 애니메이션 후 결과를 보여줘요

import { useState, useEffect, useRef } from 'react';

export default function RoulettePage({ onHome }) {
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [highlightIndex, setHighlightIndex] = useState(null);
  const intervalRef = useRef(null);

  // 음식 추가
  function handleAdd() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (items.includes(trimmed)) {
      alert('이미 추가된 음식이에요!');
      return;
    }
    setItems([...items, trimmed]);
    setInputValue('');
    setResult(null);
  }

  // 엔터키로도 추가
  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd();
  }

  // 음식 삭제
  function handleRemove(index) {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    setResult(null);
  }

  // 룰렛 돌리기!
  function handleSpin() {
    if (items.length < 2) {
      alert('음식을 2개 이상 추가해야 돌릴 수 있어요!');
      return;
    }
    setIsSpinning(true);
    setResult(null);

    let count = 0;
    // 처음엔 빠르게, 나중엔 느리게 하이라이트 이동
    const totalSteps = 20;
    const delays = Array.from({ length: totalSteps }, (_, i) => {
      // i가 커질수록 딜레이가 길어짐 (점점 느려짐)
      return 60 + i * 20;
    });

    function step(stepIndex) {
      if (stepIndex >= totalSteps) {
        // 최종 결과
        const finalIndex = Math.floor(Math.random() * items.length);
        setHighlightIndex(finalIndex);
        setResult(items[finalIndex]);
        setIsSpinning(false);
        return;
      }
      setHighlightIndex((prev) => {
        const next = ((prev ?? -1) + 1) % items.length;
        return next;
      });
      setTimeout(() => step(stepIndex + 1), delays[stepIndex]);
    }

    step(0);
  }

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div style={styles.container}>
      {/* 헤더 */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onHome}>← 홈</button>
        <h2 style={styles.heading}>🎰 룰렛</h2>
        <div style={{ width: 48 }} />
      </div>

      <p style={styles.desc}>먹고 싶은 음식들을 추가하고 룰렛을 돌려보세요!</p>

      {/* 입력창 */}
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          type="text"
          placeholder="음식 이름 입력..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSpinning}
        />
        <button style={styles.addBtn} onClick={handleAdd} disabled={isSpinning}>
          추가
        </button>
      </div>

      {/* 음식 목록 */}
      {items.length > 0 && (
        <div style={styles.itemList}>
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                ...styles.item,
                backgroundColor: highlightIndex === i ? '#FF6A00' : '#f5f5f5',
                color: highlightIndex === i ? 'white' : '#333',
                transform: highlightIndex === i ? 'scale(1.04)' : 'scale(1)',
              }}
            >
              <span style={styles.itemName}>{item}</span>
              {!isSpinning && (
                <button
                  style={styles.removeBtn}
                  onClick={() => handleRemove(i)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && (
        <div style={styles.emptyHint}>
          <p style={styles.emptyText}>아직 음식이 없어요</p>
          <p style={styles.emptySubText}>위 입력창에 음식 이름을 적고 추가해보세요 👆</p>
        </div>
      )}

      {/* 결과 */}
      {result && !isSpinning && (
        <div style={styles.resultBox}>
          <p style={styles.resultLabel}>🎉 오늘의 선택!</p>
          <p style={styles.resultName}>{result}</p>
        </div>
      )}

      {/* 돌리기 버튼 */}
      <button
        style={{
          ...styles.spinBtn,
          opacity: items.length >= 2 && !isSpinning ? 1 : 0.4,
        }}
        onClick={handleSpin}
        disabled={items.length < 2 || isSpinning}
      >
        {isSpinning ? '돌아가는 중...' : '🎰 돌리기!'}
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '16px 20px',
    boxSizing: 'border-box',
    gap: '14px',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    fontSize: '15px',
    color: '#FF6A00',
    cursor: 'pointer',
    fontWeight: '600',
    padding: '4px 8px',
  },
  heading: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  desc: {
    margin: 0,
    fontSize: '13px',
    color: '#888',
    textAlign: 'center',
  },
  inputRow: {
    display: 'flex',
    gap: '8px',
  },
  input: {
    flex: 1,
    padding: '12px 14px',
    fontSize: '15px',
    border: '1.5px solid #ddd',
    borderRadius: '10px',
    outline: 'none',
  },
  addBtn: {
    padding: '12px 18px',
    backgroundColor: '#FF6A00',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderRadius: '12px',
    transition: 'all 0.15s ease',
  },
  itemName: {
    fontSize: '16px',
    fontWeight: '500',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '14px',
    color: '#aaa',
    cursor: 'pointer',
    padding: '2px 6px',
  },
  emptyHint: {
    textAlign: 'center',
    padding: '24px 0',
  },
  emptyText: {
    margin: 0,
    fontSize: '16px',
    color: '#bbb',
    fontWeight: '600',
  },
  emptySubText: {
    margin: '6px 0 0',
    fontSize: '13px',
    color: '#ccc',
  },
  resultBox: {
    backgroundColor: '#FFF5EB',
    border: '2px solid #FF6A00',
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center',
  },
  resultLabel: {
    margin: '0 0 6px',
    fontSize: '14px',
    color: '#FF6A00',
    fontWeight: '600',
  },
  resultName: {
    margin: 0,
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#333',
  },
  spinBtn: {
    marginTop: 'auto',
    padding: '16px',
    fontSize: '18px',
    backgroundColor: '#FF6A00',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
