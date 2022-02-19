module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.eslint.json',
  },
  plugins: ['react', 'import', '@typescript-eslint'],
  rules: {
    'no-nested-ternary': 'off',
    'jsx-a11y/accessible-emoji': 'off',
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-implicit-any-catch': [
      'error',
      { allowExplicitAny: true },
    ],
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: true },
        ],
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      },
    },
  ],
};
