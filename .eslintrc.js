module.exports = {
  root: true,
  ignorePatterns: ['dist/**'],
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        createDefaultProgram: true,
      },
      plugins: ['@angular-eslint', '@typescript-eslint', 'import', 'prettier'],
      settings: {
        'import/resolver': {
          node: {
            paths: ['.'],
            extensions: ['.js', '.ts', '.d.ts'],
          },
        },
      },
      rules: {
        'prettier/prettier': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
        'import/no-duplicates': 'error',
        'import/order': [
          'error',
          {
            groups: [
              'builtin',
              'external',
              'internal',
              'parent',
              'sibling',
              'index',
              'object',
              'type',
            ],
            alphabetize: { order: 'asc' },
            'newlines-between': 'never',
            pathGroups: [
              {
                pattern: '{@angular,angular/**}',
                group: 'external',
                position: 'before',
              },
              {
                pattern: '{src}/**',
                group: 'parent',
                position: 'before',
              },
            ],
          },
        ],
        'import/newline-after-import': 'error',
        'import/no-named-default': 'error',
        'import/no-named-as-default-member': 'off',
        'import/no-anonymous-default-export': 'error',
        'import/no-useless-path-segments': 'error',
        'import/dynamic-import-chunkname': 'error',
      },
    },
    {
      files: ['*.html'],
      parser: '@angular-eslint/template-parser',
      plugins: ['@angular-eslint/template'],
      rules: {
        '@angular-eslint/template/banana-in-box': 'error',
        '@angular-eslint/template/no-negated-async': 'error',
      },
    },
  ],
};
