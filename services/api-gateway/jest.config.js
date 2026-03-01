const createBaseConfig = require('../../jest.config.base.cjs');

module.exports = createBaseConfig({
  displayName: 'api-gateway',
  rootDir: __dirname,
  coverageFrom: ['src/**/*.js', 'plugins/**/*.js']
});
