// 토스 인앱 광고 서비스 (전면 광고 + 리워드 광고)
import { loadFullScreenAd, showFullScreenAd } from '@apps-in-toss/web-framework';

const AD_GROUP_ID = 'ait.v2.live.36f3431d4ada4188'; // 전면 광고
const REWARD_AD_GROUP_ID = 'ait.v2.live.13d55c1c90e343c8'; // 리워드 광고 (뽑기권)

// 광고 미리 로드 (결과 화면 진입 시 호출)
export function preloadAd() {
  if (!loadFullScreenAd.isSupported()) return;

  loadFullScreenAd({
    options: { adGroupId: AD_GROUP_ID },
    onEvent: (event) => {
      if (event.type === 'loaded') {
        console.log('[Ad] 광고 로드 완료');
      }
    },
    onError: (err) => {
      console.warn('[Ad] 광고 로드 실패', err);
    },
  });
}

// 광고 노출 후 콜백 실행 ("이거!" 버튼 클릭 시 호출)
export function showAd(onDone) {
  if (!showFullScreenAd.isSupported()) {
    onDone?.();
    return;
  }

  showFullScreenAd({
    options: { adGroupId: AD_GROUP_ID },
    onEvent: (event) => {
      // 광고 닫힘 or 노출 실패 → 다음 단계 진행
      if (event.type === 'dismissed' || event.type === 'failedToShow') {
        onDone?.();
      }
    },
    onError: (err) => {
      console.warn('[Ad] 광고 노출 실패', err);
      onDone?.(); // 광고 실패해도 앱은 정상 동작
    },
  });
}

// 리워드 광고 미리 로드 (뽑기 횟수가 떨어져갈 때 호출)
export function preloadRewardAd() {
  try {
    if (!loadFullScreenAd.isSupported()) return;
    loadFullScreenAd({
      options: { adGroupId: REWARD_AD_GROUP_ID },
      onEvent: () => {},
      onError: (err) => {
        console.warn('[RewardAd] 광고 로드 실패', err);
      },
    });
  } catch {
    // 토스 밖 환경 - 무시
  }
}

// 리워드 광고 노출 - 끝까지 보면 onReward 호출 (뽑기권 지급)
// 광고를 못 띄우는 환경(브라우저 등)이나 로드 실패 시에는
// 사용자를 막지 않기 위해 그냥 보상을 줘요 (fail-open)
export function showRewardAd({ onReward, onClose }) {
  let rewarded = false;

  try {
    if (!showFullScreenAd.isSupported()) {
      onReward?.();
      return;
    }

    showFullScreenAd({
      options: { adGroupId: REWARD_AD_GROUP_ID },
      onEvent: (event) => {
        if (event.type === 'userEarnedReward') {
          rewarded = true;
          onReward?.();
        }
        if (event.type === 'dismissed') {
          onClose?.(rewarded);
        }
        if (event.type === 'failedToShow') {
          // 광고가 안 떠도 뽑기는 하게 해줘요
          onReward?.();
          onClose?.(true);
        }
      },
      onError: (err) => {
        console.warn('[RewardAd] 광고 노출 실패', err);
        onReward?.();
        onClose?.(true);
      },
    });
  } catch {
    onReward?.();
    onClose?.(true);
  }
}
