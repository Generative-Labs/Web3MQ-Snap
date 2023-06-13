module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
  },

  extends: ['@metamask/eslint-config'],

  overrides: [
    {
      files: ['**/*.js'],
      extends: ['@metamask/eslint-config-nodejs'],
    },

    {
      files: ['**/*.{ts,tsx}'],
      extends: ['@metamask/eslint-config-typescript'],
      rules: {
        'require-jsdoc': [
          'warn',
          {
            require: {
              FunctionDeclaration: true,
              ClassDeclaration: true,
              MethodDefinition: true,
              ArrowFunctionExpression: true,
            },
          },
        ],
        camelcase: 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        "treatUndefinedAsUnspecified": false,
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      },
    },

    {
      files: ['**/*.test.ts', '**/*.test.js'],
      extends: ['@metamask/eslint-config-jest'],
      rules: {
        'require-jsdoc': [
          'warn',
          {
            require: {
              FunctionDeclaration: true,
              ClassDeclaration: true,
              MethodDefinition: true,
              ArrowFunctionExpression: true,
            },
          },
        ],
        camelcase: 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        "treatUndefinedAsUnspecified": false,
        '@typescript-eslint/no-shadow': [
          'error',
          { allow: ['describe', 'expect', 'it'] },
        ],
      },
    },
  ],

  ignorePatterns: [
    '!.prettierrc.js',
    '**/!.eslintrc.js',
    '**/dist*/',
    '**/*__GENERATED__*',
    '**/build',
    '**/public',
    '**/.cache',
  ],
};
