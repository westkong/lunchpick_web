// 토스 스타일 내비게이션 바예요
// 왼쪽: 뒤로가기, 가운데: 앱 이름, 오른쪽: 빈칸 (또는 버튼)

export default function NavBar({ title, onBack, onHome, rightButton }) {
  return (
    <div style={styles.navbar}>
      {/* 왼쪽: 뒤로가기 */}
      <button style={styles.leftBtn} onClick={onBack}>
        {onBack ? '‹' : ''}
      </button>

      {/* 가운데: 타이틀 */}
      <div style={styles.center}>
        <span style={styles.title}>{title}</span>
      </div>

      {/* 오른쪽: 커스텀 버튼 or 빈칸 */}
      <div style={styles.rightBtn}>
        {rightButton || null}
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '52px',
    padding: '0 8px',
    borderBottom: '1px solid #f0f0f0',
    backgroundColor: 'white',
    flexShrink: 0,
  },
  leftBtn: {
    width: '44px',
    height: '44px',
    background: 'none',
    border: 'none',
    fontSize: '28px',
    color: '#111',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
  center: {
    flex: 1,
    textAlign: 'center',
  },
  title: {
    fontSize: '17px',
    fontWeight: 'bold',
    color: '#111',
  },
  rightBtn: {
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
