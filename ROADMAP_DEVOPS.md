# 🗺️ ROADMAP DevOps - GSAP Image Slider

> **Transformando um projeto bom em um projeto EXCELENTE** 🚀

## 📋 Índice

1. [Visão Geral & Analogias](#visão-geral--analogias)
2. [Fase 1: Fundação - Linting & Code Quality](#fase-1-fundação---linting--code-quality)
3. [Fase 2: Controle de Versão Profissional](#fase-2-controle-de-versão-profissional)
4. [Fase 3: Testes Unitários](#fase-3-testes-unitários)
5. [Fase 4: Testes E2E](#fase-4-testes-e2e)
6. [Fase 5: CI/CD Pipeline](#fase-5-cicd-pipeline)
7. [Fase 6: Code Coverage & Quality Gates](#fase-6-code-coverage--quality-gates)
8. [Fase 7: Automação & Dependências](#fase-7-automação--dependências)
9. [Checklist de Implementação](#checklist-de-implementação)
10. [Troubleshooting & Compatibilidade](#troubleshooting--compatibilidade)

---

## 🎯 Visão Geral & Analogias

### O que estamos construindo?

Imagine seu projeto como uma **fábrica de carros de luxo**:

- **ESLint** = Inspetor de qualidade que verifica se todas as peças seguem o padrão
- **Prettier** = Pintor que deixa tudo bonito e uniforme
- **CommitLint** = Documentarista que registra cada modificação de forma clara
- **Husky** = Porteiro que não deixa nada sair da fábrica sem passar pela inspeção
- **Jest** = Engenheiro que testa cada componente individualmente
- **Playwright** = Piloto de testes que dirige o carro completo na pista
- **CI/CD** = Linha de montagem automatizada
- **Codecov** = Auditor que mede quanto da fábrica foi testado
- **Dependabot** = Fornecedor que atualiza as peças automaticamente

### Por que cada ferramenta?

| Ferramenta     | Problema que Resolve                  | Benefício Real              |
| -------------- | ------------------------------------- | --------------------------- |
| **ESLint**     | Código inconsistente, bugs escondidos | -40% bugs em produção       |
| **Prettier**   | Brigas sobre formatação               | +100% paz na equipe         |
| **CommitLint** | Histórico confuso                     | +300% clareza no git log    |
| **Husky**      | Código ruim chegando ao repo          | +80% qualidade média        |
| **Jest**       | Quebras silenciosas                   | +70% confiança ao refatorar |
| **Playwright** | Bugs de integração                    | +90% garantia de UX         |
| **CI/CD**      | Deploy manual e erro humano           | +95% velocidade de entrega  |
| **Codecov**    | Partes não testadas                   | +100% visibilidade          |
| **Dependabot** | Vulnerabilidades antigas              | +85% segurança              |

---

## 🏗️ FASE 1: Fundação - Linting & Code Quality

### 🎯 Objetivo

Estabelecer padrões de código antes de qualquer coisa.

### 🧠 Analogia

Como estabelecer as regras da casa antes de convidar pessoas para morar.

### 📦 Ferramentas

- **ESLint** (v9.x) - Linter JavaScript/TypeScript
- **Prettier** (v3.x) - Formatador de código
- **eslint-config-prettier** - Integração

### ⚙️ Configurações Modernas (2025)

#### 1.1 ESLint Flat Config (Nova Sintaxe)

```javascript
// eslint.config.js (Flat Config - padrão desde ESLint v9)
import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2024,
      },
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      semi: ["error", "always"],
      quotes: ["error", "single"],
      "arrow-spacing": "error",
      "no-duplicate-imports": "error",
      "prefer-template": "error",
    },
    ignores: ["dist/**", "node_modules/**", "coverage/**", "*.config.js"],
  },
];
```

#### 1.2 Prettier Config

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

#### 1.3 EditorConfig

```ini
# .editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

### 📝 Scripts para package.json

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"**/*.{js,json,css,md}\"",
    "format:check": "prettier --check \"**/*.{js,json,css,md}\""
  }
}
```

### ✅ Checklist Fase 1

- [ ] Instalar dependências ESLint + Prettier
- [ ] Criar arquivos de configuração
- [ ] Executar `npm run lint:fix`
- [ ] Executar `npm run format`
- [ ] Verificar que não há erros

---

## 🔐 FASE 2: Controle de Versão Profissional

### 🎯 Objetivo

Criar histórico de commits semântico e rastreável.

### 🧠 Analogia

Como um diário de bordo de um navio: cada entrada deve ser clara sobre o que aconteceu.

### 📦 Ferramentas

- **Husky** (v9.x) - Git hooks automatizados
- **Commitlint** (v19.x) - Validação de mensagens
- **lint-staged** - Lint apenas arquivos alterados
- **Conventional Commits** - Padrão de mensagens

### ⚙️ Configurações Modernas

#### 2.1 Conventional Commits Config

```javascript
// commitlint.config.js
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // Nova funcionalidade
        "fix", // Correção de bug
        "docs", // Documentação
        "style", // Formatação
        "refactor", // Refatoração
        "perf", // Performance
        "test", // Testes
        "chore", // Manutenção
        "ci", // CI/CD
        "build", // Build
        "revert", // Reverter
      ],
    ],
    "type-case": [2, "always", "lower-case"],
    "subject-case": [2, "never", ["upper-case"]],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 100],
  },
};
```

#### 2.2 Lint-Staged Config

```javascript
// lint-staged.config.js
export default {
  "*.js": ["eslint --fix", "prettier --write"],
  "*.{json,css,md}": ["prettier --write"],
};
```

#### 2.3 Husky Hooks

```bash
# .husky/pre-commit
npm run lint-staged

# .husky/commit-msg
npx --no -- commitlint --edit $1

# .husky/pre-push
npm run test:ci
```

### 📝 Exemplos de Commits

```bash
✅ CORRETO:
feat: add shader transition effects
fix: resolve texture loading race condition
docs: update README with installation steps
refactor: extract shader manager into separate class
test: add unit tests for NavigationController

❌ ERRADO:
Update files
Fixed bug
WIP
asdfasdf
```

### ✅ Checklist Fase 2

- [ ] Instalar Husky, Commitlint, lint-staged
- [ ] Configurar hooks
- [ ] Testar com commit
- [ ] Verificar que hooks executam

---

## 🧪 FASE 3: Testes Unitários

### 🎯 Objetivo

Testar cada módulo isoladamente.

### 🧠 Analogia

Como testar cada ingrediente de um bolo separadamente antes de assar.

### 📦 Ferramentas

- **Jest** (v29.x) - Framework de testes
- **@testing-library** - Testes de componentes
- **jest-environment-jsdom** - Ambiente browser

### ⚙️ Configurações Modernas

#### 3.1 Jest Config

```javascript
// jest.config.js
export default {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/**/*.test.js",
    "!src/**/*.spec.js",
    "!src/main.js",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
};
```

#### 3.2 Babel Config (para Jest)

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": { "node": "current" }
      }
    ]
  ]
}
```

#### 3.3 Exemplo de Teste Unitário

```javascript
// src/core/__tests__/NavigationController.test.js
import { NavigationController } from "../NavigationController";

describe("NavigationController", () => {
  let controller;
  let mockTransitionManager;
  let mockConfig;

  beforeEach(() => {
    mockTransitionManager = {
      startTransition: jest.fn(),
    };
    mockConfig = {
      images: ["img1.jpg", "img2.jpg", "img3.jpg"],
      autoplay: false,
    };
    controller = new NavigationController(mockTransitionManager, mockConfig);
  });

  describe("next()", () => {
    it("should increment slide index", () => {
      expect(controller.currentIndex).toBe(0);
      controller.next();
      expect(controller.currentIndex).toBe(1);
    });

    it("should wrap to first slide after last", () => {
      controller.currentIndex = 2;
      controller.next();
      expect(controller.currentIndex).toBe(0);
    });

    it("should call transition manager", () => {
      controller.next();
      expect(mockTransitionManager.startTransition).toHaveBeenCalled();
    });
  });

  describe("previous()", () => {
    it("should decrement slide index", () => {
      controller.currentIndex = 1;
      controller.previous();
      expect(controller.currentIndex).toBe(0);
    });

    it("should wrap to last slide before first", () => {
      controller.previous();
      expect(controller.currentIndex).toBe(2);
    });
  });
});
```

### 📝 Scripts para package.json

```json
{
  "scripts": {
    "test": "jest --watch",
    "test:ci": "jest --ci --coverage",
    "test:coverage": "jest --coverage",
    "test:unit": "jest --testPathPattern=test.js"
  }
}
```

### ✅ Checklist Fase 3

- [ ] Instalar Jest e dependências
- [ ] Criar jest.config.js
- [ ] Escrever testes para cada módulo
- [ ] Atingir 70%+ de cobertura
- [ ] Integrar com Git hooks

---

## 🎭 FASE 4: Testes E2E

### 🎯 Objetivo

Testar a aplicação completa como um usuário real.

### 🧠 Analogia

Como ter um cliente virtual testando toda a experiência do produto.

### 📦 Ferramentas

- **Playwright** (v1.49.x) - Testes E2E modernos
- **@playwright/test** - Runner de testes

### ⚙️ Configurações Modernas

#### 4.1 Playwright Config

```javascript
// playwright.config.js
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html"],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
  ],
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
```

#### 4.2 Exemplo de Teste E2E

```javascript
// e2e/slider.spec.js
import { test, expect } from "@playwright/test";

test.describe("GSAP Image Slider", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load and display initial slide", async ({ page }) => {
    await expect(page.locator("canvas")).toBeVisible();
    await expect(page.locator(".tweakpane")).toBeVisible();
  });

  test("should navigate to next slide on click", async ({ page }) => {
    const canvas = page.locator("canvas");
    await canvas.click({ position: { x: 700, y: 400 } }); // Right side

    // Wait for transition
    await page.waitForTimeout(1000);

    // Verify shader effect changed
    const screenshot = await canvas.screenshot();
    expect(screenshot).toBeTruthy();
  });

  test("should navigate with keyboard arrows", async ({ page }) => {
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(1000);

    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(1000);
  });

  test("should show controls panel", async ({ page }) => {
    const controlsPanel = page.locator(".tweakpane");
    await expect(controlsPanel).toBeVisible();

    // Test preset change
    const presetButton = page.locator(".tp-lblv_v select");
    await presetButton.selectOption("glitch");
  });

  test("should handle touch gestures on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const canvas = page.locator("canvas");
    await canvas.swipe({ direction: "left" });
    await page.waitForTimeout(1000);
  });

  test("should maintain performance", async ({ page }) => {
    const metrics = await page.evaluate(() => ({
      fps: performance.now(),
      memory: performance.memory?.usedJSHeapSize,
    }));

    expect(metrics.fps).toBeLessThan(50); // Initial load under 50ms
  });
});

test.describe("Accessibility", () => {
  test("should have proper ARIA labels", async ({ page }) => {
    await page.goto("/");

    const canvas = page.locator("canvas");
    await expect(canvas).toHaveAttribute("aria-label");
  });

  test("should be keyboard navigable", async ({ page }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
  });
});
```

### 📝 Scripts para package.json

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:report": "playwright show-report"
  }
}
```

### ✅ Checklist Fase 4

- [ ] Instalar Playwright
- [ ] Criar playwright.config.js
- [ ] Escrever testes E2E principais
- [ ] Testar em múltiplos browsers
- [ ] Verificar relatórios

---

## 🚀 FASE 5: CI/CD Pipeline

### 🎯 Objetivo

Automatizar todo o fluxo: teste → build → deploy.

### 🧠 Analogia

Como uma linha de montagem: cada etapa acontece automaticamente quando você faz commit.

### 📦 Ferramentas

- **GitHub Actions** - CI/CD Platform
- **Vercel** - Deploy automático

### ⚙️ Configurações Modernas

#### 5.1 GitHub Actions - Pipeline Principal

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  # Job 1: Lint & Format Check
  lint:
    name: 🔍 Lint & Format
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20.x"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Check formatting
        run: npm run format:check

  # Job 2: Unit Tests
  test-unit:
    name: 🧪 Unit Tests
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20.x"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run Jest
        run: npm run test:ci

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/lcov.info
          flags: unit
          name: unit-tests
          fail_ci_if_error: true

  # Job 3: E2E Tests
  test-e2e:
    name: 🎭 E2E Tests
    runs-on: ubuntu-latest
    needs: lint
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20.x"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps ${{ matrix.browser }}

      - name: Run Playwright tests
        run: npm run test:e2e -- --project=${{ matrix.browser }}

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-${{ matrix.browser }}
          path: playwright-report/
          retention-days: 30

  # Job 4: Build
  build:
    name: 🏗️ Build
    runs-on: ubuntu-latest
    needs: [test-unit, test-e2e]
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20.x"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 7

  # Job 5: Deploy (apenas na main)
  deploy:
    name: 🚢 Deploy to Vercel
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment:
      name: production
      url: ${{ steps.deploy.outputs.url }}
    steps:
      - uses: actions/checkout@v4

      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/

      - name: Deploy to Vercel
        id: deploy
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
          working-directory: ./
```

#### 5.2 Dependabot Configuration

```yaml
# .github/dependabot.yml
version: 2
updates:
  # NPM dependencies
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 10
    reviewers:
      - "eryckassis"
    assignees:
      - "eryckassis"
    commit-message:
      prefix: "chore(deps)"
      include: "scope"
    labels:
      - "dependencies"
      - "automated"
    versioning-strategy: increase
    groups:
      development-dependencies:
        dependency-type: "development"
      production-dependencies:
        dependency-type: "production"
    ignore:
      - dependency-name: "*"
        update-types: ["version-update:semver-major"]

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    commit-message:
      prefix: "ci"
    labels:
      - "ci"
      - "automated"
```

#### 5.3 Pull Request Template

```markdown
# .github/pull_request_template.md

## 📝 Descrição

<!-- Descreva as mudanças deste PR -->

## 🎯 Tipo de Mudança

- [ ] 🐛 Bug fix
- [ ] ✨ Nova feature
- [ ] 💥 Breaking change
- [ ] 📝 Documentação
- [ ] ♻️ Refatoração
- [ ] ⚡ Performance
- [ ] ✅ Testes

## ✅ Checklist

- [ ] Código segue o style guide (ESLint passing)
- [ ] Testes unitários adicionados/atualizados
- [ ] Testes E2E adicionados/atualizados (se aplicável)
- [ ] Documentação atualizada
- [ ] CI/CD pipeline passando
- [ ] Code coverage mantido/aumentado

## 🧪 Como Testar

<!-- Descreva os passos para testar suas mudanças -->

1.
2.
3.

## 📸 Screenshots

<!-- Se aplicável, adicione screenshots -->

## 🔗 Links Relacionados

<!-- Issues, docs, etc -->

Closes #
```

### ✅ Checklist Fase 5

- [ ] Criar workflow CI/CD
- [ ] Configurar Dependabot
- [ ] Adicionar secrets no GitHub
- [ ] Testar pipeline completo
- [ ] Verificar deploy automático

---

## 📊 FASE 6: Code Coverage & Quality Gates

### 🎯 Objetivo

Garantir que todo código novo é testado.

### 🧠 Analogia

Como um medidor de segurança: não deixa nada passar sem estar 100% verificado.

### 📦 Ferramentas

- **Codecov** - Visualização de coverage
- **SonarCloud** - Análise de qualidade (opcional)

### ⚙️ Configurações Modernas

#### 6.1 Codecov Config

```yaml
# codecov.yml
coverage:
  status:
    project:
      default:
        target: 70%
        threshold: 2%
        if_ci_failed: error
    patch:
      default:
        target: 80%
        threshold: 5%

comment:
  layout: "header, diff, flags, components"
  behavior: default
  require_changes: false
  require_base: false
  require_head: true

ignore:
  - "**/*.test.js"
  - "**/*.spec.js"
  - "**/__tests__/**"
  - "**/node_modules/**"
  - "dist/**"
  - "coverage/**"
  - "*.config.js"

component_management:
  default_rules:
    statuses:
      - type: project
        target: 70%
  individual_components:
    - component_id: core
      name: Core Modules
      paths:
        - src/core/**
      rules:
        statuses:
          - type: project
            target: 80%

    - component_id: utils
      name: Utilities
      paths:
        - src/utils/**
      rules:
        statuses:
          - type: project
            target: 75%
```

#### 6.2 Badges para README

```markdown
# Adicionar no README.md

[![CI/CD](https://github.com/eryckassis/GSAP-ImageSlider/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/eryckassis/GSAP-ImageSlider/actions)
[![codecov](https://codecov.io/gh/eryckassis/GSAP-ImageSlider/branch/main/graph/badge.svg)](https://codecov.io/gh/eryckassis/GSAP-ImageSlider)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=eryckassis_GSAP-ImageSlider&metric=alert_status)](https://sonarcloud.io/dashboard?id=eryckassis_GSAP-ImageSlider)
[![Maintainability](https://api.codeclimate.com/v1/badges/YOUR_TOKEN/maintainability)](https://codeclimate.com/github/eryckassis/GSAP-ImageSlider/maintainability)
```

### ✅ Checklist Fase 6

- [ ] Configurar Codecov
- [ ] Adicionar token aos secrets
- [ ] Verificar relatórios
- [ ] Adicionar badges ao README

---

## 🤖 FASE 7: Automação & Dependências

### 🎯 Objetivo

Manter o projeto sempre atualizado e seguro.

### 🧠 Analogia

Como ter um assistente que cuida da manutenção preventiva.

### ⚙️ Configurações Adicionais

#### 7.1 Renovate Bot (Alternativa ao Dependabot)

```json
{
  "extends": ["config:base"],
  "schedule": ["before 9am on monday"],
  "labels": ["dependencies"],
  "assignees": ["eryckassis"],
  "packageRules": [
    {
      "matchUpdateTypes": ["major"],
      "automerge": false
    },
    {
      "matchUpdateTypes": ["minor", "patch"],
      "matchCurrentVersion": "!/^0/",
      "automerge": true,
      "automergeType": "pr"
    }
  ]
}
```

#### 7.2 GitHub Actions - Auto Merge

```yaml
# .github/workflows/auto-merge.yml
name: Auto Merge

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  auto-merge:
    runs-on: ubuntu-latest
    if: github.actor == 'dependabot[bot]'
    steps:
      - name: Wait for CI
        uses: lewagon/wait-on-check-action@v1.3.1
        with:
          ref: ${{ github.event.pull_request.head.sha }}
          check-name: "CI/CD Pipeline"
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          wait-interval: 10

      - name: Auto merge
        uses: pascalgn/automerge-action@v0.16.2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          MERGE_LABELS: "automated,dependencies"
          MERGE_METHOD: "squash"
          MERGE_COMMIT_MESSAGE: "pull-request-title"
```

### ✅ Checklist Fase 7

- [ ] Configurar Dependabot ou Renovate
- [ ] Configurar auto-merge (opcional)
- [ ] Testar atualizações automáticas

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Semana 1: Fundação

- [ ] Instalar e configurar ESLint
- [ ] Instalar e configurar Prettier
- [ ] Criar EditorConfig
- [ ] Formatar código existente
- [ ] Resolver todos os warnings

### Semana 2: Git & Commits

- [ ] Instalar Husky
- [ ] Configurar Commitlint
- [ ] Configurar lint-staged
- [ ] Criar hooks
- [ ] Treinar equipe sobre commits convencionais

### Semana 3: Testes Unitários

- [ ] Instalar Jest
- [ ] Configurar ambiente de testes
- [ ] Escrever testes para NavigationController
- [ ] Escrever testes para ShaderManager
- [ ] Escrever testes para TransitionManager
- [ ] Atingir 70% de cobertura

### Semana 4: Testes E2E

- [ ] Instalar Playwright
- [ ] Configurar browsers
- [ ] Escrever testes de navegação
- [ ] Escrever testes de UI
- [ ] Escrever testes de performance
- [ ] Testar em mobile

### Semana 5: CI/CD

- [ ] Criar workflow GitHub Actions
- [ ] Configurar jobs de lint
- [ ] Configurar jobs de teste
- [ ] Configurar job de build
- [ ] Integrar com Vercel
- [ ] Testar pipeline completo

### Semana 6: Coverage & Quality

- [ ] Configurar Codecov
- [ ] Adicionar badges
- [ ] Criar quality gates
- [ ] Configurar relatórios

### Semana 7: Automação

- [ ] Configurar Dependabot
- [ ] Criar PR templates
- [ ] Configurar auto-merge (se desejado)
- [ ] Documentar processo completo

---

## 🔧 TROUBLESHOOTING & COMPATIBILIDADE

### Problema: ESLint não encontra arquivos

```bash
# Solução: Verificar padrões no eslint.config.js
# Adicionar verbosidade
npx eslint --debug .
```

### Problema: Jest não reconhece ES Modules

```json
// package.json
{
  "type": "module",
  "jest": {
    "transform": {
      "^.+\\.js$": "babel-jest"
    }
  }
}
```

### Problema: Playwright timeout

```javascript
// playwright.config.js
export default defineConfig({
  timeout: 30000, // Aumentar timeout
  expect: {
    timeout: 5000,
  },
});
```

### Problema: Husky não executa hooks

```bash
# Reinstalar hooks
npm run prepare
git add .husky/
chmod +x .husky/*
```

### Matriz de Compatibilidade

| Ferramenta | Versão | Node.js | Conflitos Conhecidos             |
| ---------- | ------ | ------- | -------------------------------- |
| ESLint     | 9.x    | ≥18.x   | Prettier (resolvido com config)  |
| Prettier   | 3.x    | ≥14.x   | -                                |
| Jest       | 29.x   | ≥16.x   | ES Modules (resolvido com Babel) |
| Playwright | 1.49.x | ≥18.x   | -                                |
| Husky      | 9.x    | ≥18.x   | -                                |
| Commitlint | 19.x   | ≥18.x   | -                                |

---

## 🎓 RECURSOS DE APRENDIZADO

### Documentação Oficial

- [ESLint](https://eslint.org/docs/latest/)
- [Prettier](https://prettier.io/docs/en/)
- [Jest](https://jestjs.io/docs/getting-started)
- [Playwright](https://playwright.dev/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Conventional Commits](https://www.conventionalcommits.org/)

### Cursos Recomendados

- Kent C. Dodds - Testing JavaScript
- GitHub Learning Lab - CI/CD
- Playwright University

### Comunidades

- Discord ESLint
- Playwright Community
- Testing Library Discord

---

## 📈 MÉTRICAS DE SUCESSO

Após implementação completa, você terá:

- ✅ 100% dos commits seguindo padrão
- ✅ 0 erros de lint em produção
- ✅ 70%+ de code coverage
- ✅ Deploy automático em < 5 minutos
- ✅ 100% dos PRs com testes passando
- ✅ Dependências atualizadas semanalmente
- ✅ 0 vulnerabilidades críticas
- ✅ Time +300% mais confiante em fazer mudanças

---

## 🚀 PRÓXIMOS PASSOS

Quer começar? Execute:

```bash
# Clone este roadmap
git clone <repo>

# Instale as ferramentas fase por fase
npm run setup:phase1  # Lint
npm run setup:phase2  # Git
npm run setup:phase3  # Unit Tests
npm run setup:phase4  # E2E Tests
npm run setup:phase5  # CI/CD
```

**Bora transformar esse projeto em enterprise-grade!** 💪

---

_Criado com ❤️ para o GSAP Image Slider Project_
_Última atualização: Outubro 2025_
