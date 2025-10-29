// ESLint Flat Config (v9+)
// 🎯 Analogia: Este é o "Manual de Boas Práticas" da fábrica
// Define as regras que todo código deve seguir

import js from '@eslint/js';
import globals from 'globals';

export default [
  // Configuração recomendada do ESLint como base
  js.configs.recommended,

  {
    // 🌍 Define o ambiente: browser + ES2024
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2024,
      },
    },

    // 📏 Regras customizadas para qualidade de código
    rules: {
      // ⚠️ Warnings - Coisas que devemos evitar
      'no-console': 'warn', // Avisar sobre console.log (ok em dev, removível em prod)

      // 🚨 Errors - Coisas que NÃO podem passar
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // Permite _parametro para parâmetros não usados
          varsIgnorePattern: '^_', // Permite _variavel para variáveis intencionalmente não usadas
        },
      ],
      'prefer-const': 'error', // Use const quando não reatribuir
      'no-var': 'error', // Nunca use var, sempre let/const
      eqeqeq: ['error', 'always'], // Sempre use === e !== (nunca == ou !=)
      curly: ['error', 'all'], // Sempre use chaves em if/for/while
      semi: ['error', 'always'], // Sempre use ponto e vírgula
      quotes: ['error', 'single'], // Sempre use aspas simples
      'arrow-spacing': 'error', // Espaço em arrow functions: () => {}
      'no-duplicate-imports': 'error', // Não importar do mesmo arquivo 2x
      'prefer-template': 'error', // Use template literals em vez de concatenação
      'no-useless-return': 'error', // Evitar return desnecessário
      'no-else-return': 'error', // Se tem return no if, não precisa else
      'object-shorthand': 'error', // Use shorthand: { name } em vez de { name: name }
      'prefer-destructuring': [
        'error',
        {
          array: false,
          object: true,
        },
      ],
    },
  },

  // 🚫 Arquivos e pastas que o ESLint deve ignorar
  {
    ignores: [
      'dist/**', // Build output
      'node_modules/**', // Dependências
      'coverage/**', // Relatórios de testes
      'playwright-report/**', // Relatórios E2E
      'test-results/**', // Resultados de testes
      '*.config.js', // Arquivos de config (este próprio arquivo)
    ],
  },
];
