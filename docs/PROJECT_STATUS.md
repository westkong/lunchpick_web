# 먹픽 프로젝트 현황 (2026-06-11 기준)

## 📱 앱 정보
- **이름**: 먹픽 (Meokpick)
- **영문 appName**: meokpick
- **회사**: 서빈스튜디오
- **사업자번호**: 579-40-01651 (대표자: 이서빈)
- **카테고리**: 생활 > 음식·음료 > 음식·음료
- **검색 키워드**: 점심추천, 음식추천, 뭐먹을까, 메뉴추천, 점심
- **사용 연령**: 만 19세 이상 (토스 강제)
- **고객 문의**: lee1211ht@gmail.com
- **상태**: ✅ 출시됨 (토스 앱인토스)

---

## 🛠 기술 스택
- Vite + React (CSR)
- @apps-in-toss/web-framework 2.5.0 (.ait 번들)
- localStorage (히스토리 / 도감 / 뽑기 제한 / 내기 이름)

---

## 🌐 인프라
- **GitHub**: westkong/lunchpick_web (Private)
- **Vercel**: https://lunchpickweb.vercel.app (Hobby)
- **약관**: /terms.html, /privacy.html (Vercel 호스팅)

---

## ✅ 버전 히스토리
- **v1.0** (5월): 조건별 추천 + 룰렛 + 히스토리 → 출시
- **v1.1**: 인형뽑기(메인 기능化), 메뉴 250개+, 화면 비율 수정, 공유
- **v1.1.1**: 가챠 캡슐 디자인 (이모지 이질감 해결)
- **v1.3** (6/11 검토 요청): 
  - 📚 캡슐 도감 (수집 + 금색 캡슐 5%)
  - 🎲 내기 뽑기 (커피/점심값 내기, 단톡방 공유용)
  - 🎬 리워드 광고 (무료 뽑기 5회/일 + 광고 시청 +3회)
  - ⭐ 토스 리뷰 요청 (금색 캡슐 or 3회째 뽑기 성공 시 1회)
  - 🐛 브라우저에서 홈 화면 죽는 버그 수정 (알림 동의 코드)

---

## 💰 수익화 현황
| 항목 | 상태 | 비고 |
|------|------|------|
| 정산 정보 | 검토 중 (지연 중, 문의 필요) | 승인돼야 광고 수익 정산 |
| 전면 광고 | 코드 적용 완료 | `ait.v2.live.36f3431d4ada4188` / 추천 "이거!" 선택 시 |
| 리워드 광고 | 코드 적용 완료 | `ait.v2.live.13d55c1c90e343c8` / 뽑기권 +3회 |
| 스마트 발송 (기능성) | 캠페인 검토 중 | 매일 11시 푸시 / 무료 / 발송코드 LUNCH_FUNC_01 |
| 알림동의문 | 등록 완료 | templateCode 확인 후 HomePage.jsx 교체 필요 ⚠️ |

### ⚠️ 남은 코드 작업
- `HomePage.jsx`의 `NOTIFICATION_TEMPLATE_CODE = 'REPLACE_WITH_TEMPLATE_CODE'`
  → 스마트 발송 승인 후 콘솔에서 실제 templateCode 확인해서 교체 + 재배포

### 🔮 보류된 수익화 아이디어 (사용자 결정)
- **프로모션 포인트**: 금색 캡슐 뽑으면 토스포인트 지급
  → 포인트는 파트너(우리) 예산에서 나가므로 **광고 수익이 안정적으로 나온 후**
    수익의 10~20%를 포인트 예산으로 돌리는 방식으로 진행하기로 함 (역마진 방지)

---

## ⏳ 대기 중
1. **v1.3 검토** (토스, 영업일 2일)
2. **정산 정보 승인** (며칠째 지연 → 콘솔 문의하기 권장)
3. **스마트 발송 캠페인 검수** (영업일 2~3일)
4. 광고성 스마트 발송 캠페인은 **꺼짐 유지** (건당 9.9원 — DAU 300+ 되면 검토)

---

## 📊 핵심 지표 (개선 목표)
- 문제: 리텐션 낮음 (Day1 8%, Day5 0%)
- 전략: 도구 → 재미 의식(ritual)으로 전환
  - 인형뽑기 + 도감 수집 루프 + 매일 11시 푸시 = 재방문 동기
  - 내기 뽑기 = 단톡방 바이럴 유입

---

## 📂 주요 파일
```
src/
├── App.jsx                    # 페이지 라우팅 (home/condition/result/roulette/claw/collection/bet)
├── pages/
│   ├── HomePage.jsx          # 홈 (⚠️ templateCode 교체 필요)
│   ├── ConditionPage.jsx     # 조건 선택
│   ├── ResultPage.jsx        # 추천 결과 (전면 광고)
│   ├── RoulettePage.jsx      # 룰렛
│   ├── ClawMachinePage.jsx   # 인형뽑기 (도감 등록 + 뽑기 제한 + 리워드 광고)
│   ├── CollectionPage.jsx    # 캡슐 도감
│   └── BetPage.jsx           # 내기 뽑기
├── components/
│   ├── NavBar.jsx / Modal.jsx
│   └── Capsule.jsx           # 공용 가챠 캡슐 (금색/미수집 지원)
├── data/menuData.js          # 241개 메뉴 + 이모지 규칙
└── services/
    ├── recommendationService.js
    ├── historyService.js
    ├── collectionService.js   # 도감 수집
    ├── pullLimitService.js    # 하루 뽑기 제한
    ├── adService.js           # 전면 + 리워드 광고
    ├── reviewService.js       # 토스 리뷰 요청
    └── shareService.js        # 공유
```

---

## 🔮 다음 후보 (우선순위 순)
1. 햅틱 피드백 (`generateHapticFeedback`) — 뽑기 손맛
2. 점심 기록/통계 (내가 뭘 자주 먹었나)
3. 근처 음식점 (카카오맵 재도전)
4. 프로모션 포인트 (수익 안정화 후)
