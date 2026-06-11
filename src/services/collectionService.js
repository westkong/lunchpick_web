// 캡슐 도감 - 인형뽑기로 뽑은 메뉴를 수집해요
// localStorage를 사용해서 앱을 꺼도 도감이 유지돼요
//
// 데이터 구조: { '김치찌개': { firstAt: 1730000000000, count: 3, rare: false }, ... }
// rare: 금색 캡슐로 뽑은 적이 있는지 (한 번 금색이면 영구 금색)

const STORAGE_KEY = 'meokpick_collection';

// 저장된 도감을 불러와요
export function loadCollection() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

// 뽑은 메뉴를 도감에 등록해요
// 반환: { isNew: 처음 뽑은 메뉴인지, rareUpgraded: 일반 → 금색으로 승급했는지 }
export function addToCollection(menuName, { rare = false } = {}) {
  const collection = loadCollection();
  const entry = collection[menuName];
  const isNew = !entry;
  const rareUpgraded = !!entry && rare && !entry.rare;

  collection[menuName] = {
    firstAt: entry ? entry.firstAt : Date.now(),
    count: (entry ? entry.count : 0) + 1,
    rare: (entry && entry.rare) || rare,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));

  return { isNew, rareUpgraded };
}

// 도감 통계 - 홈 화면 버튼 등에 표시해요
export function getCollectionStats(totalMenus) {
  const collection = loadCollection();
  const names = Object.keys(collection);
  return {
    collected: names.length,
    total: totalMenus,
    rareCount: names.filter((n) => collection[n].rare).length,
  };
}
