import solid from 'eslint-plugin-solid/configs/typescript';
import * as tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';
import globals from 'globals';
import tseslint, { configs as tsConfigs } from 'typescript-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  ...tseslint.config(tsConfigs.recommended),
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,jsx}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    rules: {
      'no-console': 'warn',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,jsx}'],
    ...solid,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: 'tsconfig.json',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: 'tsconfig.json',
        }),
      ],
    },
  },
  {
    ignores: [
      '**/*.log',
      '**/.DS_Store',
      '**/.vscode/settings.json',
      '**/.history',
      '**/.yarn',
      '**/bazel-*',
      '**/bazel-bin',
      '**/bazel-out',
      '**/bazel-qwik',
      '**/bazel-testlogs',
      '**/dist',
      '**/dist-dev',
      '**/lib',
      '**/lib-types',
      '**/etc',
      '**/external',
      '**/node_modules',
      '**/temp',
      '**/tsc-out',
      '**/tsdoc-metadata.json',
      '**/target',
      '**/output',
      '**/rollup.config.js',
      '**/build',
      '**/.cache',
      '**/.vscode',
      '**/.rollup.cache',
      '**/dist',
      '**/tsconfig.tsbuildinfo',
      '**/vite.config.ts',
      '**/*.spec.tsx',
      '**/*.spec.ts',
      '**/.netlify',
      '**/pnpm-lock.yaml',
      '**/package-lock.json',
      '**/yarn.lock',
      '**/server',
      '**/postcss.config.js',
      '**/prettier.config.js',
      '**/tailwind.config.js',
      '**/typedoc.js',
    ],
  },
];
