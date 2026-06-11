// 에타 홍보용 스크린샷 캡처 스크립트 (모바일 화면 390x844 @2x)
// 실행: node design/capture_promo.mjs
import puppeteer from 'puppeteer';
import fs from 'fs';

const URL = 'http://localhost:5173';
const OUT = 'C:/src/lunchpick_web/design/promo';
fs.mkdirSync(OUT, { recursive: true });

// 도감을 미리 채워서 예쁘게 보이게 (실제 메뉴 이름)
const COLLECTED = [
  '김치찌개','된장찌개','순두부찌개','부대찌개','비빔밥','돌솥비빔밥','제육볶음','불고기덮밥',
  '삼계탕','냉면','비빔냉면','갈비탕','설렁탕','곰탕','감자탕','해장국','뼈해장국','콩나물국밥',
  '순대국밥','돼지국밥','육개장','보쌈','족발','닭갈비','찜닭','칼국수','바지락칼국수','잔치국수',
  '쌈밥정식','회덮밥','낙지볶음','쭈꾸미볶음','소불고기','제육쌈밥','한정식','돈코츠라멘','쇼유라멘',
  '미소라멘','꿔바로우','오징어볶음','추어탕','생선구이정식',
];

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

async function clickByText(txt) {
  await page.evaluate((t) => {
    const b = [...document.querySelectorAll('button')].find((x) => x.textContent.includes(t));
    if (b) b.click();
  }, txt);
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const shot = (name) => page.screenshot({ path: `${OUT}/${name}.png` });

// localStorage 세팅
await page.goto(URL, { waitUntil: 'networkidle0' });
await page.evaluate((names) => {
  const col = {};
  names.forEach((n, i) => {
    col[n] = { firstAt: Date.now() - i * 3600000, count: 1 + (i % 3), rare: i % 11 === 0 };
  });
  localStorage.setItem('meokpick_collection', JSON.stringify(col));
  localStorage.setItem('meokpick_bet_names', JSON.stringify(['서빈', '민지', '준호', '하늘', '지우']));
  localStorage.setItem('meokpick_review_asked', '1');
  localStorage.removeItem('meokpick_pulls');
  localStorage.removeItem('lunchpick_history');
}, COLLECTED);
await page.reload({ waitUntil: 'networkidle0' });
await wait(600);

// 1. 홈
await shot('01_home');

// 2. 인형뽑기 (대기 화면)
await clickByText('인형뽑기');
await wait(900);
await shot('02_claw');

// 3. 뽑기 결과 (캡슐 오픈)
await clickByText('뽑기!');
await wait(12000);
await shot('03_claw_result');

// 4. 캡슐 도감
await clickByText('도감 보기');
await wait(900);
await shot('04_collection');

// 5. 내기 뽑기 결과 (홈으로 → 내기)
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')];
  if (b[0]) b[0].click(); // NavBar 뒤로가기
});
await wait(600);
await clickByText('커피 누가 사');
await wait(600);
await clickByText('운명의 뽑기');
await wait(9000);
await shot('05_bet_result');

await browser.close();
console.log('완료: design/promo/01~05 캡처됨');
