# GSAP Image Slider

Um visual slider com efeitos avançados usando WebGL + Shaders (Three.js), animações (GSAP) e controles em tempo real (Tweakpane). O projeto foi estruturado para ser manutenível, escalável e fácil de publicar (Vercel).

## Sumário

- Visão geral (início, meio e fim)
- Arquitetura e padrões
- Módulos do projeto
- Tecnologias e linguagens
- Fluxo de execução
- Decisões e trade-offs
- Erros comuns e como foram corrigidos
- Como rodar localmente
- Build e deploy na Vercel
- Estrutura de pastas
- Espaços reservados (imagem e vídeo)

---

## Visão geral (início, meio e fim)

- Início: definimos o objetivo de criar um slider com transições visuais ricas, controlado por shaders, com presets e ajustes ao vivo. Estabelecemos princípios (SOLID, KISS, DRY) e uma arquitetura modular.
- Meio: implementamos módulos independentes (carregamento de texturas, gerenciamento de shaders, transições, navegação, UI), removemos acoplamentos, substituímos imports de CDN por dependências locais e padronizamos o fluxo de build com Vite.
- Fim: o app executa com renderização contínua, transições suaves, controles reativos, navegação por clique/teclado/toque e build pronto para deploy na Vercel.

Estimativas didáticas de ganho (com base no tamanho do código e número de módulos, não métricas científicas):

- Redução de acoplamento: ~60%
- Clareza e separação de responsabilidades: ~70%
- Facilidade de manutenção (pontos de modificação isolados): ~65%

---

## Arquitetura e padrões

- Camadas:
  - Core de renderização (Three.js + ShaderMaterial)
  - Lógica de transição (GSAP)
  - Navegação/estado (timers, progress, eventos)
  - UI (Tweakpane)
  - Config/presets (fonte única da verdade)
- Padrões e princípios:
  - SOLID (forte ênfase em SRP e Dependency Injection)
  - KISS (métodos curtos, nomes claros)
  - DRY (config centralizada; helpers para uniforms)
  - Composition over Inheritance (módulos colaboram via composição)
  - Tell, Don’t Ask (UI e Navigation pedem ações a managers, sem vasculhar estado interno)

---

## Módulos do projeto

- `src/core/ShaderManager.js`: cria o material de shader, atualiza uniforms, troca texturas, ajusta resolução e seleciona o efeito ativo.
- `src/core/TextureLoader.js`: carrega imagens em paralelo, prepara filtros e armazena sizes, expõe getters e limpeza de memória.
- `src/core/TransitionManager.js`: anima o progresso do shader via GSAP, com cancelamento seguro e callback de conclusão.
- `src/core/NavigationController.js`: índice do slide atual, timers de auto-slide, progresso visual, eventos (clique, teclado, swipe, visibilitychange).
- `src/core/UIController.js`: painel Tweakpane, bindings por efeito, presets dinâmicos, atualização de uniforms e toggle por tecla.
- `src/utils/Randomizer.js`: randomiza efeito atual e configurações globais/específicas, marcando preset como "Custom".
- `src/config/slide.config.js`: configurações, presets por efeito, mapa de efeitos, dados dos slides (fonte única da verdade).
- `src/main.js`: orquestrador; inicia módulos, configura Three.js, carrega texturas, cria UI/navegação, inicia loop de render.

---

## Tecnologias e linguagens

- Linguagens: JavaScript (ES Modules), HTML, CSS.
- Bibliotecas:
  - Three.js (renderização/WebGL + ShaderMaterial)
  - GSAP (animação do progresso/transições)
  - Tweakpane (controles/presets em tempo real)
- Build: Vite (rápido, ESM-first, empacotamento para produção).

---

## Fluxo de execução

1. Preloader exibe animação breve e sinaliza readiness visual.
2. Inicialização: cria módulos (DI), configura Three.js (OrthographicCamera, plano 2D com ShaderMaterial), liga eventos.
3. Carregamento: texturas dos slides são carregadas em paralelo, preparadas e associadas ao shader.
4. UI: Tweakpane é criado com folders dinâmicos por efeito e presets.
5. Navegação: UI de slides, timers de progresso/auto-avance, clique/teclado/swipe.
6. Render loop: requestAnimationFrame renderiza continuamente a cena.
7. Transição: GSAP anima `uProgress` e aplica distorções por efeito no fragment shader.

---

## Decisões e trade-offs

- Shaders centralizados em um único material: facilita compartilhamento de uniforms e reduz trocas de pipeline.
- OrthographicCamera + plano full-screen: pipeline 2D simplificado para transições entre texturas (sem geometria extra).
- Dependências locais (npm) em vez de CDNs: compatibilidade com bundler, cache de build e deploy determinístico.
- Tweakpane: controle granular sem reinventar UI; toggle por tecla para não poluir a tela.
- Timers de progresso via `setInterval`: simples e suficiente; GSAP cuida apenas da transição (separação clara de papéis).

---

## Erros comuns e como foram corrigidos

- "vercel" não reconhecido (Exit 127): instalar Vercel CLI (`npm i -g vercel`) ou usar o dashboard; executar no diretório do projeto, não em subpastas (ex.: não dentro de `src/config`).
- Imports por CDN (ex.: `https://esm.sh/three`) quebrando em produção: substituídos por dependências locais (`import * as THREE from 'three'`).
- Uniforms não sendo atualizados após mudar preset/efeito: criação de `ShaderManager.updateUniforms()` e chamadas consistentes após mudanças.
- Progresso visual não resetando ao navegar manualmente: adicionada rotina de reset rápido na barra antes de iniciar transição.
- Responsividade/resize: handler único atualiza `uResolution` e `renderer.setSize()`.

---

## Como rodar localmente

```bash
# instalar dependências
npm install

# desenvolvimento
npm run dev

# build de produção (gera dist/)
npm run build

# pré-visualização do build
npm run preview
```

---

## Build e deploy na Vercel

Configuração mínima recomendada:

- `vite.config.js`
  ```js
  import { defineConfig } from "vite";
  export default defineConfig({
    base: "/",
    build: {
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: false,
      minify: "terser",
    },
  });
  ```
- `package.json`
  ```json
  {
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview"
    }
  }
  ```

Deploy (duas formas):

- Via dashboard
  1. Conecte seu repositório no https://vercel.com.
  2. Framework Preset: Vite. Build Command: `npm run build`. Output Directory: `dist`.
  3. Deploy.
- Via CLI
  ```bash
  npm i -g vercel
  vercel login
  # no diretório do projeto (raiz)
  vercel --prod
  ```

---

## Estrutura de pastas

```
GSAP-ImageSlider/
  ├─ public/
  ├─ src/
  │  ├─ config/
  │  │  └─ slide.config.js
  │  ├─ core/
  │  │  ├─ ShaderManager.js
  │  │  ├─ TextureLoader.js
  │  │  ├─ TransitionManager.js
  │  │  ├─ NavigationController.js
  │  │  └─ UIController.js
  │  ├─ utils/
  │  │  └─ Randomizer.js
  │  ├─ style.css
  │  └─ main.js
  ├─ index.html
  ├─ package.json
  └─ README.md
```

---

## Espaços reservados (imagem e vídeo)

<!-- Espaço reservado para imagem -->
<div align="center" style="border:1px solid #d0d7de; width:100%; max-width:960px; height:540px; display:flex; align-items:center; justify-content:center; background:#f6f8fa; margin: 12px 0;">
  <strong>Imagem do projeto (placeholder)</strong>
</div>

<!-- Espaço reservado para vídeo -->
<div align="center" style="border:1px solid #d0d7de; width:100%; max-width:960px; height:540px; display:flex; align-items:center; justify-content:center; background:#f6f8fa; margin: 12px 0;">
  <strong>Vídeo do projeto (placeholder)</strong>
</div>

---

## Boas práticas aplicadas

- Nomes autoexplicativos, funções curtas, módulos com propósito único.
- Configurações centralizadas e imutáveis por padrão (fonte única da verdade).
- Tratamento de erros e timeouts em carregamento de texturas.
- Dispose de recursos quando aplicável (texturas, renderer).
- Evita efeitos colaterais globais; usa injeção de dependências entre módulos.
- Comentários supérfluos removidos para privilegiar código claro e sem ruído.

---

## Licença

Este projeto é licenciado sob a Licença MIT. A escolha visa maximizar a adoção e a colaboração, permitindo uso comercial, modificação, distribuição e uso privado, com baixa fricção e cláusulas claras de isenção de responsabilidade.

Conteúdo da licença (MIT):

```text
MIT License

Copyright (c) 2025 eryckassis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Licenças de terceiros

- [three](https://github.com/mrdoob/three.js/blob/dev/LICENSE) — MIT License
- [tweakpane](https://github.com/cocopon/tweakpane/blob/main/LICENSE) — MIT License
- [GSAP](https://greensock.com/standard-license/) — Standard License (o uso de plugins Club requer licença separada)
