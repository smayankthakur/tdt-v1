module.exports = {
  extends: ['next/core-web-vitals', 'next/typescript'],
  plugins: ['./eslint-plugin-local'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'local/no-hardcoded-text': 'error',
  },
}
