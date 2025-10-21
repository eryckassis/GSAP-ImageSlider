import { VALIDATION, EFFECT_NAMES } from "./constants.js";
import { ValidationUtils } from "./helpers.js";

/**
 * Validador de configurações de slides
 */
export class SlideValidator {
  static validate(slides) {
    const errors = [];

    if (!Array.isArray(slides)) {
      errors.push("Slides deve ser um array");
      return { isValid: false, errors };
    }

    if (slides.length < VALIDATION.MIN_SLIDES) {
      errors.push(`Mínimo de ${VALIDATION.MIN_SLIDES} slides necessário`);
    }

    if (slides.length > VALIDATION.MAX_SLIDES) {
      errors.push(`Máximo de ${VALIDATION.MAX_SLIDES} slides permitido`);
    }

    slides.forEach((slide, index) => {
      if (!slide.title || typeof slide.title !== "string") {
        errors.push(`Slide ${index + 1}: título inválido`);
      }

      if (!slide.media || !ValidationUtils.isValidUrl(slide.media)) {
        errors.push(`Slide ${index + 1}: URL da imagem inválida`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Validador de configurações de efeitos
 */
export class EffectValidator {
  static validate(effectConfig) {
    const errors = [];

    // Validar configurações globais
    if (!ValidationUtils.isPositiveNumber(effectConfig.globalIntensity)) {
      errors.push("globalIntensity deve ser um número positivo");
    }

    if (!ValidationUtils.isPositiveNumber(effectConfig.speedMultiplier)) {
      errors.push("speedMultiplier deve ser um número positivo");
    }

    // Validar efeito atual
    if (!Object.values(EFFECT_NAMES).includes(effectConfig.currentEffect)) {
      errors.push("currentEffect deve ser um efeito válido");
    }

    // Validações específicas por efeito
    const effectValidators = {
      [EFFECT_NAMES.GLASS]: this._validateGlassEffect,
      [EFFECT_NAMES.FROST]: this._validateFrostEffect,
      [EFFECT_NAMES.RIPPLE]: this._validateRippleEffect,
      [EFFECT_NAMES.PLASMA]: this._validatePlasmaEffect,
      [EFFECT_NAMES.TIMESHIFT]: this._validateTimeshiftEffect,
    };

    const validator = effectValidators[effectConfig.currentEffect];
    if (validator) {
      const effectErrors = validator(effectConfig);
      errors.push(...effectErrors);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static _validateGlassEffect(config) {
    const errors = [];
    const glassProps = [
      "glassRefractionStrength",
      "glassChromaticAberration",
      "glassBubbleClarity",
      "glassEdgeGlow",
      "glassLiquidFlow",
    ];

    glassProps.forEach((prop) => {
      if (!ValidationUtils.isPositiveNumber(config[prop])) {
        errors.push(`${prop} deve ser um número positivo`);
      }
    });

    return errors;
  }

  static _validateFrostEffect(config) {
    const errors = [];
    const frostProps = [
      "frostIntensity",
      "frostCrystalSize",
      "frostIceCoverage",
      "frostTemperature",
      "frostTexture",
    ];

    frostProps.forEach((prop) => {
      if (!ValidationUtils.isPositiveNumber(config[prop])) {
        errors.push(`${prop} deve ser um número positivo`);
      }
    });

    // Validações específicas do frost
    if (config.frostIceCoverage > 2.5) {
      errors.push("frostIceCoverage não pode ser maior que 2.5");
    }

    return errors;
  }

  static _validateRippleEffect(config) {
    const errors = [];

    if (!ValidationUtils.isInRange(config.rippleFrequency, 10, 50)) {
      errors.push("rippleFrequency deve estar entre 10 and 50");
    }

    if (!ValidationUtils.isInRange(config.rippleAmplitude, 0.02, 0.2)) {
      errors.push("rippleAmplitude deve estar entre 0.02 and 0.2");
    }

    return errors;
  }

  static _validatePlasmaEffect(config) {
    const errors = [];
    const plasmaProps = ["plasmaIntensity", "plasmaSpeed", "plasmaTurbulence"];

    plasmaProps.forEach((prop) => {
      if (!ValidationUtils.isPositiveNumber(config[prop])) {
        errors.push(`${prop} deve ser um número positivo`);
      }
    });

    if (!ValidationUtils.isInRange(config.plasmaEnergyIntensity, 0, 1)) {
      errors.push("plasmaEnergyIntensity deve estar entre 0 and 1");
    }

    if (!ValidationUtils.isInRange(config.plasmaContrastBoost, 0, 1)) {
      errors.push("plasmaContrastBoost deve estar entre 0 and 1");
    }

    return errors;
  }

  static _validateTimeshiftEffect(config) {
    const errors = [];
    const timeshiftProps = [
      "timeshiftDistortion",
      "timeshiftBlur",
      "timeshiftFlow",
      "timeshiftChromatic",
      "timeshiftTurbulence",
    ];

    timeshiftProps.forEach((prop) => {
      if (!ValidationUtils.isPositiveNumber(config[prop])) {
        errors.push(`${prop} deve ser um número positivo`);
      }
    });

    return errors;
  }
}

/**
 * Validador de configurações de timing
 */
export class TimingValidator {
  static validate(timingConfig) {
    const errors = [];

    if (!ValidationUtils.isInRange(timingConfig.transitionDuration, 0.5, 10)) {
      errors.push("transitionDuration deve estar entre 0.5 and 10 segundos");
    }

    if (!ValidationUtils.isInRange(timingConfig.autoSlideSpeed, 1000, 30000)) {
      errors.push("autoSlideSpeed deve estar entre 1000 and 30000ms");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export class EnvironmentValidator {
  static validate() {
    const errors = [];
    const warnings = [];

    // Verificar WebGL
    if (!this._hasWebGLSupport()) {
      errors.push("WebGL não é suportado neste navegador");
    }

    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 2) {
      warnings.push("Dispositivo com baixo poder de processamento detectado");
    }

    if (navigator.deviceMemory && navigator.deviceMemory < 2) {
      warnings.push("Pouca memória RAM detectada");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  static _hasWebGLSupport() {
    try {
      const canvas = document.createElement("canvas");
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
    } catch (e) {
      return false;
    }
  }
}
