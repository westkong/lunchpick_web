// App.jsx: 어떤 화면을 보여줄지 결정하는 안내데스크예요

import { useState } from 'react';
import HomePage from './pages/HomePage';
import ConditionPage from './pages/ConditionPage';
import ResultPage from './pages/ResultPage';
import RoulettePage from './pages/RoulettePage';
import ClawMachinePage from './pages/ClawMachinePage';

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
            onClaw={() => setPage('claw')}
          />
        )}
        {page === 'claw' && (
          <ClawMachinePage onHome={() => setPage('home')} />
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
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  phone: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
};
