// 사용자가 최근에 먹은 메뉴를 저장하고 불러오는 기능이에요
// localStorage를 사용해서 브라우저를 꺼도 기억해요
//
// 데이터 구조: [{ name: '김치찌개', eatenAt: 1730000000000 }, ...]
// eatenAt: 먹은 시각 (밀리초). 24시간 지나면 자동으로 제외 대상에서 풀려요

const STORAGE_KEY = 'lunchpick_history';
const EXCLUDE_HOURS = 24; // 몇 시간 동안 제외할지

// 저장된 히스토리를 불러와요
export function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// "이거 먹었어요" 기록해요
export function addToHistory(menuName) {
  const history = loadHistory();
  // 같은 메뉴가 있으면 시간만 갱신 (중복 방지)
  const filtered = history.filter((h) => h.name !== menuName);
  filtered.push({ name: menuName, eatenAt: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

// 최근 EXCLUDE_HOURS 시간 안에 먹은 메뉴 이름 목록을 반환해요
export function getRecentlyEatenNames() {
  const history = loadHistory();
  const cutoff = Date.now() - EXCLUDE_HOURS * 60 * 60 * 1000;
  return history.filter((h) => h.eatenAt > cutoff).map((h) => h.name);
}

// 히스토리 전부 지워요 ("초기화" 버튼용)
export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
