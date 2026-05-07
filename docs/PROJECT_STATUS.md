# 먹픽 프로젝트 현황 (2026-05-08 기준)

## 📱 앱 정보
- **이름**: 먹픽 (Meokpick)
- **영문 appName**: meokpick
- **회사**: 서빈스튜디오
- **사업자번호**: [발급 대기 중]
- **카테고리**: 생활 > 음식·음료 > 음식·음료
- **검색 키워드**: 점심추천, 음식추천, 뭐먹을까, 메뉴추천, 점심
- **사용 연령**: 만 19세 이상 (토스 강제)
- **고객 문의**: lee1211ht@gmail.com

---

## 🛠 기술 스택
- Vite + React (CSR)
- localStorage (24시간 히스토리)

---

## 🌐 인프라
- **GitHub**: westkong/lunchpick_web (Private)
- **Vercel**: https://lunchpickweb.vercel.app (Hobby)
- **카카오 개발자 콘솔**: 등록만 해두고 미사용 (v2용)

---

## ✅ 완료된 작업
1. 메뉴 추천 (1개 결과)
   - 카테고리, 예산 슬라이더, 매운 음식, 국물, 혼밥, 건강식, 최근 메뉴 제외
2. 룰렛 (직접 입력 → 슬로잉 애니메이션)
3. 히스토리 (최근 먹은 메뉴 칩, 24시간)
4. 토스 체크리스트 준수
   - NavBar (토스 스타일)
   - 줌/스케일 비활성화
   - 커스텀 Modal (alert/confirm 대체)
5. GitHub Private 저장소
6. Vercel 배포
7. 디자인 자산 (썸네일 1932×828, 로고 600×600)
8. 앱 정보 등록 (토스 콘솔)
9. 검토 요청 제출 (5/8)

---

## ⏳ 진행 중 / 대기
- **토스 검토** (영업일 2일, 5/12~13 결과 예상)
- **사업자 등록** (홈택스 신청 후 발급 대기)

---

## 🚧 사업자 발급 후 할 일
1. 토스 콘솔에서 약관 등록
2. 정산 정보 등록
3. 검토 통과되어 있다면 즉시 출시 가능

---

## 📝 약관 (사업자 번호만 채우면 등록 가능)
- `docs/PRIVACY_POLICY.md` - 개인정보처리방침
- `docs/TERMS_OF_SERVICE.md` - 서비스 이용약관

**채워야 할 항목 (3곳, 약관 각각):**
- 사업자등록번호
- 대표자
- 주소

---

## 🚫 안 쓰는 기능 (먹픽에 불필요)
- 토스 로그인 (회원 가입/로그인 없음)
- mTLS 인증서 (서버 통신 없음)
- 토스페이 (결제 없음)
- 푸시 알림 (출시 후 검토)

---

## 🔮 v2 계획
- 근처 음식점 검색 (카카오맵 도메인 등록 재도전)
- 음식 사진
- 메뉴 즐겨찾기
- 그룹 모드 (친구들이랑 같이 결정)
- 인앱 광고 (수익화, 사용자 1000명+ 권장)

---

## 🚨 잠재 반려 사유 대비 (이미 모두 해결됨)
1. ~~위치 권한 요청 후 위치 기능 없음~~ → 위치 기능 자체 제거
2. ~~브라우저 alert/confirm 사용~~ → 커스텀 Modal 적용
3. ~~줌 활성화~~ → maximum-scale=1.0 적용
4. ~~NavBar 누락~~ → NavBar 컴포넌트 추가

---

## 📂 주요 파일
```
src/
├── App.jsx                    # 페이지 라우팅
├── pages/
│   ├── HomePage.jsx          # 홈 (추천 시작 / 룰렛 / 히스토리)
│   ├── ConditionPage.jsx     # 조건 선택
│   ├── ResultPage.jsx        # 추천 결과 (1개)
│   └── RoulettePage.jsx      # 룰렛
├── components/
│   ├── NavBar.jsx            # 토스 스타일 네비
│   └── Modal.jsx             # 커스텀 모달
├── data/menuData.js          # 136개 메뉴 데이터
└── services/
    ├── recommendationService.js  # 필터링 + 랜덤 선택
    └── historyService.js         # localStorage 히스토리

design/
├── thumbnail.html            # 썸네일 1932x828
├── thumbnail_1932x828.png    # 캡처본
└── logo.html                 # 로고

docs/
├── PROJECT_STATUS.md         # (이 파일) 프로젝트 현황
├── PRIVACY_POLICY.md         # 개인정보처리방침
└── TERMS_OF_SERVICE.md       # 서비스 이용약관
```
