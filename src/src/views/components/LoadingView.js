/**
 * Loading View - Tela de carregamento
 * Herda de BaseView e implementa tela de loading animada
 */

import { BaseView } from "../BaseView.js";
import { eventBus } from "../../core/EventBus.js";
import { EVENTS, LOADING, SELECTORS } from "../../utils/constants.js";
import { ColorUtils, Easing } from "../../utils/helpers.js";

export class LoadingView extends BaseView {
  constructor(stateModel) {
    super(null, stateModel); // Sem selector, vamos criar o elemento

    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.startTime = null;
    this.isAnimating = false;

    // Configurações da animação
    this.dotRings = LOADING.DOT_RINGS;
    this.colors = LOADING.COLORS;
    this.duration = LOADING.DURATION;

    this.onComplete = null;
  }

  getDefaultConfig() {
    return {
      ...super.getDefaultConfig(),
      autoRender: false, // Vamos controlar manualmente
      canvasSize: LOADING.CANVAS_SIZE,
      fadeOutDuration: 0.8,
      delayBeforeHide: 0.5,
    };
  }

  /**
   * Configura listeners de estado
   * @private
   */
  _setupStateListeners() {
    this.addStateListenerWithCleanup(
      EVENTS.ALL_TEXTURES_LOADED,
      () => {
        this.hide();
      },
      this
    );

    this.addStateListenerWithCleanup(
      EVENTS.LOADING_PROGRESS,
      (data) => {
        this.updateProgress(data.percentage);
      },
      this
    );
  }

  /**
   * Renderiza a tela de loading
   * @private
   */
  _doRender() {
    this._createLoadingElement();
    this._setupCanvas();
    this._appendToDOM();
  }

  /**
   * Cria o elemento de loading
   * @private
   */
  _createLoadingElement() {
    this.element = document.createElement("div");
    this.element.className = "loading-overlay";

    // Estilos inline para garantir que funcione
    this.setStyles({
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      background: "#000000",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "10000",
      opacity: "1",
    });
  }

  /**
   * Configura o canvas de animação
   * @private
   */
  _setupCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.config.canvasSize;
    this.canvas.height = this.config.canvasSize;
    this.canvas.style.display = "block";

    this.ctx = this.canvas.getContext("2d");
    this.element.appendChild(this.canvas);
  }

  /**
   * Adiciona ao DOM
   * @private
   */
  _appendToDOM() {
    document.body.appendChild(this.element);
  }

  /**
   * Mostra a tela de loading
   * @param {Object} options - Opções
   */
  async show(options = {}) {
    if (!this.isRendered) {
      this.render();
    }

    // Configurar callback de conclusão
    if (options.onComplete) {
      this.onComplete = options.onComplete;
    }

    super.show({
      duration: 0.1, // Aparecer rapidamente
      onComplete: () => {
        this.startAnimation();
      },
    });

    return new Promise((resolve) => {
      this._showResolve = resolve;
    });
  }

  /**
   * Inicia a animação
   */
  startAnimation() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.startTime = performance.now();
    this._animate();

    console.log("🎬 Animação de loading iniciada");
  }

  /**
   * Para a animação
   */
  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.isAnimating = false;

    console.log("⏸️ Animação de loading parada");
  }

  /**
   * Loop principal de animação
   * @private
   */
  _animate() {
    if (!this.isAnimating) return;

    const currentTime = performance.now();
    const deltaTime = this.lastTime ? currentTime - this.lastTime : 0;
    this.lastTime = currentTime;

    // Incrementar tempo de animação
    this.animationTime = (this.animationTime || 0) + deltaTime * 0.001;

    // Limpar canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Desenhar ponto central
    this._drawCenterDot();

    // Desenhar anéis de pontos
    this._drawDotRings();

    // Verificar se deve parar por tempo
    if (currentTime - this.startTime >= this.duration) {
      this._handleNaturalCompletion();
      return;
    }

    // Próximo frame
    this.animationId = requestAnimationFrame(() => this._animate());
  }

  /**
   * Desenha ponto central
   * @private
   */
  _drawCenterDot() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);

    const rgb = ColorUtils.hexToRgb(this.colors.PRIMARY);
    this.ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.9)`;
    this.ctx.fill();
  }

  /**
   * Desenha anéis de pontos
   * @private
   */
  _drawDotRings() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const time = this.animationTime;

    this.dotRings.forEach((ring, ringIndex) => {
      for (let i = 0; i < ring.count; i++) {
        const angle = (i / ring.count) * Math.PI * 2;

        // Pulsação radial
        const pulseTime = time * 2 - ringIndex * 0.4;
        const radiusPulse =
          Easing.easeInOutSine((Math.sin(pulseTime) + 1) / 2) * 6 - 3;

        // Posição do ponto
        const x = centerX + Math.cos(angle) * (ring.radius + radiusPulse);
        const y = centerY + Math.sin(angle) * (ring.radius + radiusPulse);

        // Opacidade animada
        const opacityPhase = (Math.sin(pulseTime + i * 0.2) + 1) / 2;
        const opacityBase = 0.3 + Easing.easeInOutSine(opacityPhase) * 0.7;

        // Highlight pulsante
        const highlightPhase = (Math.sin(pulseTime) + 1) / 2;
        const highlightIntensity = Easing.easeInOutCubic(highlightPhase);

        // Desenhar ponto
        this.ctx.beginPath();
        this.ctx.arc(x, y, 2, 0, Math.PI * 2);

        const colorBlend = Easing.smoothstep(0.2, 0.8, highlightIntensity);
        this.ctx.fillStyle = ColorUtils.interpolateColor(
          this.colors.PRIMARY,
          this.colors.ACCENT,
          colorBlend,
          opacityBase
        );
        this.ctx.fill();
      }
    });
  }

  /**
   * Atualiza progresso (se necessário)
   * @param {number} percentage - Progresso em porcentagem
   */
  updateProgress(percentage) {
    // Por enquanto só logamos, mas podemos adicionar indicador visual
    if (percentage % 20 === 0) {
      // Log a cada 20%
      console.log(`📊 Loading: ${percentage}%`);
    }
  }

  /**
   * Handle de conclusão natural (por tempo)
   * @private
   */
  _handleNaturalCompletion() {
    console.log("⏰ Loading completado por tempo");

    // Aguardar um pouco antes de esconder
    setTimeout(() => {
      this.complete();
    }, this.config.delayBeforeHide * 1000);
  }

  /**
   * Completa o loading
   */
  complete() {
    this.stopAnimation();

    // Fade out
    this.hide({
      duration: this.config.fadeOutDuration,
      onComplete: () => {
        this._onLoadingComplete();
      },
    });
  }

  /**
   * Hook de conclusão do loading
   * @private
   */
  _onLoadingComplete() {
    // Notificar que o slider pode aparecer
    setTimeout(() => {
      const sliderWrapper = document.querySelector(SELECTORS.SLIDER_WRAPPER);
      if (sliderWrapper) {
        sliderWrapper.classList.add("loaded");
      }
    }, 500);

    // Callback de conclusão
    if (this.onComplete) {
      this.onComplete();
    }

    // Resolver promise de show
    if (this._showResolve) {
      this._showResolve();
      this._showResolve = null;
    }

    eventBus.emit(EVENTS.LOADING_COMPLETE);
  }

  /**
   * Propriedades de animação de show
   * @private
   */
  _getShowFromProps() {
    return {
      scale: 0.8,
    };
  }

  _getShowToProps() {
    return {
      scale: 1,
    };
  }

  /**
   * Propriedades de animação de hide
   * @private
   */
  _getHideToProps() {
    return {
      scale: 1.1,
    };
  }

  /**
   * Esconde com animação personalizada
   * @param {Object} options - Opções
   */
  hide(options = {}) {
    const defaultOptions = {
      duration: this.config.fadeOutDuration,
      ease: "power2.inOut",
    };

    const opts = { ...defaultOptions, ...options };

    gsap.to(this.element, {
      opacity: 0,
      scale: 1.1,
      duration: opts.duration,
      ease: opts.ease,
      onComplete: () => {
        this.isVisible = false;
        if (this.element && this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
        }
        this._onHidden();
        opts.onComplete?.();
      },
    });
  }

  /**
   * Cleanup na destruição
   * @private
   */
  _onDestroy() {
    this.stopAnimation();

    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    this.canvas = null;
    this.ctx = null;
    this.onComplete = null;
  }
}
