/**
 * Application Core - Singleton Pattern
 * Orquestra toda a aplicação e gerencia dependências
 * Implementa Dependency Injection e Inversion of Control
 */

import { eventBus } from "./EventBus.js";
import { SlideModel } from "../models/SlideModel.js";
import { ConfigModel } from "../models/ConfigModel.js";
import { StateModel, APP_STATES } from "../models/StateModel.js";
import { EVENTS } from "../utils/constants.js";
import { SLIDES_CONFIG } from "../config/slides.config.js";
import { EnvironmentValidator } from "../utils/validators.js";

export class Application {
  constructor() {
    if (Application.instance) {
      return Application.instance;
    }

    // Modelos
    this.slideModel = null;
    this.configModel = null;
    this.stateModel = null;

    // Controllers (serão injetados depois)
    this.sliderController = null;
    this.effectsController = null;
    this.navigationController = null;

    // Services (serão injetados depois)
    this.textureLoaderService = null;
    this.shaderService = null;
    this.timerService = null;

    // Views (serão injetados depois)
    this.loadingView = null;
    this.navigationView = null;
    this.counterView = null;
    this.controlPanelView = null;

    // Estado de inicialização
    this.isInitialized = false;
    this.initializationPromise = null;

    // Bind methods
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.handleUnload = this.handleUnload.bind(this);

    Application.instance = this;
  }

  /**
   * Inicializa a aplicação
   * @returns {Promise}
   */
  async initialize() {
    if (this.isInitialized) {
      return this.initializationPromise;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._performInitialization();
    return this.initializationPromise;
  }

  /**
   * Realiza a inicialização da aplicação
   * @private
   */
  async _performInitialization() {
    try {
      console.log("🚀 Inicializando aplicação GSAP Image Slider...");

      // 1. Validar ambiente
      await this._validateEnvironment();

      // 2. Inicializar modelos
      await this._initializeModels();

      // 3. Configurar listeners globais
      this._setupGlobalListeners();

      // 4. A partir daqui, os controllers e services serão injetados externamente

      this.isInitialized = true;
      console.log("✅ Aplicação inicializada com sucesso!");

      eventBus.emit(EVENTS.APP_INITIALIZED, {
        timestamp: Date.now(),
        performance: this.stateModel.getPerformanceMetrics(),
      });
    } catch (error) {
      console.error("❌ Erro na inicialização:", error);
      this.stateModel?.setAppState(APP_STATES.ERROR, { error });
      throw error;
    }
  }

  /**
   * Injeta dependências (Dependency Injection)
   * @param {Object} dependencies - Objetos de dependência
   */
  injectDependencies(dependencies) {
    const {
      sliderController,
      effectsController,
      navigationController,
      textureLoaderService,
      shaderService,
      timerService,
      loadingView,
      navigationView,
      counterView,
      controlPanelView,
    } = dependencies;

    // Controllers
    if (sliderController) this.sliderController = sliderController;
    if (effectsController) this.effectsController = effectsController;
    if (navigationController) this.navigationController = navigationController;

    // Services
    if (textureLoaderService) this.textureLoaderService = textureLoaderService;
    if (shaderService) this.shaderService = shaderService;
    if (timerService) this.timerService = timerService;

    // Views
    if (loadingView) this.loadingView = loadingView;
    if (navigationView) this.navigationView = navigationView;
    if (counterView) this.counterView = counterView;
    if (controlPanelView) this.controlPanelView = controlPanelView;

    console.log("📦 Dependências injetadas:", Object.keys(dependencies));
  }

  /**
   * Inicia a aplicação após todas as dependências estarem prontas
   */
  async start() {
    if (!this.isInitialized) {
      throw new Error("Aplicação deve ser inicializada antes de iniciar");
    }

    try {
      this.stateModel.setAppState(APP_STATES.LOADING);

      // Inicializar components se disponíveis
      if (this.loadingView) {
        await this.loadingView.show();
      }

      // Carregar texturas se o service estiver disponível
      if (this.textureLoaderService) {
        await this.textureLoaderService.loadAllTextures();
      }

      // Inicializar renderer se o service estiver disponível
      if (this.shaderService) {
        await this.shaderService.initialize();
      }

      // Inicializar UI views
      if (this.navigationView) {
        this.navigationView.render();
      }

      if (this.counterView) {
        this.counterView.render();
      }

      // Marcar como pronto
      this.stateModel.setAppState(APP_STATES.READY);

      // Iniciar timer se disponível
      if (this.timerService && this.stateModel.get("isAutoPlayEnabled")) {
        this.timerService.start();
        this.stateModel.setAppState(APP_STATES.PLAYING);
      }

      console.log("🎉 Aplicação iniciada com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao iniciar aplicação:", error);
      this.stateModel.setAppState(APP_STATES.ERROR, { error });
      throw error;
    }
  }

  /**
   * Para a aplicação
   */
  stop() {
    if (this.timerService) {
      this.timerService.stop();
    }

    this.stateModel.setAppState(APP_STATES.PAUSED);
    console.log("⏸️ Aplicação pausada");
  }

  /**
   * Retoma a aplicação
   */
  resume() {
    if (this.timerService && this.stateModel.get("isAutoPlayEnabled")) {
      this.timerService.start();
      this.stateModel.setAppState(APP_STATES.PLAYING);
    } else {
      this.stateModel.setAppState(APP_STATES.READY);
    }

    console.log("▶️ Aplicação retomada");
  }

  /**
   * Finaliza a aplicação
   */
  destroy() {
    // Parar timers
    if (this.timerService) {
      this.timerService.destroy();
    }

    // Destruir renderer
    if (this.shaderService) {
      this.shaderService.destroy();
    }

    // Destruir views
    [
      this.loadingView,
      this.navigationView,
      this.counterView,
      this.controlPanelView,
    ].forEach((view) => view?.destroy?.());

    // Remover listeners globais
    this._removeGlobalListeners();

    // Limpar event bus
    eventBus.clear();

    // Reset modelos
    this.slideModel?.reset();
    this.stateModel?.reset();

    this.isInitialized = false;
    console.log("🧹 Aplicação finalizada");

    eventBus.emit(EVENTS.APP_DESTROYED);
  }

  /**
   * Valida o ambiente de execução
   * @private
   */
  async _validateEnvironment() {
    console.log("🔍 Validando ambiente...");

    const validation = EnvironmentValidator.validate();

    if (!validation.isValid) {
      throw new Error(`Ambiente inválido: ${validation.errors.join(", ")}`);
    }

    if (validation.warnings.length > 0) {
      console.warn("⚠️ Avisos do ambiente:", validation.warnings);
    }

    console.log("✅ Ambiente validado");
  }

  /**
   * Inicializa os modelos de dados
   * @private
   */
  async _initializeModels() {
    console.log("📊 Inicializando modelos...");

    // State Model (primeiro, pois outros dependem dele)
    this.stateModel = new StateModel();

    // Config Model
    this.configModel = new ConfigModel();

    // Slide Model
    this.slideModel = new SlideModel(SLIDES_CONFIG);

    console.log("✅ Modelos inicializados");
  }

  /**
   * Configura listeners globais
   * @private
   */
  _setupGlobalListeners() {
    // Visibility API
    document.addEventListener("visibilitychange", this.handleVisibilityChange);

    // Resize
    window.addEventListener("resize", this.handleWindowResize);

    // Unload
    window.addEventListener("beforeunload", this.handleUnload);

    // Error handling
    window.addEventListener("error", this.handleGlobalError.bind(this));
    window.addEventListener(
      "unhandledrejection",
      this.handleUnhandledRejection.bind(this)
    );
  }

  /**
   * Remove listeners globais
   * @private
   */
  _removeGlobalListeners() {
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange
    );
    window.removeEventListener("resize", this.handleWindowResize);
    window.removeEventListener("beforeunload", this.handleUnload);
    window.removeEventListener("error", this.handleGlobalError);
    window.removeEventListener(
      "unhandledrejection",
      this.handleUnhandledRejection
    );
  }

  /**
   * Handle visibility change
   */
  handleVisibilityChange() {
    if (document.hidden) {
      this.stateModel.set("isInViewport", false);
      if (this.stateModel.get("appState") === APP_STATES.PLAYING) {
        this.stop();
      }
    } else {
      this.stateModel.set("isInViewport", true);
      if (this.stateModel.get("appState") === APP_STATES.PAUSED) {
        this.resume();
      }
    }
  }

  /**
   * Handle window resize
   */
  handleWindowResize() {
    if (this.shaderService) {
      this.shaderService.handleResize();
    }

    eventBus.emit(EVENTS.WINDOW_RESIZE, {
      width: window.innerWidth,
      height: window.innerHeight,
      timestamp: Date.now(),
    });
  }

  /**
   * Handle page unload
   */
  handleUnload() {
    this.destroy();
  }

  /**
   * Handle global errors
   */
  handleGlobalError(event) {
    const error = new Error(event.message || "Erro desconhecido");
    this.stateModel.reportError(error, "global");
  }

  /**
   * Handle unhandled promise rejections
   */
  handleUnhandledRejection(event) {
    const error = new Error(event.reason || "Promise rejection");
    this.stateModel.reportError(error, "promise");
  }

  /**
   * Getters para acesso aos modelos
   */
  getSlideModel() {
    return this.slideModel;
  }
  getConfigModel() {
    return this.configModel;
  }
  getStateModel() {
    return this.stateModel;
  }

  /**
   * Debug info
   */
  getDebugInfo() {
    return {
      isInitialized: this.isInitialized,
      models: {
        slide: !!this.slideModel,
        config: !!this.configModel,
        state: !!this.stateModel,
      },
      controllers: {
        slider: !!this.sliderController,
        effects: !!this.effectsController,
        navigation: !!this.navigationController,
      },
      services: {
        textureLoader: !!this.textureLoaderService,
        shader: !!this.shaderService,
        timer: !!this.timerService,
      },
      views: {
        loading: !!this.loadingView,
        navigation: !!this.navigationView,
        counter: !!this.counterView,
        controlPanel: !!this.controlPanelView,
      },
      state: this.stateModel?.getDebugInfo(),
    };
  }
}

// Export singleton instance
export const app = new Application();
