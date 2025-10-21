/**
 * Base View - Classe abstrata para todas as views
 * Implementa Template Method Pattern e Observer Pattern
 * Define estrutura comum para todas as views da aplicação
 */

import { eventBus } from "../core/EventBus.js";
import { DOMUtils, PerformanceUtils } from "../utils/helpers.js";

export class BaseView {
  constructor(selector, stateModel) {
    if (this.constructor === BaseView) {
      throw new Error("BaseView é uma classe abstrata");
    }

    this.selector = selector;
    this.stateModel = stateModel;

    // DOM elements
    this.element = null;
    this.isRendered = false;
    this.isVisible = true;

    // Event listeners registry
    this.eventListeners = new Map();
    this.stateListeners = new Map();

    // Performance tracking
    this.renderTime = 0;
    this.updateCount = 0;

    // Configuration
    this.config = this.getDefaultConfig();

    // Auto-initialize if selector provided
    if (this.selector) {
      this.initialize();
    }
  }

  /**
   * Configuração padrão - override nas subclasses
   * @returns {Object}
   */
  getDefaultConfig() {
    return {
      autoRender: true,
      autoUpdate: true,
      throttleUpdates: true,
      throttleDelay: 16, // ~60fps
      cleanupOnDestroy: true,
    };
  }

  /**
   * Inicializa a view
   */
  initialize() {
    try {
      this._findElement();
      this._setupEventListeners();
      this._setupStateListeners();

      if (this.config.autoRender) {
        this.render();
      }

      this._onInitialized();
    } catch (error) {
      console.error(
        `Erro na inicialização da view ${this.constructor.name}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Encontra o elemento DOM
   * @private
   */
  _findElement() {
    if (typeof this.selector === "string") {
      this.element = document.querySelector(this.selector);
      if (!this.element) {
        throw new Error(`Elemento não encontrado: ${this.selector}`);
      }
    } else if (this.selector instanceof HTMLElement) {
      this.element = this.selector;
    } else {
      throw new Error("Selector deve ser uma string ou HTMLElement");
    }
  }

  /**
   * Configura event listeners - implementar nas subclasses
   * @private
   */
  _setupEventListeners() {
    // Override nas subclasses
  }

  /**
   * Configura listeners de estado - implementar nas subclasses
   * @private
   */
  _setupStateListeners() {
    // Override nas subclasses
  }

  /**
   * Hook chamado após inicialização - implementar nas subclasses
   * @private
   */
  _onInitialized() {
    // Override nas subclasses
  }

  /**
   * Renderiza a view - método abstrato
   */
  render() {
    if (this.isRendered) {
      console.warn(`View ${this.constructor.name} já foi renderizada`);
      return;
    }

    const startTime = performance.now();

    try {
      // Template Method Pattern
      this._beforeRender();
      this._doRender();
      this._afterRender();

      this.isRendered = true;
      this.renderTime = performance.now() - startTime;

      console.log(
        `✅ ${this.constructor.name} renderizada em ${this.renderTime.toFixed(
          2
        )}ms`
      );
    } catch (error) {
      console.error(
        `Erro na renderização da view ${this.constructor.name}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Hook antes da renderização - implementar nas subclasses
   * @private
   */
  _beforeRender() {
    // Override nas subclasses
  }

  /**
   * Método principal de renderização - implementar nas subclasses
   * @private
   */
  _doRender() {
    throw new Error("_doRender() deve ser implementado pela subclasse");
  }

  /**
   * Hook após renderização - implementar nas subclasses
   * @private
   */
  _afterRender() {
    // Override nas subclasses
  }

  /**
   * Atualiza a view
   * @param {Object} data - Dados para atualização
   */
  update(data = {}) {
    if (!this.isRendered) {
      console.warn(`View ${this.constructor.name} não foi renderizada ainda`);
      return;
    }

    if (!this.config.autoUpdate) {
      return;
    }

    this.updateCount++;

    try {
      this._beforeUpdate(data);
      this._doUpdate(data);
      this._afterUpdate(data);
    } catch (error) {
      console.error(
        `Erro na atualização da view ${this.constructor.name}:`,
        error
      );
    }
  }

  /**
   * Hook antes da atualização - implementar nas subclasses
   * @private
   */
  _beforeUpdate(data) {
    // Override nas subclasses
  }

  /**
   * Método principal de atualização - implementar nas subclasses
   * @private
   */
  _doUpdate(data) {
    // Override nas subclasses
  }

  /**
   * Hook após atualização - implementar nas subclasses
   * @private
   */
  _afterUpdate(data) {
    // Override nas subclasses
  }

  /**
   * Mostra a view
   * @param {Object} options - Opções de animação
   */
  show(options = {}) {
    if (this.isVisible) return;

    const defaultOptions = {
      duration: 0.3,
      ease: "power2.out",
      onComplete: null,
    };

    const opts = { ...defaultOptions, ...options };

    // Remover display none se existir
    if (this.element.style.display === "none") {
      this.element.style.display = "";
    }

    // Animação com GSAP
    gsap.fromTo(
      this.element,
      {
        opacity: 0,
        ...this._getShowFromProps(),
      },
      {
        opacity: 1,
        ...this._getShowToProps(),
        duration: opts.duration,
        ease: opts.ease,
        onComplete: () => {
          this.isVisible = true;
          this._onShown();
          opts.onComplete?.();
        },
      }
    );
  }

  /**
   * Propriedades iniciais para animação de show - implementar nas subclasses
   * @private
   */
  _getShowFromProps() {
    return {}; // Override nas subclasses
  }

  /**
   * Propriedades finais para animação de show - implementar nas subclasses
   * @private
   */
  _getShowToProps() {
    return {}; // Override nas subclasses
  }

  /**
   * Hook chamado quando view é mostrada - implementar nas subclasses
   * @private
   */
  _onShown() {
    // Override nas subclasses
  }

  /**
   * Esconde a view
   * @param {Object} options - Opções de animação
   */
  hide(options = {}) {
    if (!this.isVisible) return;

    const defaultOptions = {
      duration: 0.3,
      ease: "power2.in",
      onComplete: null,
    };

    const opts = { ...defaultOptions, ...options };

    gsap.to(this.element, {
      opacity: 0,
      ...this._getHideToProps(),
      duration: opts.duration,
      ease: opts.ease,
      onComplete: () => {
        this.isVisible = false;
        this.element.style.display = "none";
        this._onHidden();
        opts.onComplete?.();
      },
    });
  }

  /**
   * Propriedades finais para animação de hide - implementar nas subclasses
   * @private
   */
  _getHideToProps() {
    return {}; // Override nas subclasses
  }

  /**
   * Hook chamado quando view é escondida - implementar nas subclasses
   * @private
   */
  _onHidden() {
    // Override nas subclasses
  }

  /**
   * Toggle visibilidade
   */
  toggle(options = {}) {
    if (this.isVisible) {
      this.hide(options);
    } else {
      this.show(options);
    }
  }

  /**
   * Adiciona event listener e registra para cleanup
   * @param {HTMLElement} element - Elemento
   * @param {string} event - Nome do evento
   * @param {Function} handler - Handler do evento
   * @param {Object} options - Opções do addEventListener
   */
  addEventListenerWithCleanup(element, event, handler, options = {}) {
    element.addEventListener(event, handler, options);

    // Registrar para cleanup
    const key = `${element}_${event}`;
    if (!this.eventListeners.has(key)) {
      this.eventListeners.set(key, []);
    }
    this.eventListeners.get(key).push({ handler, options });
  }

  /**
   * Adiciona listener de estado e registra para cleanup
   * @param {string} eventName - Nome do evento
   * @param {Function} handler - Handler do evento
   * @param {Object} context - Contexto de execução
   */
  addStateListenerWithCleanup(eventName, handler, context = null) {
    eventBus.on(eventName, handler, context);

    // Registrar para cleanup
    this.stateListeners.set(eventName, { handler, context });
  }

  /**
   * Cria update function com throttle
   * @param {Function} updateFn - Função de update
   * @returns {Function} Função throttled
   */
  createThrottledUpdate(updateFn) {
    if (!this.config.throttleUpdates) {
      return updateFn;
    }

    return PerformanceUtils.throttle(updateFn, this.config.throttleDelay);
  }

  /**
   * Atualiza configuração da view
   * @param {Object} newConfig - Nova configuração
   */
  updateConfig(newConfig) {
    Object.assign(this.config, newConfig);
    this._onConfigUpdated(newConfig);
  }

  /**
   * Hook chamado quando configuração é atualizada - implementar nas subclasses
   * @private
   */
  _onConfigUpdated(newConfig) {
    // Override nas subclasses
  }

  /**
   * Adiciona classe CSS
   * @param {string} className - Nome da classe
   */
  addClass(className) {
    this.element?.classList.add(className);
  }

  /**
   * Remove classe CSS
   * @param {string} className - Nome da classe
   */
  removeClass(className) {
    this.element?.classList.remove(className);
  }

  /**
   * Toggle classe CSS
   * @param {string} className - Nome da classe
   * @param {boolean} force - Forçar add/remove
   */
  toggleClass(className, force = undefined) {
    return this.element?.classList.toggle(className, force);
  }

  /**
   * Verifica se tem classe CSS
   * @param {string} className - Nome da classe
   */
  hasClass(className) {
    return this.element?.classList.contains(className) || false;
  }

  /**
   * Define estilos CSS
   * @param {Object} styles - Objeto com estilos
   */
  setStyles(styles) {
    if (this.element) {
      DOMUtils.setStyles(this.element, styles);
    }
  }

  /**
   * Obtém estatísticas da view
   * @returns {Object}
   */
  getStats() {
    return {
      isRendered: this.isRendered,
      isVisible: this.isVisible,
      renderTime: this.renderTime,
      updateCount: this.updateCount,
      eventListeners: this.eventListeners.size,
      stateListeners: this.stateListeners.size,
      element: !!this.element,
    };
  }

  /**
   * Obtém informações de debug
   * @returns {Object}
   */
  getDebugInfo() {
    return {
      className: this.constructor.name,
      selector: this.selector,
      config: this.config,
      stats: this.getStats(),
    };
  }

  /**
   * Limpa event listeners registrados
   * @private
   */
  _cleanupEventListeners() {
    for (const [key, listeners] of this.eventListeners) {
      const [element, event] = key.split("_");
      listeners.forEach(({ handler, options }) => {
        element.removeEventListener(event, handler, options);
      });
    }
    this.eventListeners.clear();
  }

  /**
   * Limpa state listeners registrados
   * @private
   */
  _cleanupStateListeners() {
    for (const [eventName, { handler, context }] of this.stateListeners) {
      eventBus.off(eventName, handler, context);
    }
    this.stateListeners.clear();
  }

  /**
   * Destrói a view
   */
  destroy() {
    if (this.config.cleanupOnDestroy) {
      this._cleanupEventListeners();
      this._cleanupStateListeners();
    }

    // Hook para cleanup personalizado
    this._onDestroy();

    // Limpar referências
    this.element = null;
    this.stateModel = null;
    this.isRendered = false;
    this.isVisible = false;

    console.log(`🧹 ${this.constructor.name} destruída`);
  }

  /**
   * Hook chamado na destruição - implementar nas subclasses
   * @private
   */
  _onDestroy() {
    // Override nas subclasses
  }
}
