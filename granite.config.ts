import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'meokpick', // 토스 콘솔에 등록한 영문 앱 이름
  brand: {
    displayName: '먹픽', // 토스 콘솔에 등록한 한글 이름
    primaryColor: '#FF6A00', // 먹픽 주황색
    icon: 'https://lunchpickweb.vercel.app/favicon.svg',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite dev',
      build: 'vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
});
