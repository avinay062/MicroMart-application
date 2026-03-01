const path = require('path');
const createBaseConfig = require('../jest.config.base.cjs');

module.exports = createBaseConfig({
  displayName: 'client',
  rootDir: __dirname,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [path.join(__dirname, 'src', 'setupTests.js')],
  coverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js'
  ]
});
