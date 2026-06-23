const prettierRecommended = require("eslint-plugin-prettier/recommended");
const { builtinRules } = require("eslint/use-at-your-own-risk");

const recommendedRules = Object.fromEntries(
  Array.from(builtinRules)
    .filter(([, rule]) => rule.meta?.docs?.recommended)
    .map(([ruleName]) => [ruleName, "error"]),
);

module.exports = [
  {
    ignores: ["coverage/**", "node_modules/**"],
  },
  {
    rules: recommendedRules,
  },
  prettierRecommended,
  {
    rules: {
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        afterAll: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        beforeEach: "readonly",
        describe: "readonly",
        expect: "readonly",
        it: "readonly",
        jest: "readonly",
        process: "readonly",
        console: "readonly",
        Buffer: "readonly",
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        clearInterval: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        setTimeout: "readonly",
      },
    },
  },
];
