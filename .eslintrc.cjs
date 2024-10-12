/** @type {import("eslint").Linter.Config} */
const config = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": true
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    // "plugin:@typescript-eslint/stylistic-type-checked"
  ],
  "rules": {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": "off", // Changed to off for less strictness
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_",
        "ignoreRestSiblings": true // Allow unused rest siblings
      }
    ],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "warn", // Changed to warn for flexibility
      {
        "checksVoidReturn": {
          "attributes": false
        }
      }
    ],
    '@typescript-eslint/ban-ts-comment': [
      "warn"
    ],
    '@typescript-eslint/no-unnecessary-type-assertion': "warn",
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-empty-object-type': "warn",
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-call': "warn",
    '@typescript-eslint/no-unsafe-argument': "warn"
  }
}
module.exports = config;
