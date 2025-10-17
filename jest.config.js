/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['js', 'json', 'node'],
  transform: {}, // бо у тебе чистий JS, без TS чи Babel

  setupFiles: ['dotenv/config'],

  // 👇 щоб Jest не кешував результати тестів між запусками
  clearMocks: true,

  // 👇 щоб не падало через великі таймаути при запитах до БД
  testTimeout: 20000,

  maxWorkers: 1,
};
