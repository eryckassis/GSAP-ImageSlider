import { TIMING, EFFECT_NAMES } from "../utils/constants.js";

/**
 * Configurações padrão dos efeitos
 */
export const DEFAULT_EFFECT_SETTINGS = {
  // Configurações globais
  currentEffect: EFFECT_NAMES.GLASS,
  currentEffectPreset: "Default",
  globalIntensity: 1.0,
  speedMultiplier: 1.0,
  distortionStrength: 1.0,
  colorEnhancement: 1.0,

  // Configurações de timing
  transitionDuration: TIMING.DEFAULT_TRANSITION_DURATION,
  autoSlideSpeed: TIMING.DEFAULT_AUTO_SLIDE_SPEED,

  // Glass Effect Settings
  glassRefractionStrength: 1.0,
  glassChromaticAberration: 1.0,
  glassBubbleClarity: 1.0,
  glassEdgeGlow: 1.0,
  glassLiquidFlow: 1.0,

  // Frost Effect Settings
  frostIntensity: 1.5,
  frostCrystalSize: 1.0,
  frostIceCoverage: 1.0,
  frostTemperature: 1.0,
  frostTexture: 1.0,

  // Ripple Effect Settings
  rippleFrequency: 25.0,
  rippleAmplitude: 0.08,
  rippleWaveSpeed: 1.0,
  rippleRippleCount: 1.0,
  rippleDecay: 1.0,

  // Plasma Effect Settings
  plasmaIntensity: 1.2,
  plasmaSpeed: 0.8,
  plasmaEnergyIntensity: 0.4,
  plasmaContrastBoost: 0.3,
  plasmaTurbulence: 1.0,

  // Timeshift Effect Settings
  timeshiftDistortion: 1.6,
  timeshiftBlur: 1.5,
  timeshiftFlow: 1.4,
  timeshiftChromatic: 1.5,
  timeshiftTurbulence: 1.4,
};

/**
 * Presets para cada efeito
 */
export const EFFECT_PRESETS = {
  [EFFECT_NAMES.GLASS]: {
    Subtle: {
      glassRefractionStrength: 0.6,
      glassChromaticAberration: 0.5,
      glassBubbleClarity: 1.3,
      glassEdgeGlow: 0.7,
      glassLiquidFlow: 0.8,
    },
    Default: {
      glassRefractionStrength: 1.0,
      glassChromaticAberration: 1.0,
      glassBubbleClarity: 1.0,
      glassEdgeGlow: 1.0,
      glassLiquidFlow: 1.0,
    },
    Crystal: {
      glassRefractionStrength: 1.5,
      glassChromaticAberration: 1.8,
      glassBubbleClarity: 0.7,
      glassEdgeGlow: 1.4,
      glassLiquidFlow: 0.5,
    },
    Liquid: {
      glassRefractionStrength: 0.8,
      glassChromaticAberration: 0.4,
      glassBubbleClarity: 1.2,
      glassEdgeGlow: 0.8,
      glassLiquidFlow: 1.8,
    },
  },

  [EFFECT_NAMES.FROST]: {
    Light: {
      frostIntensity: 0.8,
      frostCrystalSize: 1.3,
      frostIceCoverage: 0.6,
      frostTemperature: 0.7,
      frostTexture: 0.8,
    },
    Default: {
      frostIntensity: 1.5,
      frostCrystalSize: 1.0,
      frostIceCoverage: 1.0,
      frostTemperature: 1.0,
      frostTexture: 1.0,
    },
    Heavy: {
      frostIntensity: 2.2,
      frostCrystalSize: 0.7,
      frostIceCoverage: 1.4,
      frostTemperature: 1.5,
      frostTexture: 1.3,
    },
    Arctic: {
      frostIntensity: 2.8,
      frostCrystalSize: 0.5,
      frostIceCoverage: 1.8,
      frostTemperature: 2.0,
      frostTexture: 1.6,
    },
  },

  [EFFECT_NAMES.RIPPLE]: {
    Gentle: {
      rippleFrequency: 15.0,
      rippleAmplitude: 0.05,
      rippleWaveSpeed: 0.7,
      rippleRippleCount: 0.8,
      rippleDecay: 1.2,
    },
    Default: {
      rippleFrequency: 25.0,
      rippleAmplitude: 0.08,
      rippleWaveSpeed: 1.0,
      rippleRippleCount: 1.0,
      rippleDecay: 1.0,
    },
    Strong: {
      rippleFrequency: 35.0,
      rippleAmplitude: 0.12,
      rippleWaveSpeed: 1.4,
      rippleRippleCount: 1.3,
      rippleDecay: 0.8,
    },
    Tsunami: {
      rippleFrequency: 45.0,
      rippleAmplitude: 0.18,
      rippleWaveSpeed: 1.8,
      rippleRippleCount: 1.6,
      rippleDecay: 0.6,
    },
  },

  [EFFECT_NAMES.PLASMA]: {
    Calm: {
      plasmaIntensity: 0.8,
      plasmaSpeed: 0.5,
      plasmaEnergyIntensity: 0.2,
      plasmaContrastBoost: 0.1,
      plasmaTurbulence: 0.6,
    },
    Default: {
      plasmaIntensity: 1.2,
      plasmaSpeed: 0.8,
      plasmaEnergyIntensity: 0.4,
      plasmaContrastBoost: 0.3,
      plasmaTurbulence: 1.0,
    },
    Storm: {
      plasmaIntensity: 1.8,
      plasmaSpeed: 1.3,
      plasmaEnergyIntensity: 0.7,
      plasmaContrastBoost: 0.5,
      plasmaTurbulence: 1.5,
    },
    Nuclear: {
      plasmaIntensity: 2.5,
      plasmaSpeed: 1.8,
      plasmaEnergyIntensity: 1.0,
      plasmaContrastBoost: 0.8,
      plasmaTurbulence: 2.0,
    },
  },

  [EFFECT_NAMES.TIMESHIFT]: {
    Subtle: {
      timeshiftDistortion: 0.5,
      timeshiftBlur: 0.6,
      timeshiftFlow: 0.5,
      timeshiftChromatic: 0.4,
      timeshiftTurbulence: 0.6,
    },
    Default: {
      timeshiftDistortion: 1.6,
      timeshiftBlur: 1.5,
      timeshiftFlow: 1.4,
      timeshiftChromatic: 1.5,
      timeshiftTurbulence: 1.4,
    },
    Intense: {
      timeshiftDistortion: 2.2,
      timeshiftBlur: 2.0,
      timeshiftFlow: 2.0,
      timeshiftChromatic: 2.2,
      timeshiftTurbulence: 2.0,
    },
    Dreamlike: {
      timeshiftDistortion: 2.8,
      timeshiftBlur: 2.5,
      timeshiftFlow: 2.5,
      timeshiftChromatic: 2.6,
      timeshiftTurbulence: 2.5,
    },
  },
};

/**
 * Limites de valores para cada propriedade (para validação e UI)
 */
export const EFFECT_LIMITS = {
  // Global limits
  globalIntensity: { min: 0.1, max: 2.0, step: 0.1 },
  speedMultiplier: { min: 0.1, max: 3.0, step: 0.1 },
  distortionStrength: { min: 0.1, max: 3.0, step: 0.1 },
  colorEnhancement: { min: 0.5, max: 2.0, step: 0.1 },

  // Timing limits
  transitionDuration: { min: 0.5, max: 5.0, step: 0.1 },
  autoSlideSpeed: { min: 2000, max: 10000, step: 500 },

  // Glass limits
  glassRefractionStrength: { min: 0.1, max: 3.0, step: 0.1 },
  glassChromaticAberration: { min: 0.1, max: 3.0, step: 0.1 },
  glassBubbleClarity: { min: 0.1, max: 2.0, step: 0.1 },
  glassEdgeGlow: { min: 0.0, max: 2.0, step: 0.1 },
  glassLiquidFlow: { min: 0.1, max: 3.0, step: 0.1 },

  // Frost limits
  frostIntensity: { min: 0.5, max: 3.0, step: 0.1 },
  frostCrystalSize: { min: 0.3, max: 2.0, step: 0.1 },
  frostIceCoverage: { min: 0.1, max: 2.0, step: 0.1 },
  frostTemperature: { min: 0.1, max: 3.0, step: 0.1 },
  frostTexture: { min: 0.3, max: 2.0, step: 0.1 },

  // Ripple limits
  rippleFrequency: { min: 10.0, max: 50.0, step: 1.0 },
  rippleAmplitude: { min: 0.02, max: 0.2, step: 0.01 },
  rippleWaveSpeed: { min: 0.2, max: 3.0, step: 0.1 },
  rippleRippleCount: { min: 0.1, max: 2.0, step: 0.1 },
  rippleDecay: { min: 0.2, max: 2.0, step: 0.1 },

  // Plasma limits
  plasmaIntensity: { min: 0.5, max: 3.0, step: 0.1 },
  plasmaSpeed: { min: 0.2, max: 2.0, step: 0.1 },
  plasmaEnergyIntensity: { min: 0.0, max: 1.0, step: 0.05 },
  plasmaContrastBoost: { min: 0.0, max: 1.0, step: 0.05 },
  plasmaTurbulence: { min: 0.1, max: 3.0, step: 0.1 },

  // Timeshift limits
  timeshiftDistortion: { min: 0.3, max: 3.0, step: 0.1 },
  timeshiftBlur: { min: 0.3, max: 3.0, step: 0.1 },
  timeshiftFlow: { min: 0.3, max: 3.0, step: 0.1 },
  timeshiftChromatic: { min: 0.0, max: 3.0, step: 0.1 },
  timeshiftTurbulence: { min: 0.3, max: 3.0, step: 0.1 },
};

/**
 * Configurações de randomização
 */
export const RANDOMIZATION_CONFIG = {
  globalIntensity: { min: 0.5, max: 2.0 },
  speedMultiplier: { min: 0.5, max: 2.0 },
  distortionStrength: { min: 0.5, max: 2.0 },
  colorEnhancement: { min: 0.7, max: 2.0 },

  [EFFECT_NAMES.GLASS]: {
    glassRefractionStrength: { min: 0.5, max: 2.0 },
    glassChromaticAberration: { min: 0.3, max: 2.3 },
    glassBubbleClarity: { min: 0.5, max: 2.0 },
    glassEdgeGlow: { min: 0.0, max: 2.0 },
    glassLiquidFlow: { min: 0.3, max: 2.8 },
  },

  [EFFECT_NAMES.FROST]: {
    frostIntensity: { min: 0.5, max: 3.0 },
    frostCrystalSize: { min: 0.3, max: 2.0 },
    frostIceCoverage: { min: 0.3, max: 1.8 },
    frostTemperature: { min: 0.3, max: 2.5 },
    frostTexture: { min: 0.5, max: 2.0 },
  },

  [EFFECT_NAMES.RIPPLE]: {
    rippleFrequency: { min: 10.0, max: 50.0 },
    rippleAmplitude: { min: 0.03, max: 0.18 },
    rippleWaveSpeed: { min: 0.3, max: 2.8 },
    rippleRippleCount: { min: 0.2, max: 2.0 },
    rippleDecay: { min: 0.3, max: 2.0 },
  },

  [EFFECT_NAMES.PLASMA]: {
    plasmaIntensity: { min: 0.6, max: 2.8 },
    plasmaSpeed: { min: 0.3, max: 2.0 },
    plasmaEnergyIntensity: { min: 0.0, max: 1.0 },
    plasmaContrastBoost: { min: 0.0, max: 0.8 },
    plasmaTurbulence: { min: 0.3, max: 2.8 },
  },

  [EFFECT_NAMES.TIMESHIFT]: {
    timeshiftDistortion: { min: 0.4, max: 2.2 },
    timeshiftBlur: { min: 0.4, max: 2.1 },
    timeshiftFlow: { min: 0.4, max: 2.0 },
    timeshiftChromatic: { min: 0.3, max: 2.0 },
    timeshiftTurbulence: { min: 0.4, max: 2.0 },
  },
};
