// 홍보 표지 카드를 1080x1080 PNG로 캡처
// 실행: node design/capture_card.mjs
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1080 });
await page.goto('file:///C:/src/lunchpick_web/design/promo_card.html');
await page.screenshot({ path: 'C:/src/lunchpick_web/design/promo/00_cover.png' });
await browser.close();
console.log('완료: design/promo/00_cover.png');
