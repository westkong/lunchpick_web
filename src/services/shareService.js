// 결과 공유 기능이에요
// 토스앱/모바일에서는 네이티브 공유 시트, 안 되면 클립보드 복사로 폴백해요

const APP_URL = 'https://lunchpickweb.vercel.app';

export async function shareResult({ title, text }) {
  const shareText = `${text}\n\n👉 먹픽에서 점심 정하기: ${APP_URL}`;

  // 1) 네이티브 공유 (모바일/토스앱)
  if (navigator.share) {
    try {
      await navigator.share({ title: title || '먹픽', text: shareText });
      return { ok: true, method: 'share' };
    } catch (err) {
      // 사용자가 취소한 경우는 조용히 종료
      if (err && err.name === 'AbortError') return { ok: false, method: 'cancel' };
    }
  }

  // 2) 클립보드 복사 폴백
  try {
    await navigator.clipboard.writeText(shareText);
    alert('결과가 복사됐어요! 친구에게 붙여넣기 해보세요 📋');
    return { ok: true, method: 'clipboard' };
  } catch {
    // 3) 최후 폴백
    alert(shareText);
    return { ok: true, method: 'alert' };
  }
}
