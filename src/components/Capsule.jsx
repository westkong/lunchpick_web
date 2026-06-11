// 가챠 캡슐 컴포넌트 - 인형뽑기와 도감에서 같이 써요
// 위는 투명 플라스틱, 아래는 컬러, 안에 음식 이모지가 살짝 보여요
// rare: 금색 캡슐 (희귀!), locked: 아직 못 뽑은 캡슐 (도감용 실루엣)

export const CAPSULE_COLORS = [
  '#FF6A00', '#FF3B7B', '#4A90E2', '#7B61FF',
  '#21C17A', '#FFB300', '#FF7043', '#26C6DA',
];

export const GOLD_GRADIENT = 'linear-gradient(150deg, #FFE259 0%, #FFA751 100%)';

// 음식 이름으로 캡슐 색을 항상 같게 정해줘요
export function colorForName(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return CAPSULE_COLORS[h % CAPSULE_COLORS.length];
}

export default function Capsule({ emoji, color, size = 44, opened = false, rare = false, locked = false }) {
  const half = size / 2;
  const bottomBg = locked ? '#d6d6d6' : rare ? GOLD_GRADIENT : color;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'visible',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: rare
            ? '0 2px 10px rgba(255,167,81,0.55), inset 0 -3px 6px rgba(0,0,0,0.12)'
            : '0 2px 6px rgba(0,0,0,0.18), inset 0 -3px 6px rgba(0,0,0,0.12)',
        }}
      >
        {/* 아래쪽 컬러 반구 */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: opened ? 0 : half,
          background: bottomBg,
          transition: 'height 0.3s ease',
        }} />
        {/* 위쪽 투명 반구 (플라스틱 느낌) */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: opened ? size : half,
          background: 'linear-gradient(160deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.35) 60%, rgba(255,255,255,0.15) 100%)',
          transition: 'height 0.3s ease',
        }} />
        {/* 가운데 띠 (캡슐 이음새) */}
        {!opened && (
          <div style={{
            position: 'absolute', top: half - 2, left: 0, right: 0,
            height: 4, background: 'rgba(0,0,0,0.15)',
          }} />
        )}
        {/* 음식 이모지 (미수집이면 물음표) */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size * 0.5,
          opacity: locked ? 0.45 : 1,
          filter: locked ? 'grayscale(1)' : 'none',
        }}>
          {locked ? '❓' : emoji}
        </div>
        {/* 하이라이트 점 */}
        <div style={{
          position: 'absolute', top: size * 0.16, left: size * 0.2,
          width: size * 0.18, height: size * 0.18,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.7)',
        }} />
      </div>
      {/* 금색 캡슐 반짝이 */}
      {rare && !locked && (
        <div style={{
          position: 'absolute', top: -size * 0.12, right: -size * 0.1,
          fontSize: size * 0.38, lineHeight: 1,
        }}>
          ✨
        </div>
      )}
    </div>
  );
}
