import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

const tsStrictConfigs = tseslint.configs.strictTypeChecked.map((config) => ({
  ...config,
  files: ['**/*.{ts,tsx}'],
}))

const tsStylisticConfigs = tseslint.configs.stylisticTypeChecked.map((config) => ({
  ...config,
  files: ['**/*.{ts,tsx}'],
}))

export default tseslint.config(
  {
    name: 'ignore',
    ignores: ['dist', 'node_modules', '*.config.*'],
  },
  js.configs.recommended,
  ...tsStrictConfigs,
  ...tsStylisticConfigs,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  {
    name: 'project-rules',
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...eslintConfigPrettier.rules,
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', disallowTypeAnnotations: false },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
    },
  },
)
