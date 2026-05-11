// App.jsx: 어떤 화면을 보여줄지 결정하는 안내데스크예요

import { useState } from 'react';
import HomePage from './pages/HomePage';
import ConditionPage from './pages/ConditionPage';
import ResultPage from './pages/ResultPage';
import RoulettePage from './pages/RoulettePage';

export default function App() {
  const [page, setPage] = useState('home');
  const [resultData, setResultData] = useState(null);

  function handleResult(data) {
    setResultData(data);
    setPage('result');
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.phone}>
        {page === 'home' && (
          <HomePage
            onStart={() => setPage('condition')}
            onRoulette={() => setPage('roulette')}
          />
        )}
        {page === 'condition' && (
          <ConditionPage onResult={handleResult} onBack={() => setPage('home')} />
        )}
        {page === 'result' && resultData && (
          <ResultPage
            {...resultData}
            onBack={() => setPage('condition')}
            onHome={() => setPage('home')}
          />
        )}
        {page === 'roulette' && (
          <RoulettePage onHome={() => setPage('home')} />
        )}
      </div>
    </div>
  );
}

// 모바일(토스 미니앱)에서는 wrapper 없이 전체 화면 사용
// PC에서는 모바일 미리보기처럼 가운데 정렬 + 그림자
const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;

const styles = {
  wrapper: isMobile
    ? {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
      }
    : {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
      },
  phone: isMobile
    ? {
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }
    : {
        width: '390px',
        height: '844px',
        backgroundColor: 'white',
        borderRadius: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      },
};
