// 하루 뽑기 횟수 제한 - 무료 5회, 광고 보면 +3회
// 점심 정하는 데는 1~2회면 충분해서 실사용자는 제한을 거의 못 느껴요
// 도감을 모으고 싶은 사람이 자발적으로 광고를 보는 구조예요

const STORAGE_KEY = 'meokpick_pulls';

export const FREE_PULLS_PER_DAY = 5;
export const AD_REWARD_PULLS = 3;

function todayStr() {
  return new Date().toDateString();
}

function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    // 날짜가 바뀌면 리셋
    if (!raw || raw.date !== todayStr()) {
      return { date: todayStr(), used: 0, bonus: 0 };
    }
    return raw;
  } catch {
    return { date: todayStr(), used: 0, bonus: 0 };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// 오늘 남은 뽑기 횟수
export function getRemainingPulls() {
  const s = loadState();
  return Math.max(0, FREE_PULLS_PER_DAY + s.bonus - s.used);
}

// 뽑기 1회 사용
export function consumePull() {
  const s = loadState();
  s.used += 1;
  saveState(s);
  return getRemainingPulls();
}

// 광고 보상 - 뽑기권 추가
export function grantBonusPulls(count = AD_REWARD_PULLS) {
  const s = loadState();
  s.bonus += count;
  saveState(s);
  return getRemainingPulls();
}
