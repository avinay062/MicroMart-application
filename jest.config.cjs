module.exports = {
  projects: [
    '<rootDir>/client/jest.config.js',
    '<rootDir>/services/product-service/jest.config.cjs',
    '<rootDir>/services/order-service/jest.config.js',
    '<rootDir>/services/inventory-service/jest.config.js',
    '<rootDir>/services/user-service/jest.config.js',
    '<rootDir>/services/api-gateway/jest.config.js',
    '<rootDir>/shared-utils/jest.config.js'
  ],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  reporters: ['default']
};
