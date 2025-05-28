module.exports = {
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    globals: {
      browser: true,
    },
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      }
    }
  },
  files: ['**/*.{ts,tsx}'],
  ignores: ['dist/**', 'node_modules/**'],
  plugins: {
    '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    'react-refresh': require('eslint-plugin-react-refresh')
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
  }
}
