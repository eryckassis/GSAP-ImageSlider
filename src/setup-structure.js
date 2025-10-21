import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = __dirname;

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",

  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",

  brightRed: "\x1b[91m",
  brightGreen: "\x1b[92m",
  brightYellow: "\x1b[93m",
  brightBlue: "\x1b[94m",
  brightMagenta: "\x1b[95m",
  brightCyan: "\x1b[96m",

  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m",
};

const folders = [
  "src/core",
  "src/models",
  "src/views/components",
  "src/controllers",
  "src/services",
  "src/effects",
  "src/shaders/fragments",
  "src/utils",
  "src/config",
  "src/styles/base",
  "src/styles/components",
  "src/styles/layout",
  "public/assets/images",
  "public/assets/fonts",
];

const files = {
  "src/core/Application.js": "",
  "src/core/EventBus.js": "",
  "src/models/SlideModel.js": "",
  "src/models/ConfigModel.js": "",
  "src/models/StateModel.js": "",
  "src/views/BaseView.js": "",
  "src/views/components/LoadingView.js": "",
  "src/views/components/NavigationView.js": "",
  "src/views/components/CounterView.js": "",
  "src/views/components/ControlPanelView.js": "",
  "src/controllers/SliderController.js": "",
  "src/controllers/EffectsController.js": "",
  "src/controllers/NavigationController.js": "",
  "src/services/TextureLoaderService.js": "",
  "src/services/ShaderService.js": "",
  "src/services/TimerService.js": "",
  "src/effects/BaseEffect.js": "",
  "src/effects/GlassEffect.js": "",
  "src/effects/FrostEffect.js": "",
  "src/effects/RippleEffect.js": "",
  "src/effects/PlasmaEffect.js": "",
  "src/effects/TimeshiftEffect.js": "",
  "src/shaders/vertex.glsl": "",
  "src/shaders/fragments/base.glsl": "",
  "src/shaders/fragments/glass.glsl": "",
  "src/shaders/fragments/frost.glsl": "",
  "src/shaders/fragments/ripple.glsl": "",
  "src/shaders/fragments/plasma.glsl": "",
  "src/shaders/fragments/timeshift.glsl": "",
  "src/utils/constants.js": "",
  "src/utils/helpers.js": "",
  "src/utils/validators.js": "",
  "src/config/effects.config.js": "",
  "src/config/slides.config.js": "",
  "src/styles/base/_reset.css": "",
  "src/styles/base/_variables.css": "",
  "src/styles/base/_typography.css": "",
  "src/styles/components/_loading.css": "",
  "src/styles/components/_navigation.css": "",
  "src/styles/components/_counter.css": "",
  "src/styles/components/_controls.css": "",
  "src/styles/layout/_slider.css": "",
  "src/styles/main.css": "",
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function setupProjectStructure() {
  console.log(
    `${colors.brightCyan}${colors.bright}🚀 Iniciando criação da estrutura do projeto...${colors.reset}\n`
  );

  try {
    console.log(`${colors.brightYellow}📁 Criando pastas...${colors.reset}`);
    for (const folder of folders) {
      const folderPath = path.join(projectRoot, folder);
      await fs.ensureDir(folderPath);
      console.log(
        `  ${colors.brightGreen}✅${colors.reset} ${colors.cyan}${folder}${colors.reset}`
      );
    }

    console.log(
      `\n${colors.brightYellow}📄 Criando arquivos...${colors.reset}`
    );
    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(projectRoot, filePath);
      await fs.ensureFile(fullPath);
      if (content) {
        await fs.writeFile(fullPath, content, "utf8");
      }
      console.log(
        `  ${colors.brightGreen}✅${colors.reset} ${colors.dim}${filePath}${colors.reset}`
      );
    }

    await fs.writeFile(
      path.join(projectRoot, "public/assets/images/.gitkeep"),
      "",
      "utf8"
    );
    await fs.writeFile(
      path.join(projectRoot, "public/assets/fonts/.gitkeep"),
      "",
      "utf8"
    );

    console.log(
      `\n${colors.brightGreen}✨ Estrutura do projeto criada com sucesso!${colors.reset}`
    );
    console.log(`\n${colors.brightMagenta}📊 Resumo:${colors.reset}`);
    console.log(
      `  ${colors.yellow}- ${folders.length} pastas criadas${colors.reset}`
    );
    console.log(
      `  ${colors.yellow}- ${Object.keys(files).length} arquivos criados${
        colors.reset
      }`
    );
  } catch (error) {
    console.error(
      `${colors.brightRed}❌ Erro ao criar estrutura:${colors.reset}`,
      error
    );
    throw error;
  }
}

async function cleanupProjectStructure() {
  console.log(
    `${colors.brightRed}⚠️  Iniciando limpeza da estrutura do projeto...${colors.reset}\n`
  );

  try {
    const foldersToDelete = ["src", "public/assets"];

    for (const folder of foldersToDelete) {
      const folderPath = path.join(projectRoot, folder);
      if (await fs.pathExists(folderPath)) {
        await fs.remove(folderPath);
        console.log(`${colors.red}✓ Removido: ${folder}${colors.reset}`);
      }
    }

    console.log(`\n${colors.brightGreen}✅ Limpeza concluída!${colors.reset}`);
  } catch (error) {
    console.error(
      `${colors.brightRed}❌ Erro ao limpar estrutura:${colors.reset}`,
      error
    );
    throw error;
  }
}

async function showMenu() {
  console.clear();
  console.log(
    `${colors.brightCyan}╔════════════════════════════════════════╗${colors.reset}`
  );
  console.log(
    `${colors.brightCyan}║${colors.reset}   ${colors.brightMagenta}${colors.bright}GSAP Image Slider - Setup CLI${colors.reset}      ${colors.brightCyan}║${colors.reset}`
  );
  console.log(
    `${colors.brightCyan}╚════════════════════════════════════════╝${colors.reset}\n`
  );
  console.log(`${colors.yellow}Escolha uma opção:${colors.reset}\n`);
  console.log(
    `  ${colors.brightGreen}1${colors.reset} - ${colors.white}Criar estrutura do projeto${colors.reset}`
  );
  console.log(
    `  ${colors.brightYellow}2${colors.reset} - ${colors.white}Limpar estrutura do projeto${colors.reset}`
  );
  console.log(
    `  ${colors.brightBlue}3${colors.reset} - ${colors.white}Recriar estrutura (limpar + criar)${colors.reset}`
  );
  console.log(
    `  ${colors.brightRed}0${colors.reset} - ${colors.white}Sair${colors.reset}\n`
  );

  const choice = await question(
    `${colors.cyan}Digite sua escolha: ${colors.reset}`
  );

  try {
    switch (choice.trim()) {
      case "1":
        await setupProjectStructure();
        break;

      case "2":
        const confirm = await question(
          `\n${colors.brightYellow}⚠️  Confirma a exclusão? (s/N): ${colors.reset}`
        );
        if (confirm.toLowerCase() === "s") {
          await cleanupProjectStructure();
        } else {
          console.log(`${colors.yellow}Operação cancelada.${colors.reset}`);
        }
        break;

      case "3":
        const confirmRecreate = await question(
          `\n${colors.brightRed}⚠️  Isso vai excluir e recriar tudo. Confirma? (s/N): ${colors.reset}`
        );
        if (confirmRecreate.toLowerCase() === "s") {
          await cleanupProjectStructure();
          console.log("\n");
          await setupProjectStructure();
        } else {
          console.log(`${colors.yellow}Operação cancelada.${colors.reset}`);
        }
        break;

      case "0":
        console.log(`\n${colors.brightMagenta}👋 Até logo!${colors.reset}`);
        rl.close();
        process.exit(0);
        break;

      default:
        console.log(`\n${colors.brightRed}❌ Opção inválida!${colors.reset}`);
    }

    await question(
      `\n${colors.dim}Pressione ENTER para continuar...${colors.reset}`
    );
    await showMenu();
  } catch (error) {
    console.error(
      `\n${colors.brightRed}❌ Erro:${colors.reset}`,
      error.message
    );
    await question(
      `\n${colors.dim}Pressione ENTER para tentar novamente...${colors.reset}`
    );
    await showMenu();
  }
}

showMenu();
