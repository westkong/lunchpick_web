// 토스 스타일 모달이에요
// 브라우저 기본 confirm() 대신 이걸 써요

export default function Modal({ message, onConfirm, onCancel }) {
  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <p style={styles.message}>{message}</p>
        <div style={styles.buttons}>
          <button style={styles.cancelBtn} onClick={onCancel}>취소</button>
          <button style={styles.confirmBtn} onClick={onConfirm}>확인</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '28px 24px 20px',
    width: '100%',
    maxWidth: '320px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
  },
  message: {
    margin: '0 0 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#111',
    lineHeight: '1.5',
    textAlign: 'center',
  },
  buttons: {
    display: 'flex',
    gap: '8px',
  },
  cancelBtn: {
    flex: 1,
    padding: '14px',
    fontSize: '15px',
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    color: '#555',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
  },
  confirmBtn: {
    flex: 1,
    padding: '14px',
    fontSize: '15px',
    fontWeight: 'bold',
    backgroundColor: '#FF6A00',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
  },
};
