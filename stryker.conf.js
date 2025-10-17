// stryker.conf.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const jestConfig = require('./jest.config.js');

export default {
  mutate: ['controllers/**/*.js', 'services/**/*.js', 'models/**/*.js'],
  mutator: 'javascript',
  packageManager: 'npm',
  reporters: ['clear-text', 'progress', 'html'],
  testRunner: 'jest',
  jest: {
    projectType: 'custom',
    config: jestConfig,
  },
  coverageAnalysis: 'off',
};
