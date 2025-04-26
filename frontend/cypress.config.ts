import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // หรือ URL ที่ต้องการ
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts', // หรือ *.cy.js หากไม่ใช้ TypeScript
    video: false, // จะเปิด/ปิดการบันทึกวิดีโอการทดสอบ
  },
});