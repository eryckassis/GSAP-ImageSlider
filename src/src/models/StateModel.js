import { eventBus } from "../core/EventBus.js";
import { EVENTS } from "../utils/constants.js";
import {
  DEFAULT_EFFECT_SETTINGS,
  EFFECT_PRESETS,
  EFFECT_LIMITS,
} from "../config/effects.config.js";
import { EffectValidator, TimingValidator } from "../utils/validators.js";
import { ValidationUtils } from "../utils/helpers.js";

export class ConfigModel {
  constructor(initialConfig = {}) {
    // Mesclar configurações padrão com as fornecidas
    this._config = { ...DEFAULT_EFFECT_SETTINGS, ...initialConfig };
    this._isDirty = false; // Track de mudanças não salvas
    this._validationErrors = [];

    this._validateConfiguration();
  }

  /**
   * Obtém uma configuração específica
   * @param {string} key - Chave da configuração
   * @returns {any}
   */
  get(key) {
    return this._config[key];
  }

  /**
   * Define uma configuração específica
   * @param {string} key - Chave da configuração
   * @param {any} value - Valor da configuração
   */
  set(key, value) {
    if (this._config[key] === value) return; // Não mudou

    const oldValue = this._config[key];

    // Validação específica por tipo de propriedade
    if (!this._validateProperty(key, value)) {
      throw new Error(`Valor inválido para ${key}: ${value}`);
    }

    this._config[key] = value;
    this._isDirty = true;

    eventBus.emit(EVENTS.EFFECT_CHANGE, {
      property: key,
      oldValue,
      newValue: value,
      config: this.getAll(),
    });

    // Atualizar preset para "Custom" se uma propriedade específica foi alterada
    if (
      this._isEffectSpecificProperty(key) &&
      this._config.currentEffectPreset !== "Custom"
    ) {
      this._config.currentEffectPreset = "Custom";
      eventBus.emit(EVENTS.PRESET_CHANGE, {
        preset: "Custom",
        effect: this._config.currentEffect,
      });
    }
  }

  /**
   * Define múltiplas configurações de uma vez
   * @param {Object} configUpdates - Objeto com as configurações
   */
  setMultiple(configUpdates) {
    const oldConfig = { ...this._config };
    let hasChanges = false;

    // Validar todas as propriedades primeiro
    for (const [key, value] of Object.entries(configUpdates)) {
      if (!this._validateProperty(key, value)) {
        throw new Error(`Valor inválido para ${key}: ${value}`);
      }
    }

    // Aplicar todas as mudanças
    for (const [key, value] of Object.entries(configUpdates)) {
      if (this._config[key] !== value) {
        this._config[key] = value;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      this._isDirty = true;
      eventBus.emit(EVENTS.EFFECT_CHANGE, {
        oldConfig,
        newConfig: this.getAll(),
        isMultipleUpdate: true,
      });
    }
  }

  /**
   * Obtém todas as configurações
   * @returns {Object}
   */
  getAll() {
    return { ...this._config };
  }

  /**
   * Aplica um preset de efeito
   * @param {string} effectName - Nome do efeito
   * @param {string} presetName - Nome do preset
   */
  applyPreset(effectName, presetName) {
    const presets = EFFECT_PRESETS[effectName];
    if (!presets || !presets[presetName]) {
      throw new Error(
        `Preset ${presetName} não encontrado para efeito ${effectName}`
      );
    }

    const presetConfig = presets[presetName];

    // Atualizar o preset atual
    this._config.currentEffectPreset = presetName;

    // Aplicar configurações do preset
    this.setMultiple(presetConfig);

    eventBus.emit(EVENTS.PRESET_CHANGE, {
      effect: effectName,
      preset: presetName,
      config: presetConfig,
    });
  }

  /**
   * Randomiza configurações do efeito atual
   */
  randomizeCurrentEffect() {
    const currentEffect = this._config.currentEffect;
    const randomConfig = this._generateRandomConfig(currentEffect);

    this.setMultiple(randomConfig);
    this._config.currentEffectPreset = "Custom";

    eventBus.emit(EVENTS.PRESET_CHANGE, {
      effect: currentEffect,
      preset: "Custom",
      isRandomized: true,
    });
  }

  /**
   * Obtém os limites de uma propriedade
   * @param {string} property - Nome da propriedade
   * @returns {Object|null}
   */
  getPropertyLimits(property) {
    return EFFECT_LIMITS[property] || null;
  }

  /**
   * Valida se o valor está dentro dos limites permitidos
   * @param {string} property - Nome da propriedade
   * @param {any} value - Valor a validar
   * @returns {boolean}
   */
  _validateProperty(property, value) {
    const limits = this.getPropertyLimits(property);

    if (!limits) {
      // Se não há limites definidos, aceitar qualquer valor válido
      return ValidationUtils.isNumber(value);
    }

    return ValidationUtils.isInRange(value, limits.min, limits.max);
  }

  /**
   * Verifica se uma propriedade é específica de um efeito
   * @param {string} property - Nome da propriedade
   * @returns {boolean}
   */
  _isEffectSpecificProperty(property) {
    const globalProperties = [
      "currentEffect",
      "currentEffectPreset",
      "globalIntensity",
      "speedMultiplier",
      "distortionStrength",
      "colorEnhancement",
      "transitionDuration",
      "autoSlideSpeed",
    ];

    return !globalProperties.includes(property);
  }

  /**
   * Gera configuração randomizada para um efeito
   * @param {string} effectName - Nome do efeito
   * @returns {Object}
   */
  _generateRandomConfig(effectName) {
    const config = {
      globalIntensity: 0.5 + Math.random() * 1.5,
      speedMultiplier: 0.5 + Math.random() * 2.0,
      distortionStrength: 0.5 + Math.random() * 2.0,
      colorEnhancement: 0.7 + Math.random() * 1.3,
    };

    // Configurações específicas por efeito
    switch (effectName) {
      case "glass":
        Object.assign(config, {
          glassRefractionStrength: 0.5 + Math.random() * 2.0,
          glassChromaticAberration: 0.3 + Math.random() * 2.0,
          glassBubbleClarity: 0.5 + Math.random() * 1.5,
          glassEdgeGlow: Math.random() * 2.0,
          glassLiquidFlow: 0.3 + Math.random() * 2.5,
        });
        break;

      case "frost":
        Object.assign(config, {
          frostIntensity: 0.5 + Math.random() * 2.5,
          frostCrystalSize: 0.3 + Math.random() * 1.7,
          frostIceCoverage: 0.3 + Math.random() * 1.5,
          frostTemperature: 0.3 + Math.random() * 2.5,
          frostTexture: 0.5 + Math.random() * 1.5,
        });
        break;

      case "ripple":
        Object.assign(config, {
          rippleFrequency: 10.0 + Math.random() * 40.0,
          rippleAmplitude: 0.03 + Math.random() * 0.15,
          rippleWaveSpeed: 0.3 + Math.random() * 2.5,
          rippleRippleCount: 0.2 + Math.random() * 1.8,
          rippleDecay: 0.3 + Math.random() * 1.7,
        });
        break;

      case "plasma":
        Object.assign(config, {
          plasmaIntensity: 0.6 + Math.random() * 2.2,
          plasmaSpeed: 0.3 + Math.random() * 1.7,
          plasmaEnergyIntensity: Math.random(),
          plasmaContrastBoost: Math.random() * 0.8,
          plasmaTurbulence: 0.3 + Math.random() * 2.5,
        });
        break;

      case "timeshift":
        Object.assign(config, {
          timeshiftDistortion: 0.4 + Math.random() * 1.8,
          timeshiftBlur: 0.4 + Math.random() * 1.6,
          timeshiftFlow: 0.4 + Math.random() * 1.6,
          timeshiftChromatic: 0.3 + Math.random() * 1.7,
          timeshiftTurbulence: 0.4 + Math.random() * 1.6,
        });
        break;
    }

    return config;
  }

  /**
   * Valida toda a configuração
   */
  _validateConfiguration() {
    const effectValidation = EffectValidator.validate(this._config);
    const timingValidation = TimingValidator.validate({
      transitionDuration: this._config.transitionDuration,
      autoSlideSpeed: this._config.autoSlideSpeed,
    });

    this._validationErrors = [
      ...effectValidation.errors,
      ...timingValidation.errors,
    ];
  }

  /**
   * Retorna erros de validação
   * @returns {Array}
   */
  getValidationErrors() {
    return [...this._validationErrors];
  }

  /**
   * Verifica se a configuração é válida
   * @returns {boolean}
   */
  isValid() {
    return this._validationErrors.length === 0;
  }

  /**
   * Verifica se há mudanças não salvas
   * @returns {boolean}
   */
  isDirty() {
    return this._isDirty;
  }

  /**
   * Marca como salvo
   */
  markAsSaved() {
    this._isDirty = false;
  }

  /**
   * Reseta para configurações padrão
   */
  resetToDefaults() {
    const oldConfig = { ...this._config };
    this._config = { ...DEFAULT_EFFECT_SETTINGS };
    this._isDirty = true;

    eventBus.emit(EVENTS.EFFECT_CHANGE, {
      oldConfig,
      newConfig: this.getAll(),
      isReset: true,
    });
  }

  /**
   * Retorna dados para serialização
   * @returns {Object}
   */
  toJSON() {
    return {
      config: this.getAll(),
      isDirty: this._isDirty,
      validationErrors: this._validationErrors,
      isValid: this.isValid(),
    };
  }
}
