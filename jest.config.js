/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['js', 'json', 'node'],
  transform: {}, // без babel, якщо не використовуєш TS
  setupFiles: ['dotenv/config'],

  clearMocks: true,
  testTimeout: 20000,
  maxWorkers: 1,

  // Не додавай extensionsToTreatAsEsm — Jest сам розуміє .js файли з type:module
};
