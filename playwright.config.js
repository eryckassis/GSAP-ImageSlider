// Playwright Configuration
// 🎯 Analogia: O "Diretor de Cinema" dos testes - configura como os testes E2E são executados
// Configuração moderna para Playwright 2025

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Pasta onde ficam os testes E2E
  testDir: './e2e',

  // Executa testes em paralelo
  fullyParallel: true,

  // Falha se houver .only() em CI
  forbidOnly: !!process.env.CI,

  // Retries em caso de falha (apenas em CI)
  retries: process.env.CI ? 2 : 0,

  // Workers: quantos testes rodam simultaneamente
  workers: process.env.CI ? 1 : undefined,

  // Reporters: como exibir resultados
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'], // Mostra no terminal
  ],

  // Configurações globais para todos os testes
  use: {
    // URL base da aplicação
    baseURL: 'http://localhost:5173',

    // Trace apenas na primeira falha (para debug)
    trace: 'on-first-retry',

    // Screenshot apenas em falhas
    screenshot: 'only-on-failure',

    // Vídeo apenas em falhas
    video: 'retain-on-failure',

    // Timeout para ações (ms)
    actionTimeout: 10000,
  },

  // Projetos: testa em múltiplos browsers/devices
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Descomente para testar em mais browsers:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // Mobile
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

  // Web Server: inicia o dev server automaticamente
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI, // Reutiliza em dev, cria novo em CI
    timeout: 120000, // 2 minutos para subir
  },
});

/*
📚 COMANDOS ÚTEIS:

npm run test:e2e           # Roda testes E2E
npm run test:e2e:ui        # Abre interface gráfica
npm run test:e2e:debug     # Modo debug
npm run test:e2e:report    # Abre relatório HTML

🎯 ESTRUTURA DE TESTES E2E:

e2e/
  slider.spec.js           # Testes do slider
  navigation.spec.js       # Testes de navegação
  performance.spec.js      # Testes de performance
  accessibility.spec.js    # Testes de acessibilidade
*/
