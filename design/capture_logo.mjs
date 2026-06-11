// 로고 HTML을 600x600 PNG로 캡처하는 스크립트
// 실행: node design/capture_logo.mjs
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 600, height: 600 });
await page.goto('file:///C:/src/lunchpick_web/design/logo_square.html');
await page.screenshot({ path: 'C:/src/lunchpick_web/design/logo_square_600.png' });
await browser.close();
console.log('완료: design/logo_square_600.png');
