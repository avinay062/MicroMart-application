const createBaseConfig = require('../jest.config.base.cjs');

module.exports = createBaseConfig({
  displayName: 'shared-utils',
  rootDir: __dirname
});
