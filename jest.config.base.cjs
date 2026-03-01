const path = require('path');

function createBaseConfig({
  displayName,
  rootDir,
  testEnvironment = 'node',
  setupFilesAfterEnv = [],
  coverageFrom = ['src/**/*.{js,jsx}', '!src/**/index.js']
} = {}) {
  if (!rootDir) {
    throw new Error('createBaseConfig requires a rootDir option');
  }

  return {
    displayName,
    rootDir,
    testEnvironment,
    clearMocks: true,
    setupFilesAfterEnv,
    transform: {
      '^.+\\.(js|jsx)$': [
        'babel-jest',
        { configFile: path.join(__dirname, 'babel.config.cjs') }
      ]
    },
    moduleFileExtensions: ['js', 'jsx', 'json'],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '\\.(jpg|jpeg|png|gif|svg|webp|mp4)$': path.join(
        __dirname,
        'test',
        '__mocks__',
        'fileMock.js'
      )
    },
    coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
    collectCoverageFrom: coverageFrom,
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)']
  };
}

module.exports = createBaseConfig;
