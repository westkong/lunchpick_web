// 추천 결과 화면이에요 - 메뉴 1개 추천 + 근처 음식점 표시

import { useState, useEffect } from 'react';
import { pickMultiple } from '../services/recommendationService';
import { addToHistory } from '../services/historyService';
import { getCurrentPosition, searchNearbyPlaces } from '../services/placeService';
import NavBar from '../components/NavBar';

export default function ResultPage({ criteria, candidates, picks: initialPicks, onBack, onHome }) {
  const [picks, setPicks] = useState(initialPicks);
  const [chosenName, setChosenName] = useState(null);
  const [nearbyPlace, setNearbyPlace] = useState(null);   // 근처 음식점 1개
  const [placeLoading, setPlaceLoading] = useState(false);
  const [placeError, setPlaceError] = useState(null);

  // 추천 결과가 바뀔 때마다 근처 음식점 자동 검색
  // (배포 후 플랫폼 등록 시 활성화)
  useEffect(() => {
    // if (picks.length > 0) {
    //   findNearbyPlace(picks[0].name);
    // }
  }, [picks]);

  async function findNearbyPlace(menuName) {
    setPlaceLoading(true);
    setPlaceError(null);
    setNearbyPlace(null);
    try {
      const location = await getCurrentPosition();
      const places = await searchNearbyPlaces(menuName, location);
      if (places.length > 0) {
        // 가까운 순 상위 5개 중 랜덤 1개
        const top = places.slice(0, 5);
        const pick = top[Math.floor(Math.random() * top.length)];
        setNearbyPlace(pick);
      } else {
        setPlaceError('근처에 관련 음식점을 못 찾았어요');
      }
    } catch (err) {
      setPlaceError(err.message || '위치 정보를 가져올 수 없어요');
    }
    setPlaceLoading(false);
  }

  function handleReroll() {
    const newPicks = pickMultiple(candidates, 1);
    setPicks(newPicks);
    setChosenName(null);
  }

  function handleChoose(menu) {
    addToHistory(menu.name);
    setChosenName(menu.name);
  }

  return (
    <div style={styles.container}>
      <NavBar title="먹픽" onBack={onBack} />

      {picks.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <p style={styles.subtitle}>
            {chosenName
              ? `'${chosenName}' 결정! 맛있게 드세요 🍽️`
              : '마음에 드는 메뉴를 골라보세요'}
          </p>

          <div style={styles.cardList}>
            {picks.map((menu) => (
              <MenuCard
                key={menu.name}
                menu={menu}
                isChosen={chosenName === menu.name}
                isDimmed={chosenName !== null && chosenName !== menu.name}
                onChoose={() => handleChoose(menu)}
              />
            ))}
          </div>

          {/* 근처 음식점 정보 */}
          <NearbyPlaceCard
            place={nearbyPlace}
            loading={placeLoading}
            error={placeError}
            menuName={picks[0]?.name}
            onRetry={() => findNearbyPlace(picks[0]?.name)}
          />

          <button
            style={{ ...styles.rerollButton, opacity: candidates.length > picks.length ? 1 : 0.4 }}
            onClick={handleReroll}
            disabled={candidates.length <= picks.length}
          >
            ↻ 다른 메뉴 보기
          </button>
        </>
      )}

      <CriteriaCard criteria={criteria} />

      <div style={styles.buttonGroup}>
        <button style={styles.filledButton} onClick={onBack}>
          조건 다시 선택
        </button>
        <button style={styles.outlinedButton} onClick={onHome}>
          홈으로 이동
        </button>
      </div>
    </div>
  );
}

// 메뉴 카드
function MenuCard({ menu, isChosen, isDimmed, onChoose }) {
  return (
    <div
      style={{
        ...styles.card,
        borderColor: isChosen ? '#FF6A00' : '#e5e5e5',
        backgroundColor: isChosen ? '#FFF5EB' : 'white',
        opacity: isDimmed ? 0.4 : 1,
      }}
    >
      <div style={styles.cardLeft}>
        <p style={styles.cardName}>{menu.name}</p>
        <p style={styles.cardMeta}>
          {menu.category} · {menu.price.toLocaleString()}원
          {menu.spicy && ' · 🌶️'}
          {menu.hotSoup && ' · 🍲'}
        </p>
      </div>
      <button
        style={{
          ...styles.chooseButton,
          backgroundColor: isChosen ? '#FF6A00' : 'white',
          color: isChosen ? 'white' : '#FF6A00',
        }}
        onClick={onChoose}
        disabled={isDimmed}
      >
        {isChosen ? '✓ 선택' : '이거!'}
      </button>
    </div>
  );
}

// 근처 음식점 카드
function NearbyPlaceCard({ place, loading, error, menuName, onRetry }) {
  if (loading) {
    return (
      <div style={styles.placeCard}>
        <p style={styles.placeTitle}>📍 근처 음식점 찾는 중...</p>
        <p style={styles.placeLoading}>위치 정보를 가져오고 있어요</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.placeCard}>
        <p style={styles.placeTitle}>📍 근처 음식점</p>
        <p style={styles.placeError}>{error}</p>
        <button style={styles.retryBtn} onClick={onRetry}>다시 검색</button>
      </div>
    );
  }

  if (!place) return null;

  return (
    <div style={styles.placeCard}>
      <p style={styles.placeTitle}>📍 근처 추천 음식점</p>
      <div style={styles.placeInfo}>
        <p style={styles.placeName}>{place.name}</p>
        <p style={styles.placeAddress}>{place.address}</p>
        <div style={styles.placeRow}>
          {place.distance && <span style={styles.placeBadge}>🚶 {place.distance}</span>}
          {place.phone && <span style={styles.placePhone}>📞 {place.phone}</span>}
        </div>
        {place.url && (
          <button
            style={styles.placeLink}
            onClick={() => window.open(place.url, '_blank')}
          >
            🗺️ 카카오맵에서 보기
          </button>
        )}
      </div>
    </div>
  );
}

// 추천 가능한 메뉴가 없을 때
function EmptyState() {
  return (
    <div style={styles.emptyState}>
      <p style={styles.emptyTitle}>추천 가능한 메뉴가 없어요</p>
      <p style={styles.emptyHint}>
        조건을 완화하거나, "최근 먹은 메뉴 제외"를 꺼보세요
      </p>
    </div>
  );
}

// 선택한 조건 표시
function CriteriaCard({ criteria }) {
  const budgetText = criteria.maxBudget
    ? `${criteria.maxBudget.toLocaleString()}원 이하`
    : '상관없음';

  return (
    <div style={styles.criteriaCard}>
      <p style={styles.criteriaTitle}>선택한 조건</p>
      <p style={styles.criteriaRow}>카테고리: {criteria.selectedCategory}</p>
      <p style={styles.criteriaRow}>예산: {budgetText}</p>
      <p style={styles.criteriaRow}>매운 음식: {criteria.preferSpicy ? '예' : '상관없음'}</p>
      <p style={styles.criteriaRow}>국물: {criteria.wantSoup ? '예' : '상관없음'}</p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    gap: '14px',
    height: '100%',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  heading: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 'bold',
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#666',
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    border: '2px solid #e5e5e5',
    borderRadius: '14px',
    transition: 'all 0.2s',
  },
  cardLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
    minWidth: 0,
  },
  cardName: {
    margin: 0,
    fontSize: '17px',
    fontWeight: 'bold',
  },
  cardMeta: {
    margin: 0,
    fontSize: '13px',
    color: '#777',
  },
  chooseButton: {
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 'bold',
    borderRadius: '10px',
    border: '2px solid #FF6A00',
    cursor: 'pointer',
    minWidth: '70px',
  },
  // 근처 음식점 카드
  placeCard: {
    backgroundColor: '#F0F7FF',
    border: '1.5px solid #B3D4FF',
    borderRadius: '14px',
    padding: '16px',
  },
  placeTitle: {
    margin: '0 0 8px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#336',
  },
  placeLoading: {
    margin: 0,
    fontSize: '13px',
    color: '#888',
  },
  placeError: {
    margin: '0 0 8px',
    fontSize: '13px',
    color: '#999',
  },
  retryBtn: {
    padding: '6px 14px',
    fontSize: '12px',
    backgroundColor: 'white',
    border: '1px solid #B3D4FF',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#336',
  },
  placeInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  placeName: {
    margin: 0,
    fontSize: '17px',
    fontWeight: 'bold',
    color: '#222',
  },
  placeAddress: {
    margin: 0,
    fontSize: '13px',
    color: '#666',
  },
  placeRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginTop: '4px',
  },
  placeBadge: {
    fontSize: '13px',
    color: '#FF6A00',
    fontWeight: '600',
  },
  placePhone: {
    fontSize: '13px',
    color: '#666',
  },
  placeLink: {
    marginTop: '8px',
    padding: '10px',
    fontSize: '14px',
    backgroundColor: '#FF6A00',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rerollButton: {
    background: 'white',
    border: '1px dashed #FF6A00',
    color: '#FF6A00',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '12px',
    borderRadius: '10px',
    fontWeight: '600',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#666',
  },
  emptyHint: {
    margin: '8px 0 0',
    fontSize: '13px',
    color: '#999',
  },
  criteriaCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: '12px',
    padding: '14px 16px',
  },
  criteriaTitle: {
    margin: '0 0 8px',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  criteriaRow: {
    margin: '2px 0',
    fontSize: '13px',
    color: '#555',
  },
  buttonGroup: {
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  filledButton: {
    padding: '14px',
    fontSize: '15px',
    backgroundColor: '#FF6A00',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  outlinedButton: {
    padding: '14px',
    fontSize: '15px',
    backgroundColor: 'white',
    color: '#FF6A00',
    border: '2px solid #FF6A00',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
