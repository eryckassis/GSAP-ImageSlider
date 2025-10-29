import './style.css';
import * as THREE from 'three';
import { SLIDES_DATA } from './config/slide.config.js';
import { ShaderManager } from './core/ShaderManager.js';
import { SlideTextureLoader } from './core/TextureLoader.js';
import { TransitionManager } from './core/TransitionManager.js';
import { NavigationController } from './core/NavigationController.js';
import { UIController } from './core/UIController.js';
import { EffectRandomizer } from './utils/Randomizer.js';

class SliderLoadingManager {
  constructor() {
    this.overlay = null;
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.startTime = null;
    this.duration = 3000;
    this.createLoadingScreen();
  }

  createLoadingScreen() {
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000000;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;

    this.canvas = document.createElement('canvas');
    this.canvas.width = 300;
    this.canvas.height = 300;

    this.ctx = this.canvas.getContext('2d');
    this.overlay.appendChild(this.canvas);
    document.body.appendChild(this.overlay);

    this.startAnimation();
  }

  startAnimation() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    let time = 0;
    let lastTime = 0;

    const dotRings = [
      { radius: 20, count: 8 },
      { radius: 35, count: 12 },
      { radius: 50, count: 16 },
      { radius: 65, count: 20 },
      { radius: 80, count: 24 },
    ];

    const colors = {
      primary: '#ffffffff',
      accent: '#dddddd',
    };

    const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const smoothstep = (edge0, edge1, x) => {
      const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
      return t * t * (3 - 2 * t);
    };

    const hexToRgb = (hex) => {
      if (hex.startsWith('#')) {
        return [
          parseInt(hex.slice(1, 3), 16),
          parseInt(hex.slice(3, 5), 16),
          parseInt(hex.slice(5, 7), 16),
        ];
      }
      const match = hex.match(/\d+/g);
      return match ? [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])] : [255, 255, 255];
    };

    const interpolateColor = (color1, color2, t, opacity = 1) => {
      const rgb1 = hexToRgb(color1);
      const rgb2 = hexToRgb(color2);
      const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * t);
      const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * t);
      const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * t);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    const animate = (timestamp) => {
      if (!this.startTime) {
        this.startTime = timestamp;
      }
      if (!lastTime) {
        lastTime = timestamp;
      }

      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      time += deltaTime * 0.001;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      const rgb = hexToRgb(colors.primary);
      this.ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.9)`;
      this.ctx.fill();

      dotRings.forEach((ring, ringIndex) => {
        for (let i = 0; i < ring.count; i++) {
          const angle = (i / ring.count) * Math.PI * 2;
          const pulseTime = time * 2 - ringIndex * 0.4;
          const radiusPulse = easeInOutSine((Math.sin(pulseTime) + 1) / 2) * 6 - 3;
          const x = centerX + Math.cos(angle) * (ring.radius + radiusPulse);
          const y = centerY + Math.sin(angle) * (ring.radius + radiusPulse);

          const opacityPhase = (Math.sin(pulseTime + i * 0.2) + 1) / 2;
          const opacityBase = 0.3 + easeInOutSine(opacityPhase) * 0.7;
          const highlightPhase = (Math.sin(pulseTime) + 1) / 2;
          const highlightIntensity = easeInOutCubic(highlightPhase);

          this.ctx.beginPath();
          this.ctx.arc(x, y, 2, 0, Math.PI * 2);
          const colorBlend = smoothstep(0.2, 0.8, highlightIntensity);
          this.ctx.fillStyle = interpolateColor(
            colors.primary,
            colors.accent,
            colorBlend,
            opacityBase
          );
          this.ctx.fill();
        }
      });

      if (timestamp - this.startTime >= this.duration) {
        this.complete();
        return;
      }

      this.animationId = requestAnimationFrame(animate);
    };

    this.animationId = requestAnimationFrame(animate);
  }

  complete() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    if (this.overlay) {
      this.overlay.style.opacity = '0';
      this.overlay.style.transition = 'opacity 0.8s ease';
      setTimeout(() => {
        this.overlay?.remove();
        setTimeout(() => {
          const sliderWrapper = document.querySelector('.slider-wrapper');
          if (sliderWrapper) {
            sliderWrapper.classList.add('loaded');
          }
        }, 500);
      }, 800);
    }
  }
}

class SliderApplication {
  constructor() {
    this.renderer = null;
    this.scene = null;
    this.camera = null;

    this.shaderManager = null;
    this.textureLoader = null;
    this.transitionManager = null;
    this.navigationController = null;
    this.uiController = null;
    this.effectRandomizer = null;
  }

  async init() {
    console.log('🚀 Initializing Slider Application...');

    this._createModules();

    await this._setupThreeJS();

    await this._loadTextures();

    this._setupUI();

    this._start();

    console.log('✅ Slider Application Ready!');
  }

  _createModules() {
    this.shaderManager = new ShaderManager();
    this.textureLoader = new SlideTextureLoader();
    this.effectRandomizer = new EffectRandomizer();

    this.transitionManager = new TransitionManager(this.shaderManager);

    this.navigationController = new NavigationController(
      this.textureLoader,
      this.transitionManager
    );

    this.uiController = new UIController(
      this.shaderManager,
      (effect) => this._onEffectChange(effect),
      () => this._onRandomize()
    );
  }

  async _setupThreeJS() {
    const canvas = document.querySelector('.webgl-canvas');
    if (!canvas) {
      throw new Error('Canvas .webgl-canvas not found');
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const material = this.shaderManager.createMaterial();

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);

    window.addEventListener('resize', () => this._onResize());

    this._startRenderLoop();
  }

  async _loadTextures() {
    console.log('📦 Loading textures...');

    const textures = await this.textureLoader.loadAllTextures(SLIDES_DATA);

    if (textures.length < 2) {
      throw new Error('Not enough textures loaded');
    }

    this.shaderManager.updateTextures(textures[0], textures[1]);

    console.log(`✅ Loaded ${textures.length} textures`);
  }

  _setupUI() {
    this.navigationController.createNavigationUI();
  }

  _start() {
    this.navigationController.start();
  }

  _startRenderLoop() {
    const render = () => {
      requestAnimationFrame(render);
      this.renderer.render(this.scene, this.camera);
    };
    render();
  }

  _onEffectChange(effectName) {
    console.log(`🎨 Effect changed to: ${effectName}`);
  }

  _onRandomize() {
    const effect = this.effectRandomizer.randomize();
    this.shaderManager.setEffectType(effect);
    this.shaderManager.updateUniforms();
    this.uiController.refresh();
    console.log(`🎲 Randomized to: ${effect}`);
  }

  _onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.setSize(width, height);
    this.shaderManager.updateResolution(width, height);
  }

  dispose() {
    this.navigationController.dispose();
    this.uiController.dispose();
    this.textureLoader.dispose();

    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  const _loadingManager = new SliderLoadingManager();

  await new Promise((resolve) => setTimeout(resolve, 500));

  const app = new SliderApplication();

  try {
    await app.init();
  } catch (error) {
    console.error('❌ Failed to initialize slider:', error);
  }
});
