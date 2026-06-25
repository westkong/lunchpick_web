# 🍽 먹픽 (Meokpick)

> 점심 메뉴 추천 토스 미니앱
> A lunch-menu recommendation mini-app, shipped on App-in-Toss.

[토스에서 바로 사용하기](https://minion.toss.im/DZeV8ujq) — 앱 설치 없이 토스에서 실행됩니다.
---

## 📌 프로젝트 소개

"오늘 점심 뭐 먹지?"를 대신 정해주는 점심 메뉴 추천 미니앱입니다.
React + Vite로 개발해 앱인토스(App-in-Toss)에 직접 출시했고, 사업자등록까지 직접 처리했습니다.
기획부터 출시까지 단독으로 진행했습니다.

---

## 주요 기능

| 기능 | 설명 |

| 🎲 메뉴 추천 | 점심 메뉴를 뽑기 형식으로 추천해주는 핵심 기능 + 커피 내기 기능까지 |
| 📱 토스 미니앱 | App-in-Toss 프레임워크로 토스 안에서 실행 |
| 🚀 실제 출시 | 앱인토스 스토어에 배포된 운영 서비스 |


## 기술 스택

- Frontend: React 19, Vite
- 플랫폼: App-in-Toss (토스 미니앱)
- 배포: 앱인토스 스토어

---

## 🚀 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev

# 3. 프로덕션 빌드 / 미리보기
npm run build
npm run preview
```

---

## 📁 폴더 구조

```
lunchpick_web/
├── public/              # 정적 파일
├── src/                 # 프론트엔드 소스
├── design/              # 디자인 자료
├── docs/                # 문서
├── meokpick.ait         # 앱인토스 배포 번들
├── granite.config.ts    # 토스 미니앱(App-in-Toss) 설정
└── package.json
```

---

## 💡 개발 포인트

- 개인 프로젝트를 실제 스토어 출시까지 끝낸 경험 (기획 → 개발 → 배포 → 사업자등록)
- 앱인토스 플랫폼 제약 안에서 동작하는 미니앱 구조 설계

---

## 👤 만든 사람

이서빈 (westkong) · 가톨릭대학교 인공지능학과
GitHub: [@westkong](https://github.com/westkong)
