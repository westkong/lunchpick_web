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

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  phone: {
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
