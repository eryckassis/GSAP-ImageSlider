// Jest Configuration (v30+)
// 🎯 Analogia: O "Laboratório de Testes" - define como os testes são executados
// Configuração moderna para Jest 30 com ES Modules e JSDOM

export default {
  // Ambiente de execução: jsdom simula um browser
  testEnvironment: 'jsdom',

  // Transformações: como processar diferentes tipos de arquivo
  transform: {
    '^.+\\.js$': 'babel-jest', // Usa Babel para transpilar JS
  },

  // Mapeamento de módulos: como resolver imports de arquivos não-JS
  moduleNameMapper: {
    // CSS imports retornam um objeto vazio
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

    // Imagens retornam string com o path
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/__mocks__/fileMock.js',
  },

  // Coleta de cobertura de código
  collectCoverageFrom: [
    'src/**/*.js', // Testa tudo em src/
    '!src/**/*.test.js', // Exceto os próprios testes
    '!src/**/*.spec.js', // Exceto specs
    '!src/main.js', // Exceto entry point
    '!src/setup-structure.js', // Exceto script de setup
  ],

  // Thresholds de cobertura (ajustado temporariamente - aumentar gradualmente)
  coverageThreshold: {
    global: {
      statements: 15,
      branches: 17,
      functions: 13,
      lines: 15,
    },
  },

  // Diretório de saída do coverage
  coverageDirectory: 'coverage',

  // Reporters de coverage
  coverageReporters: [
    'text', // Exibe no terminal
    'text-summary', // Resumo no terminal
    'html', // Gera HTML navegável
    'lcov', // Para Codecov
    'json', // Para ferramentas externas
  ],

  // Configuração pós-ambiente
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Padrões de arquivos de teste
  testMatch: [
    '**/__tests__/**/*.js', // Arquivos em pastas __tests__
    '**/?(*.)+(spec|test).js', // Arquivos *.test.js ou *.spec.js
  ],

  // Ignora arquivos que não são testes unitários
  testPathIgnorePatterns: [
    '/node_modules/',
    '/e2e/', // ← Ignora testes E2E
    '/playwright-report/',
    '/test-results/',
  ],

  // Timeout para testes (ms)
  testTimeout: 10000,

  // Limpa mocks automaticamente entre testes
  clearMocks: true,

  // Restaura mocks automaticamente entre testes
  restoreMocks: true,

  // Reseta mocks automaticamente entre testes
  resetMocks: true,

  // Verbose: mostra cada teste individualmente
  verbose: true,
};

/*
📚 COMANDOS ÚTEIS:

npm run test              # Roda testes em watch mode
npm run test:ci           # Roda todos os testes uma vez (para CI)
npm run test:coverage     # Roda e gera relatório de cobertura
npm run test:unit         # Roda apenas testes unitários

🎯 ESTRUTURA DE TESTES:

src/
  core/
    NavigationController.js
    __tests__/
      NavigationController.test.js
  utils/
    Randomizer.js
    __tests__/
      Randomizer.test.js

OU

src/
  core/
    NavigationController.js
    NavigationController.test.js

Ambas as estruturas funcionam!
*/
