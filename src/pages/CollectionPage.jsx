// 캡슐 도감 화면이에요 - 인형뽑기로 뽑은 메뉴가 모여요
// 못 뽑은 메뉴는 ❓ 실루엣으로 보여서 "다 모으고 싶다!"는 마음이 들게 해요

import { useMemo, useState } from 'react';
import { MENUS, CATEGORIES, ALL_CATEGORY, getMenuEmoji } from '../data/menuData';
import { loadCollection } from '../services/collectionService';
import Capsule, { colorForName } from '../components/Capsule';
import NavBar from '../components/NavBar';

export default function CollectionPage({ onBack }) {
  const [category, setCategory] = useState(ALL_CATEGORY);
  const collection = useMemo(() => loadCollection(), []);

  const menus = category === ALL_CATEGORY
    ? MENUS
    : MENUS.filter((m) => m.category === category);

  const collectedCount = MENUS.filter((m) => collection[m.name]).length;
  const rareCount = MENUS.filter((m) => collection[m.name] && collection[m.name].rare).length;
  const percent = Math.round((collectedCount / MENUS.length) * 100);

  return (
    <div style={styles.container}>
      <NavBar title="📚 캡슐 도감" onBack={onBack} />

      {/* 수집 현황 카드 */}
      <div style={styles.progressCard}>
        <div style={styles.progressTop}>
          <span style={styles.progressCount}>
            {collectedCount}
            <span style={styles.progressTotal}> / {MENUS.length}</span>
          </span>
          <span style={styles.progressPercent}>{percent}%</span>
        </div>
        <div style={styles.progressBarBg}>
          <div style={{ ...styles.progressBarFill, width: `${percent}%` }} />
        </div>
        <div style={styles.progressBottom}>
          <span style={styles.rareLabel}>✨ 금색 캡슐 {rareCount}개</span>
          {collectedCount === 0 && (
            <span style={styles.hintLabel}>인형뽑기로 캡슐을 모아보세요!</span>
          )}
        </div>
      </div>

      {/* 카테고리 선택 */}
      <div style={styles.catRow}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
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

      {/* 캡슐 그리드 */}
      <div style={styles.grid}>
        {menus.map((menu) => {
          const entry = collection[menu.name];
          return (
            <div key={menu.name} style={styles.cell}>
              <Capsule
                emoji={getMenuEmoji(menu)}
                color={colorForName(menu.name)}
                size={52}
                rare={entry ? entry.rare : false}
                locked={!entry}
              />
              <span style={{
                ...styles.cellName,
                color: entry ? '#444' : '#bbb',
              }}>
                {entry ? menu.name : '???'}
              </span>
            </div>
          );
        })}
      </div>
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
  progressCard: {
    margin: '12px 16px 4px',
    padding: '16px',
    background: 'linear-gradient(135deg, #FFF5EB 0%, #FFE8D6 100%)',
    border: '2px solid #FF6A00',
    borderRadius: '16px',
    flexShrink: 0,
  },
  progressTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '8px',
  },
  progressCount: {
    fontSize: '26px',
    fontWeight: 900,
    color: '#FF6A00',
  },
  progressTotal: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#999',
  },
  progressPercent: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#FF6A00',
  },
  progressBarBg: {
    height: '10px',
    backgroundColor: 'rgba(255,106,0,0.15)',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #FF6A00, #FF9A3C)',
    borderRadius: '5px',
    transition: 'width 0.6s ease',
  },
  progressBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '8px',
  },
  rareLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#C8881D',
  },
  hintLabel: {
    fontSize: '12px',
    color: '#999',
  },
  catRow: {
    display: 'flex',
    gap: '6px',
    overflowX: 'auto',
    padding: '10px 16px 4px',
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))',
    gap: '14px 8px',
    padding: '14px 16px 24px',
  },
  cell: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
    minWidth: 0,
  },
  cellName: {
    fontSize: '10px',
    fontWeight: 600,
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};
