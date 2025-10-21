/**
 * Shader Service
 * Implementa Single Responsibility Principle
 * Responsável por renderização WebGL e gerenciamento de shaders
 */

import { eventBus } from "../core/EventBus.js";
import { EVENTS, RENDERING, SELECTORS } from "../utils/constants.js";
import { DeviceUtils } from "../utils/helpers.js";
import { EffectFactory } from "../effects/Effects.js";

export class ShaderService {
  constructor(slideModel, configModel, stateModel) {
    this.slideModel = slideModel;
    this.configModel = configModel;
    this.stateModel = stateModel;

    // Three.js components
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.mesh = null;
    this.material = null;
    this.geometry = null;

    // Canvas
    this.canvas = null;

    // Effect system
    this.currentEffect = null;
    this.effectManager = null;

    // Animation
    this.animationId = null;
    this.startTime = null;
    this.isRendering = false;

    // Resize handling
    this.resizeObserver = null;
    this.handleResize = this.handleResize.bind(this);
  }

  /**
   * Inicializa o renderer WebGL
   * @returns {Promise}
   */
  async initialize() {
    try {
      console.log("🎨 Inicializando Shader Service...");

      await this._setupCanvas();
      await this._setupRenderer();
      await this._setupScene();
      await this._setupMaterial();
      await this._setupResizeHandling();

      this.stateModel.set("rendererInitialized", true);

      // Iniciar loop de renderização
      this.startRenderLoop();

      console.log("✅ Shader Service inicializado!");

      eventBus.emit(EVENTS.RENDERER_INITIALIZED, {
        renderer: this.renderer,
        capabilities: this._getRendererCapabilities(),
      });
    } catch (error) {
      console.error("❌ Erro na inicialização do Shader Service:", error);
      this.stateModel.reportError(error, "shader-init");
      throw error;
    }
  }

  /**
   * Configura o canvas
   * @private
   */
  async _setupCanvas() {
    this.canvas = document.querySelector(SELECTORS.WEBGL_CANVAS);
    if (!this.canvas) {
      throw new Error("Canvas WebGL não encontrado");
    }

    // Configurar atributos do canvas
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /**
   * Configura o renderer
   * @private
   */
  async _setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: this.stateModel.get("performanceMode") === "high",
      alpha: false,
      powerPreference: "high-performance",
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(this.stateModel.get("pixelRatio"));

    // Configurações de qualidade baseadas no modo de performance
    const performanceMode = this.stateModel.get("performanceMode");
    this._configureQualitySettings(performanceMode);
  }

  /**
   * Configura a cena
   * @private
   */
  async _setupScene() {
    this.scene = new THREE.Scene();

    // Câmera ortográfica para efeito fullscreen
    const { left, right, top, bottom, near, far } = RENDERING.CAMERA_BOUNDS;
    this.camera = new THREE.OrthographicCamera(
      left,
      right,
      top,
      bottom,
      near,
      far
    );

    // Geometria do plano
    this.geometry = new THREE.PlaneGeometry(
      RENDERING.GEOMETRY_SIZE,
      RENDERING.GEOMETRY_SIZE
    );
  }

  /**
   * Configura o material e shaders
   * @private
   */
  async _setupMaterial() {
    const vertexShader = this._getVertexShader();
    const fragmentShader = this._getFragmentShader();

    this.material = new THREE.ShaderMaterial({
      uniforms: this._createUniforms(),
      vertexShader,
      fragmentShader,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    // Configurar efeito inicial
    this._setupInitialEffect();
  }

  /**
   * Cria uniforms do shader
   * @private
   */
  _createUniforms() {
    return {
      // Texturas
      uTexture1: { value: null },
      uTexture2: { value: null },

      // Tamanhos das texturas
      uTexture1Size: { value: new THREE.Vector2(1, 1) },
      uTexture2Size: { value: new THREE.Vector2(1, 1) },

      // Controle de transição
      uProgress: { value: 0.0 },
      uTime: { value: 0.0 },

      // Resolução da tela
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },

      // Tipo de efeito
      uEffectType: { value: 0 },

      // Uniforms globais (serão adicionados dinamicamente)
      ...this._getGlobalUniforms(),
    };
  }

  /**
   * Obtém uniforms globais das configurações
   * @private
   */
  _getGlobalUniforms() {
    const config = this.configModel.getAll();

    return {
      uGlobalIntensity: { value: config.globalIntensity },
      uSpeedMultiplier: { value: config.speedMultiplier },
      uDistortionStrength: { value: config.distortionStrength },
      uColorEnhancement: { value: config.colorEnhancement },
    };
  }

  /**
   * Configura efeito inicial
   * @private
   */
  _setupInitialEffect() {
    const currentEffectName = this.configModel.get("currentEffect");
    this.switchEffect(currentEffectName);
  }

  /**
   * Troca o efeito atual
   * @param {string} effectName - Nome do efeito
   */
  switchEffect(effectName) {
    try {
      // Criar novo efeito
      const effectConfig = this.configModel.getAll();
      const newEffect = EffectFactory.createEffect(effectName, effectConfig);

      // Atualizar uniforms do material com os do efeito
      const effectUniforms = newEffect.getUniforms();
      Object.assign(this.material.uniforms, effectUniforms);

      // Atualizar tipo de efeito no shader
      const effectType = EffectFactory.getEffectType(effectName);
      this.material.uniforms.uEffectType.value = effectType;

      // Atualizar fragment shader se necessário
      this._updateFragmentShader();

      this.currentEffect = newEffect;

      console.log(`🎨 Efeito trocado para: ${effectName}`);

      eventBus.emit(EVENTS.EFFECT_SWITCHED, {
        effectName,
        effectType,
        uniforms: effectUniforms,
      });
    } catch (error) {
      console.error("❌ Erro ao trocar efeito:", error);
      this.stateModel.reportError(error, "effect-switch");
    }
  }

  /**
   * Atualiza configurações do efeito atual
   * @param {Object} config - Nova configuração
   */
  updateEffectConfig(config) {
    if (!this.currentEffect) return;

    // Atualizar configuração do efeito
    this.currentEffect.updateConfig(config);

    // Atualizar uniforms do material
    const effectUniforms = this.currentEffect.getUniforms();
    Object.assign(this.material.uniforms, effectUniforms);
  }

  /**
   * Inicia transição entre slides
   * @param {THREE.Texture} fromTexture - Textura atual
   * @param {THREE.Texture} toTexture - Nova textura
   * @param {number} duration - Duração em segundos
   * @returns {Promise}
   */
  startTransition(fromTexture, toTexture, duration = 2.5) {
    return new Promise((resolve) => {
      if (!fromTexture || !toTexture) {
        console.warn("Texturas inválidas para transição");
        return resolve();
      }

      // Configurar texturas
      this.material.uniforms.uTexture1.value = fromTexture;
      this.material.uniforms.uTexture2.value = toTexture;
      this.material.uniforms.uTexture1Size.value = fromTexture.userData.size;
      this.material.uniforms.uTexture2Size.value = toTexture.userData.size;

      // Animar progresso com GSAP
      gsap.fromTo(
        this.material.uniforms.uProgress,
        {
          value: 0,
        },
        {
          value: 1,
          duration,
          ease: "power2.inOut",
          onComplete: () => {
            // Trocar texturas após transição
            this.material.uniforms.uProgress.value = 0;
            this.material.uniforms.uTexture1.value = toTexture;
            this.material.uniforms.uTexture1Size.value =
              toTexture.userData.size;

            resolve();
          },
        }
      );

      eventBus.emit(EVENTS.TRANSITION_START, {
        fromTexture,
        toTexture,
        duration,
      });
    });
  }

  /**
   * Inicia o loop de renderização
   */
  startRenderLoop() {
    if (this.isRendering) return;

    this.isRendering = true;
    this.startTime = Date.now();
    this._render();

    console.log("🎬 Loop de renderização iniciado");
  }

  /**
   * Para o loop de renderização
   */
  stopRenderLoop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    this.isRendering = false;
    console.log("⏸️ Loop de renderização pausado");
  }

  /**
   * Loop principal de renderização
   * @private
   */
  _render() {
    if (!this.isRendering) return;

    // Atualizar tempo
    const currentTime = (Date.now() - this.startTime) / 1000;
    if (this.material.uniforms.uTime) {
      this.material.uniforms.uTime.value = currentTime;
    }

    // Atualizar efeito atual
    if (this.currentEffect) {
      this.currentEffect.updateTime(currentTime);
    }

    // Renderizar
    this.renderer.render(this.scene, this.camera);

    // Próximo frame
    this.animationId = requestAnimationFrame(() => this._render());
  }

  /**
   * Configura handling de resize
   * @private
   */
  _setupResizeHandling() {
    // ResizeObserver para performance melhor
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === this.canvas) {
            this.handleResize();
          }
        }
      });
      this.resizeObserver.observe(this.canvas);
    } else {
      // Fallback para window resize
      window.addEventListener("resize", this.handleResize);
    }
  }

  /**
   * Handle resize da janela
   */
  handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Atualizar renderer
    this.renderer.setSize(width, height);

    // Atualizar uniform de resolução
    this.material.uniforms.uResolution.value.set(width, height);

    // Atualizar canvas
    this.canvas.width = width;
    this.canvas.height = height;

    console.log(`📐 Resize: ${width}x${height}`);

    eventBus.emit(EVENTS.RENDERER_RESIZE, { width, height });
  }

  /**
   * Configura qualidade baseada no modo de performance
   * @private
   */
  _configureQualitySettings(mode) {
    switch (mode) {
      case "high":
        this.renderer.antialias = true;
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        break;

      case "medium":
        this.renderer.antialias = false;
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        break;

      case "low":
        this.renderer.antialias = false;
        this.renderer.setPixelRatio(1);
        break;

      case "auto":
      default:
        const isMobile = DeviceUtils.isMobile();
        this.renderer.antialias = !isMobile;
        this.renderer.setPixelRatio(
          isMobile ? 1 : Math.min(window.devicePixelRatio, 2)
        );
        break;
    }
  }

  /**
   * Obtém vertex shader
   * @private
   */
  _getVertexShader() {
    return `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
  }

  /**
   * Obtém fragment shader completo
   * @private
   */
  _getFragmentShader() {
    return `
      uniform sampler2D uTexture1;
      uniform sampler2D uTexture2;
      uniform float uProgress;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uTexture1Size;
      uniform vec2 uTexture2Size;
      uniform int uEffectType;
      
      // Global uniforms
      uniform float uGlobalIntensity;
      uniform float uSpeedMultiplier;
      uniform float uDistortionStrength;
      uniform float uColorEnhancement;
      
      // Effect-specific uniforms (adicionados dinamicamente)
      
      varying vec2 vUv;

      // Função para cover UV
      vec2 getCoverUV(vec2 uv, vec2 textureSize) {
        vec2 s = uResolution / textureSize;
        float scale = max(s.x, s.y);
        vec2 scaledSize = textureSize * scale;
        vec2 offset = (uResolution - scaledSize) * 0.5;
        return (uv * uResolution - offset) / scaledSize;
      }

      // Função de noise
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        return mix(
          mix(noise(i), noise(i + vec2(1.0, 0.0)), f.x),
          mix(noise(i + vec2(0.0, 1.0)), noise(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }

      float rand(vec2 uv) {
        float a = dot(uv, vec2(92., 80.));
        float b = dot(uv, vec2(41., 62.));
        float x = sin(a) + cos(b) * 51.;
        return fract(x);
      }

      // Effects serão inseridos aqui dinamicamente
      ${this._getAllEffectShaders()}

      void main() {
        // Decidir qual efeito usar baseado no uEffectType
        if (uEffectType == 0) {
          gl_FragColor = glassEffect(vUv, uProgress);
        } else if (uEffectType == 1) {
          gl_FragColor = frostEffect(vUv, uProgress);
        } else if (uEffectType == 2) {
          gl_FragColor = rippleEffect(vUv, uProgress);
        } else if (uEffectType == 3) {
          gl_FragColor = plasmaEffect(vUv, uProgress);
        } else {
          gl_FragColor = timeshiftEffect(vUv, uProgress);
        }
      }
    `;
  }

  /**
   * Obtém todos os shaders dos efeitos
   * @private
   */
  _getAllEffectShaders() {
    // Para cada efeito, obter seu fragment shader
    const effects = EffectFactory.getAvailableEffects();
    let allShaders = "";

    effects.forEach((effectName) => {
      try {
        const effect = EffectFactory.createEffect(effectName);
        allShaders += effect.getFragmentShader() + "\n\n";
      } catch (error) {
        console.warn(`Erro ao obter shader do efeito ${effectName}:`, error);
      }
    });

    return allShaders;
  }

  /**
   * Atualiza fragment shader (se necessário)
   * @private
   */
  _updateFragmentShader() {
    // Em casos onde precisamos recompilar o shader
    // Por enquanto não é necessário, mas deixo preparado
  }

  /**
   * Obtém capacidades do renderer
   * @private
   */
  _getRendererCapabilities() {
    const gl = this.renderer.getContext();

    return {
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
      maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
      maxFragmentUniforms: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
      extensions: this.renderer.extensions.get("WEBGL_debug_renderer_info")
        ? {
            vendor: gl.getParameter(
              gl.getExtension("WEBGL_debug_renderer_info").UNMASKED_VENDOR_WEBGL
            ),
            renderer: gl.getParameter(
              gl.getExtension("WEBGL_debug_renderer_info")
                .UNMASKED_RENDERER_WEBGL
            ),
          }
        : null,
    };
  }

  /**
   * Obtém estatísticas de performance
   */
  getPerformanceStats() {
    return {
      drawCalls: this.renderer.info.render.calls,
      triangles: this.renderer.info.render.triangles,
      textures: this.renderer.info.memory.textures,
      geometries: this.renderer.info.memory.geometries,
      programs: this.renderer.info.programs?.length || 0,
    };
  }

  /**
   * Destrói o service
   */
  destroy() {
    // Parar renderização
    this.stopRenderLoop();

    // Remover resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    } else {
      window.removeEventListener("resize", this.handleResize);
    }

    // Limpar Three.js objects
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
    if (this.renderer) this.renderer.dispose();

    // Limpar referências
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.mesh = null;
    this.material = null;
    this.geometry = null;
    this.currentEffect = null;

    console.log("🧹 ShaderService destruído");
  }
}
