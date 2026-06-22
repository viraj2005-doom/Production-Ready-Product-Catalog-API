module.exports = {
  rootDir: ".",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/tests/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/tests/**",
    "!src/server.js",
    "!src/config/jest.config.js",
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 50,
      functions: 60,
      lines: 70,
    },
  },
  clearMocks: true,
  restoreMocks: true,
};
