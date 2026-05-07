// 내 위치 기반으로 근처 음식점을 찾아주는 서비스예요
// 브라우저의 Geolocation API로 현재 위치를 가져오고,
// 카카오 Places API로 근처 음식점을 검색해요

// 카카오맵 SDK 로드 (한 번만 실행)
let sdkLoaded = false;
function loadKakaoSDK() {
  return new Promise((resolve) => {
    if (sdkLoaded) { resolve(); return; }
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => { sdkLoaded = true; resolve(); });
    } else {
      // SDK가 아직 로드 안 됐으면 잠깐 기다림
      setTimeout(() => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => { sdkLoaded = true; resolve(); });
        } else {
          resolve(); // 실패해도 진행
        }
      }, 1000);
    }
  });
}

// 현재 위치 가져오기 (브라우저 Geolocation API)
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('위치 서비스를 지원하지 않는 브라우저예요'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(new Error('위치를 가져올 수 없어요. 위치 권한을 허용해주세요.')),
      { enableHighAccuracy: false, timeout: 10000 }
    );
  });
}

// 메뉴명에서 핵심 키워드 추출 (예: "순두부찌개" -> "순두부")
function simplifyKeyword(keyword) {
  const suffixes = ['찌개', '볶음', '구이', '튀김', '조림', '무침', '비빔', '볶이', '탕', '국밥', '국수', '라면'];
  for (const suffix of suffixes) {
    if (keyword.endsWith(suffix) && keyword.length > suffix.length + 1) {
      return keyword.slice(0, -suffix.length);
    }
  }
  return null;
}

// 단일 키워드로 검색
function searchOnce(keyword, location, radius) {
  return new Promise((resolve) => {
    const ps = new window.kakao.maps.services.Places();
    const coords = new window.kakao.maps.LatLng(location.lat, location.lng);

    ps.keywordSearch(
      keyword,
      (data, status) => {
        console.log(`[Places] "${keyword}" radius=${radius}m → status=${status}, count=${data?.length || 0}`);
        if (status !== window.kakao.maps.services.Status.OK) {
          resolve([]);
          return;
        }
        const places = data.map((p) => ({
          name: p.place_name,
          address: p.road_address_name || p.address_name,
          distance: p.distance ? `${p.distance}m` : '',
          phone: p.phone || '',
          url: p.place_url || '',
          category: p.category_name || '',
        }));
        resolve(places);
      },
      {
        location: coords,
        radius,
        sort: window.kakao.maps.services.SortBy.DISTANCE,
        size: 15,
      }
    );
  });
}

// 카테고리(음식점)로 근처 검색
function categorySearch(location, radius) {
  return new Promise((resolve) => {
    const ps = new window.kakao.maps.services.Places();
    const coords = new window.kakao.maps.LatLng(location.lat, location.lng);

    ps.categorySearch(
      'FD6',
      (data, status) => {
        console.log(`[Places] FD6 category radius=${radius}m → status=${status}, count=${data?.length || 0}`);
        if (status !== window.kakao.maps.services.Status.OK) {
          resolve([]);
          return;
        }
        const places = data.map((p) => ({
          name: p.place_name,
          address: p.road_address_name || p.address_name,
          distance: p.distance ? `${p.distance}m` : '',
          phone: p.phone || '',
          url: p.place_url || '',
          category: p.category_name || '',
        }));
        resolve(places);
      },
      {
        location: coords,
        radius,
        sort: window.kakao.maps.services.SortBy.DISTANCE,
        size: 15,
        useMapBounds: false,
      }
    );
  });
}

// 카카오 Places API로 근처 음식점 검색 (여러 전략 시도)
export async function searchNearbyPlaces(keyword, location) {
  await loadKakaoSDK();

  if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
    return [];
  }

  // 전략 1: 원래 키워드 그대로 (반경 3km)
  let results = await searchOnce(keyword, location, 3000);
  if (results.length > 0) return results;

  // 전략 2: 줄인 키워드 (예: 순두부찌개 -> 순두부) (반경 3km)
  const simpler = simplifyKeyword(keyword);
  if (simpler) {
    results = await searchOnce(simpler, location, 3000);
    if (results.length > 0) return results;
  }

  // 전략 3: 원래 키워드 더 넓게 (반경 5km)
  results = await searchOnce(keyword, location, 5000);
  if (results.length > 0) return results;

  // 전략 4: 줄인 키워드 더 넓게
  if (simpler) {
    results = await searchOnce(simpler, location, 5000);
    if (results.length > 0) return results;
  }

  // 전략 5: 카테고리 검색 (그냥 음식점)
  results = await categorySearch(location, 3000);
  if (results.length > 0) return results;

  return [];
}

// 근처 음식점 중 랜덤 1개 뽑기
export async function getRandomNearbyPlace(menuName, location) {
  const places = await searchNearbyPlaces(menuName, location);
  if (places.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * Math.min(places.length, 5));
  return places[randomIndex];
}
