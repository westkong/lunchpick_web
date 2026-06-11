// 토스 미니앱 리뷰 요청 - 기분 좋은 순간에 딱 한 번만 물어봐요
// 조건: 금색 캡슐을 뽑았거나, 3번째 뽑기 성공했을 때

import { requestReview } from '@apps-in-toss/web-framework';

const ASKED_KEY = 'meokpick_review_asked';
const PULL_COUNT_KEY = 'meokpick_pull_count';

export function maybeRequestReview({ rare = false } = {}) {
  try {
    // 이미 물어봤으면 다시 안 물어봐요
    if (localStorage.getItem(ASKED_KEY)) return;

    const count = (parseInt(localStorage.getItem(PULL_COUNT_KEY) || '0', 10) || 0) + 1;
    localStorage.setItem(PULL_COUNT_KEY, String(count));

    // 아직 기분 좋은 순간이 아니면 패스
    if (!rare && count < 3) return;

    // 토스 앱 밖이거나 미지원 버전이면 패스
    if (typeof requestReview.isSupported === 'function' && !requestReview.isSupported()) return;

    requestReview();
    localStorage.setItem(ASKED_KEY, '1');
  } catch {
    // 토스 밖 환경 - 조용히 넘어가요
  }
}
