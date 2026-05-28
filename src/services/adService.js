// 토스 인앱 전면 광고 서비스
import { loadFullScreenAd, showFullScreenAd } from '@apps-in-toss/web-framework';

const AD_GROUP_ID = 'ait.v2.live.36f3431d4ada4188';

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
