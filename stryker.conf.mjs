export default {
  mutate: [
    'controllers/**/*.js',
    'services/**/*.js',
    'routes/**/*.js',
    '!**/*.test.js',
  ],

  testRunner: 'command',
  commandRunner: {
    command: 'npm test', // а npm test уже містить прапорець experimental-vm-modules
  },

  reporters: ['clear-text', 'progress', 'html'],
  coverageAnalysis: 'off',
};
