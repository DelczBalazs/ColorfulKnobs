import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['device/code/**', 'node_modules/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error'
    }
  },
  {
    // Hand-written Max runtime scripts (spikes / entry shims): plain scripts
    // with Max's globals, loaded by the v8 object via CommonJS require().
    files: ['device/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        post: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        module: 'readonly',
        autowatch: 'writable',
        inlets: 'writable',
        outlets: 'writable'
      }
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  }
);
