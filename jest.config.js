export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: [
    '**/src/test/**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/test/**',
    '!src/app.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.js'],
  verbose: true
};
