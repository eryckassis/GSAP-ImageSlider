// src/utils/EffectRandomizer.js

import { SLIDER_CONFIG } from "../config/slide.config";

/**
 * EFFECT RANDOMIZER
 * Responsabilidade: Criar combinações aleatórias de efeitos
 * Princípio: Single Responsibility
 */
export class EffectRandomizer {
  constructor() {
    this.effectTypes = ["glass", "frost", "ripple", "plasma", "timeshift"];
  }

  /**
   * Randomiza efeito e todas as configurações
   * @returns {string} - Nome do efeito randomizado
   */
  randomize() {
    const randomEffect = this._getRandomEffect();
    SLIDER_CONFIG.settings.currentEffect = randomEffect;

    // Randomiza configurações globais
    this._randomizeGlobalSettings();

    // Randomiza configurações específicas do efeito
    this._randomizeEffectSettings(randomEffect);

    // Marca como Custom
    SLIDER_CONFIG.settings.currentEffectPreset = "Custom";

    return randomEffect;
  }

  /**
   * Pega efeito aleatório
   */
  _getRandomEffect() {
    const randomIndex = Math.floor(Math.random() * this.effectTypes.length);
    return this.effectTypes[randomIndex];
  }

  /**
   * Randomiza configurações globais
   */
  _randomizeGlobalSettings() {
    SLIDER_CONFIG.settings.globalIntensity = this._randomRange(0.5, 2.0);
    SLIDER_CONFIG.settings.speedMultiplier = this._randomRange(0.5, 2.5);
    SLIDER_CONFIG.settings.distortionStrength = this._randomRange(0.5, 2.5);
    SLIDER_CONFIG.settings.colorEnhancement = this._randomRange(0.7, 1.8);
  }

  /**
   * Randomiza settings específicos de cada efeito
   */
  _randomizeEffectSettings(effectName) {
    switch (effectName) {
      case "glass":
        this._randomizeGlass();
        break;
      case "frost":
        this._randomizeFrost();
        break;
      case "ripple":
        this._randomizeRipple();
        break;
      case "plasma":
        this._randomizePlasma();
        break;
      case "timeshift":
        this._randomizeTimeshift();
        break;
    }
  }

  _randomizeGlass() {
    SLIDER_CONFIG.settings.glassRefractionStrength = this._randomRange(
      0.5,
      2.0
    );
    SLIDER_CONFIG.settings.glassChromaticAberration = this._randomRange(
      0.3,
      2.0
    );
    SLIDER_CONFIG.settings.glassBubbleClarity = this._randomRange(0.5, 1.5);
    SLIDER_CONFIG.settings.glassEdgeGlow = this._randomRange(0, 2.0);
    SLIDER_CONFIG.settings.glassLiquidFlow = this._randomRange(0.3, 2.5);
  }

  _randomizeFrost() {
    SLIDER_CONFIG.settings.frostIntensity = this._randomRange(0.5, 2.5);
    SLIDER_CONFIG.settings.frostCrystalSize = this._randomRange(0.3, 1.7);
    SLIDER_CONFIG.settings.frostIceCoverage = this._randomRange(0.3, 1.5);
    SLIDER_CONFIG.settings.frostTemperature = this._randomRange(0.3, 2.5);
    SLIDER_CONFIG.settings.frostTexture = this._randomRange(0.5, 1.5);
  }

  _randomizeRipple() {
    SLIDER_CONFIG.settings.rippleFrequency = this._randomRange(10.0, 50.0);
    SLIDER_CONFIG.settings.rippleAmplitude = this._randomRange(0.03, 0.18);
    SLIDER_CONFIG.settings.rippleWaveSpeed = this._randomRange(0.3, 2.5);
    SLIDER_CONFIG.settings.rippleRippleCount = this._randomRange(0.2, 1.8);
    SLIDER_CONFIG.settings.rippleDecay = this._randomRange(0.3, 1.7);
  }

  _randomizePlasma() {
    SLIDER_CONFIG.settings.plasmaIntensity = this._randomRange(0.6, 2.5);
    SLIDER_CONFIG.settings.plasmaSpeed = this._randomRange(0.3, 1.8);
    SLIDER_CONFIG.settings.plasmaEnergyIntensity = this._randomRange(0, 1.0);
    SLIDER_CONFIG.settings.plasmaContrastBoost = this._randomRange(0, 0.8);
    SLIDER_CONFIG.settings.plasmaTurbulence = this._randomRange(0.3, 2.5);
  }

  _randomizeTimeshift() {
    SLIDER_CONFIG.settings.timeshiftDistortion = this._randomRange(0.4, 2.5);
    SLIDER_CONFIG.settings.timeshiftBlur = this._randomRange(0.4, 2.5);
    SLIDER_CONFIG.settings.timeshiftFlow = this._randomRange(0.4, 2.5);
    SLIDER_CONFIG.settings.timeshiftChromatic = this._randomRange(0.3, 2.5);
    SLIDER_CONFIG.settings.timeshiftTurbulence = this._randomRange(0.4, 2.5);
  }

  /**
   * Helper: gera número aleatório no range
   */
  _randomRange(min, max) {
    return min + Math.random() * (max - min);
  }
}
