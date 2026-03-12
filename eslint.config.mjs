import antfu from '@antfu/eslint-config';
import checkFile from 'eslint-plugin-check-file';

export default antfu({
  type: 'lib',

  stylistic: {
    indent: 2,
    quotes: 'single',
  },

  typescript: true,
  vue: true,
  html: true,
  css: true,

  plugins: {
    'check-file': checkFile,
  },

  ignores: [
    '**/.vscode/**',
    '**/package.json',
    '**/tsconfig.json',
    '**/tsconfig.node.json',
    '.cursor/**',
    '.github/**',
    '.changeset/**',
    'dist/**',
    '**/es/**',
    '**/lib/**',
    // '**/locale/**',
    // '**/assets/**',
    '**/api-extractor.json',
    '**/*.d.ts',
    'docs/.vitepress/cache/**',
    'docs/demo/**',
  ],
  rules: {
    // 文件名应使用 kebab-case, 例如 my-component.ts.
    // { ignoreMiddleExtensions: true }, 忽略中间的扩展名, 例如: vite.config.ts
    'check-file/filename-naming-convention': [
      'error',
      { '**/*.{js,ts,jsx,tsx}': 'KEBAB_CASE' },
      { ignoreMiddleExtensions: true },
    ],
    // 文件名应使用 kebab-case, 例如 utils/helpers/
    'check-file/folder-naming-convention': [
      'error',
      { '**/': 'KEBAB_CASE' },
    ],
    'max-len': ['warn', {
      code: 120,
      tabWidth: 2,
      ignoreUrls: true, // 忽略 URL 太长
      ignoreStrings: true, // 忽略字符串（如长模板字符串或引号字符串）
      ignoreTemplateLiterals: true, // 忽略模板字符串
      ignoreRegExpLiterals: true, // 忽略正则表达式字面量
      ignoreComments: true, // **允许注释行超长**
    }],

    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],

    // 允许最多 2 行连续空行，文件首(maxBOF), 尾(maxEOF)
    'style/no-multiple-empty-lines': ['warn', { max: 2, maxBOF: 0, maxEOF: 1 }],
    'style/semi': ['error', 'always'],
    'style/member-delimiter-style': ['warn', {
      multiline: {
        delimiter: 'comma', // 多行 type 使用逗号
        requireLast: true,
      },
      multilineDetection: 'brackets',
      overrides: {
        interface: {
          multiline: {
            delimiter: 'semi', // 多行 interface 使用分号
            requireLast: true,
          },
        },
      },
      singleline: {
        delimiter: 'comma', // 单行成员使用逗号
      },
    }],
    'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    // 'no-unused-vars': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_', // 忽略以 _ 开头的变量
        args: 'after-used', // 检查使用后的参数
        argsIgnorePattern: '^_', // 忽略以 _ 开头的函数参数
        caughtErrors: 'all', // 检查所有 catch(error)
        caughtErrorsIgnorePattern: '^_', // 忽略以 _ 开头的 catch
      },
    ],
    'import/consistent-type-specifier-style': 'warn',
    'ts/explicit-function-return-type': 'off',
  },
})
  .append({
    files: ['**/*.md', '**/*.md/*'],
    rules: {
      'max-len': 'off',
      'no-console': 'off',
      'import/no-unresolved': 'off',
      'unused-imports/no-unused-vars': 'off',
      'style/quote-props': 'off',
      'style/no-multiple-empty-lines': 'off',
    },
  });

