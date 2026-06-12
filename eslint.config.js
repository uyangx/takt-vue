import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: tseslint.parser },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      // `<Takt>` / `<TaktAnalytics>` are the intentional public component names.
      'vue/multi-word-component-names': 'off',
      // Optional pass-through props (domain, endpoint) have no meaningful default;
      // the ones that need one are set via withDefaults.
      'vue/require-default-prop': 'off',
    },
  },
]
