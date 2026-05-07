// 조건을 선택하는 화면이에요

import { useState } from 'react';
import { CATEGORIES, ALL_CATEGORY, PRICE_MIN, PRICE_MAX } from '../data/menuData';
import { filterMenus, pickMultiple } from '../services/recommendationService';
import { getRecentlyEatenNames } from '../services/historyService';
import NavBar from '../components/NavBar';

export default function ConditionPage({ onResult, onBack }) {
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [preferSpicy, setPreferSpicy] = useState(false);
  const [wantSoup, setWantSoup] = useState(false);
  const [budgetUnlimited, setBudgetUnlimited] = useState(true);
  const [maxBudget, setMaxBudget] = useState(15000);
  const [excludeRecent, setExcludeRecent] = useState(true);
  const [soloOnly, setSoloOnly] = useState(false);
  const [healthyOnly, setHealthyOnly] = useState(false);

  function handleSubmit() {
    const criteria = {
      selectedCategory,
      preferSpicy,
      wantSoup,
      maxBudget: budgetUnlimited ? null : maxBudget,
      soloOnly,
      healthyOnly,
    };
    const exclude = excludeRecent ? getRecentlyEatenNames() : [];
    const candidates = filterMenus(criteria, exclude);
    const picks = pickMultiple(candidates, 1);
    onResult({ criteria, candidates, picks });
  }

  return (
    <div style={styles.container}>
      <NavBar title="먹픽" onBack={onBack} />

      <div style={styles.section}>
        <label style={styles.label}>카테고리</label>
        <select
          style={styles.select}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <BudgetSection
        unlimited={budgetUnlimited}
        onUnlimitedChange={setBudgetUnlimited}
        value={maxBudget}
        onValueChange={setMaxBudget}
      />

      <div style={styles.section}>
        <label style={styles.label}>추가 조건</label>
        <ToggleRow label="매운 음식 선호 🌶️" value={preferSpicy} onChange={setPreferSpicy} />
        <ToggleRow label="국물 있는 음식 🍲" value={wantSoup} onChange={setWantSoup} />
        <ToggleRow label="혼밥 가능한 메뉴 🙋" value={soloOnly} onChange={setSoloOnly} />
        <ToggleRow label="건강한 메뉴 🥗" value={healthyOnly} onChange={setHealthyOnly} />
        <ToggleRow label="최근 먹은 메뉴 제외 ⏰" value={excludeRecent} onChange={setExcludeRecent} />
      </div>

      <button style={styles.button} onClick={handleSubmit}>
        추천 받기
      </button>
    </div>
  );
}

// 예산 섹션: 체크박스 + 슬라이더
function BudgetSection({ unlimited, onUnlimitedChange, value, onValueChange }) {
  function snapPrice(raw) {
    if (raw < 50000) return Math.round(raw / 1000) * 1000;
    if (raw < 200000) return Math.round(raw / 5000) * 5000;
    return Math.round(raw / 10000) * 10000;
  }

  return (
    <div style={styles.section}>
      <div style={styles.budgetHeader}>
        <label style={styles.label}>예산</label>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={unlimited}
            onChange={(e) => onUnlimitedChange(e.target.checked)}
            style={styles.checkbox}
          />
          상관없음
        </label>
      </div>

      {!unlimited && (
        <>
          <div style={styles.priceDisplay}>
            <span style={styles.priceValue}>{value.toLocaleString()}원</span>
            <span style={styles.priceUnit}>이하</span>
          </div>
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={1000}
            value={value}
            onChange={(e) => onValueChange(snapPrice(Number(e.target.value)))}
            style={styles.slider}
          />
          <div style={styles.priceMinMax}>
            <span>{PRICE_MIN.toLocaleString()}원</span>
            <span>{PRICE_MAX.toLocaleString()}원</span>
          </div>
        </>
      )}
    </div>
  );
}

function ToggleRow({ label, value, onChange }) {
  return (
    <div style={styles.toggleRow}>
      <span style={styles.toggleLabel}>{label}</span>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div
      style={{ ...styles.toggle, backgroundColor: value ? '#FF6A00' : '#ccc' }}
      onClick={() => onChange(!value)}
    >
      <div
        style={{
          ...styles.toggleThumb,
          transform: value ? 'translateX(20px)' : 'translateX(0)',
        }}
      />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 20px',
    gap: '20px',
    height: '100%',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  heading: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 'bold',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#333',
  },
  select: {
    padding: '12px',
    fontSize: '15px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
  },
  budgetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: '#555',
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: '#FF6A00',
    cursor: 'pointer',
  },
  priceDisplay: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    padding: '4px 0',
  },
  priceValue: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#FF6A00',
  },
  priceUnit: {
    fontSize: '14px',
    color: '#888',
  },
  slider: {
    width: '100%',
    height: '6px',
    accentColor: '#FF6A00',
    cursor: 'pointer',
  },
  priceMinMax: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#999',
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4px 0',
  },
  toggleLabel: {
    fontSize: '15px',
    color: '#444',
  },
  toggle: {
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.2s',
    flexShrink: 0,
  },
  toggleThumb: {
    width: '20px',
    height: '20px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute',
    top: '2px',
    left: '2px',
    transition: 'transform 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
  button: {
    marginTop: 'auto',
    padding: '16px',
    fontSize: '17px',
    backgroundColor: '#FF6A00',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
