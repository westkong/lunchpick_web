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

// 카카오 Places API로 근처 음식점 검색
// keyword: 검색어 (예: "김치찌개", "라멘")
// location: { lat, lng } 현재 위치
// 반환: [{ name, address, distance, phone, url, category }]
export async function searchNearbyPlaces(keyword, location) {
  await loadKakaoSDK();

  return new Promise((resolve) => {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      resolve([]);
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    const coords = new window.kakao.maps.LatLng(location.lat, location.lng);

    ps.keywordSearch(
      keyword,
      (data, status) => {
        if (status !== window.kakao.maps.services.Status.OK) {
          resolve([]);
          return;
        }
        // 결과를 정리해서 반환
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
        radius: 2000, // 반경 2km
        sort: window.kakao.maps.services.SortBy.DISTANCE, // 가까운 순
        size: 15, // 최대 15개
        category_group_code: 'FD6', // FD6 = 음식점
      }
    );
  });
}

// 근처 음식점 중 랜덤 1개 뽑기
export async function getRandomNearbyPlace(menuName, location) {
  const places = await searchNearbyPlaces(menuName, location);
  if (places.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * Math.min(places.length, 5));
  return places[randomIndex];
}
