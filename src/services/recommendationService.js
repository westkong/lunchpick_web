// 조건에 맞는 메뉴를 걸러내고, 랜덤으로 뽑아주는 로직이에요

import { MENUS, ALL_CATEGORY } from '../data/menuData';

// 조건에 맞는 메뉴 목록을 반환해요
// criteria: { selectedCategory, preferSpicy, wantSoup, maxBudget, soloOnly, healthyOnly }
// excludeNames: 이미 먹은 메뉴 이름들 (최근 히스토리)
export function filterMenus(criteria, excludeNames = []) {
  const { selectedCategory, preferSpicy, wantSoup, maxBudget, soloOnly, healthyOnly } = criteria;
  const excludeSet = new Set(excludeNames);

  return MENUS.filter((menu) => {
    const categoryMatch = selectedCategory === ALL_CATEGORY || menu.category === selectedCategory;
    const spicyMatch = !preferSpicy || menu.spicy;
    const soupMatch = !wantSoup || menu.hotSoup;
    const budgetMatch = !maxBudget || menu.price <= maxBudget;
    const notRecentlyEaten = !excludeSet.has(menu.name);
    const soloMatch = !soloOnly || menu.soloFriendly;
    const healthyMatch = !healthyOnly || menu.healthy;
    return categoryMatch && spicyMatch && soupMatch && budgetMatch && notRecentlyEaten && soloMatch && healthyMatch;
  });
}

// 후보 목록에서 N개를 랜덤으로 뽑아요 (중복 없이)
export function pickMultiple(candidates, count = 1) {
  if (candidates.length === 0) return [];
  if (candidates.length <= count) return shuffle([...candidates]);

  const shuffled = shuffle([...candidates]);
  return shuffled.slice(0, count);
}

// Fisher-Yates 셔플 알고리즘 (배열을 골고루 섞어줘요)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
