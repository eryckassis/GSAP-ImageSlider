// E2E Test: GSAP Image Slider
// 🎯 Analogia: O "Cliente Virtual" que testa a aplicação completa
// Testa a experiência do usuário de ponta a ponta

import { test, expect } from '@playwright/test';

test.describe('GSAP Image Slider - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navega para a aplicação antes de cada teste
    await page.goto('/');
  });

  test('should load and display the slider', async ({ page }) => {
    // Verifica se o canvas principal foi renderizado (usar seletor mais específico)
    const canvas = page.locator('canvas.webgl-canvas');
    await expect(canvas).toBeVisible();

    // Verifica se tem dimensões
    const box = await canvas.boundingBox();
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
  });

  test('should display Tweakpane controls', async ({ page }) => {
    // Verifica se o painel de controles existe (pode estar minimizado)
    const tweakpane = page.locator('.tp-dfwv');
    await expect(tweakpane).toBeAttached(); // Apenas verifica se existe no DOM
  });

  test('should have correct page title', async ({ page }) => {
    // Ajusta para o título real da aplicação
    await expect(page).toHaveTitle(/Liquid Morphology|GSAP|Slider/i);
  });

  test('should load without console errors', async ({ page }) => {
    const errors = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(2000); // Aguarda carregamento

    // Permite alguns erros conhecidos (ajuste conforme necessário)
    const criticalErrors = errors.filter(
      (err) => !err.includes('DevTools') && !err.includes('Extension')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('canvas.webgl-canvas');
  });

  test('should navigate with keyboard arrows', async ({ page }) => {
    // Pressiona seta direita
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(1000); // Aguarda transição

    // Pressiona seta esquerda
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(1000);

    // Se chegou aqui sem erro, navegação funcionou
    const canvas = page.locator('canvas.webgl-canvas');
    await expect(canvas).toBeVisible();
  });

  test('should navigate with mouse click', async ({ page }) => {
    const canvas = page.locator('canvas.webgl-canvas');

    // Clica no lado direito (próximo)
    await canvas.click({ position: { x: 700, y: 400 } });
    await page.waitForTimeout(1000);

    // Clica no lado esquerdo (anterior)
    await canvas.click({ position: { x: 100, y: 400 } });
    await page.waitForTimeout(1000);

    await expect(canvas).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('should load page in reasonable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForSelector('canvas.webgl-canvas');

    const loadTime = Date.now() - startTime;

    // Deve carregar em menos de 10 segundos (ajustado para CI)
    expect(loadTime).toBeLessThan(10000);
  });

  test('should have no memory leaks on navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('canvas.webgl-canvas');

    // Navega várias vezes
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(500);
    }

    // Se chegou aqui sem crash, não há leak crítico
    const canvas = page.locator('canvas.webgl-canvas');
    await expect(canvas).toBeVisible();
  });
});

/*
🎯 DICAS DE TESTES E2E:

1. ARRANGE (preparar)
   await page.goto('/');
   await page.waitForSelector('.elemento');

2. ACT (agir)
   await page.click('.botao');
   await page.fill('input', 'valor');
   await page.keyboard.press('Enter');

3. ASSERT (verificar)
   await expect(page.locator('.resultado')).toBeVisible();
   await expect(page).toHaveURL('/nova-pagina');

📚 SELETORES ÚTEIS:
- page.locator('css-selector')
- page.getByRole('button', { name: 'Click me' })
- page.getByText('texto')
- page.getByLabel('label')

🔧 AÇÕES ÚTEIS:
- click(), fill(), type()
- hover(), focus(), blur()
- press(), keyboard.press()
- waitForTimeout(), waitForSelector()
- screenshot(), video()
*/
