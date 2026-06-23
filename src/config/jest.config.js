module.exports = {
  rootDir: "../..",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/tests/**/*.js"],
  coverageDirectory: "coverage",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.js", "!src/tests/**"],
};
