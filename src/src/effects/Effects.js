/**
 * Effects System - Strategy Pattern + Factory Pattern
 * Todos os efeitos visuais em um arquivo único
 * Implementa BaseEffect + todos os efeitos específicos
 */

import { EFFECT_TYPES, EFFECT_NAMES } from "../utils/constants.js";
import { ValidationUtils } from "../utils/helpers.js";

/**
 * Classe base abstrata para todos os efeitos
 * Implementa Template Method Pattern
 */
export class BaseEffect {
  constructor(name, config = {}) {
    if (this.constructor === BaseEffect) {
      throw new Error("BaseEffect é uma classe abstrata");
    }

    this.name = name;
    this.config = { ...this.getDefaultConfig(), ...config };
    this.isActive = false;
    this.uniforms = {};

    this._validateConfig();
    this._initializeUniforms();
  }

  /**
   * Método abstrato - deve ser implementado pelas subclasses
   * @returns {Object} Configuração padrão do efeito
   */
  getDefaultConfig() {
    throw new Error("getDefaultConfig() deve ser implementado pela subclasse");
  }

  /**
   * Método abstrato - deve ser implementado pelas subclasses
   * @returns {string} Fragment shader específico do efeito
   */
  getFragmentShader() {
    throw new Error("getFragmentShader() deve ser implementado pela subclasse");
  }

  /**
   * Inicializa os uniforms do shader
   * Template Method - pode ser sobrescrito pelas subclasses
   */
  _initializeUniforms() {
    // Uniforms básicos que todos os efeitos têm
    this.uniforms = {
      uProgress: { value: 0.0 },
      uTime: { value: 0.0 },
      uGlobalIntensity: { value: this.config.globalIntensity || 1.0 },
      uSpeedMultiplier: { value: this.config.speedMultiplier || 1.0 },
      uDistortionStrength: { value: this.config.distortionStrength || 1.0 },
      uColorEnhancement: { value: this.config.colorEnhancement || 1.0 },
    };

    // Adicionar uniforms específicos do efeito
    this._addSpecificUniforms();
  }

  /**
   * Método para adicionar uniforms específicos - implementado pelas subclasses
   */
  _addSpecificUniforms() {
    // Override nas subclasses
  }

  /**
   * Atualiza configuração do efeito
   * @param {Object} newConfig - Nova configuração
   */
  updateConfig(newConfig) {
    Object.assign(this.config, newConfig);
    this._validateConfig();
    this._updateUniforms();
  }

  /**
   * Atualiza uniforms baseado na configuração atual
   */
  _updateUniforms() {
    // Atualizar uniforms globais
    if (this.uniforms.uGlobalIntensity) {
      this.uniforms.uGlobalIntensity.value = this.config.globalIntensity || 1.0;
    }
    if (this.uniforms.uSpeedMultiplier) {
      this.uniforms.uSpeedMultiplier.value = this.config.speedMultiplier || 1.0;
    }
    if (this.uniforms.uDistortionStrength) {
      this.uniforms.uDistortionStrength.value =
        this.config.distortionStrength || 1.0;
    }
    if (this.uniforms.uColorEnhancement) {
      this.uniforms.uColorEnhancement.value =
        this.config.colorEnhancement || 1.0;
    }

    // Atualizar uniforms específicos
    this._updateSpecificUniforms();
  }

  /**
   * Método para atualizar uniforms específicos - implementado pelas subclasses
   */
  _updateSpecificUniforms() {
    // Override nas subclasses
  }

  /**
   * Valida configuração do efeito
   */
  _validateConfig() {
    // Validações básicas
    if (!ValidationUtils.isPositiveNumber(this.config.globalIntensity)) {
      throw new Error("globalIntensity deve ser um número positivo");
    }
  }

  /**
   * Ativa o efeito
   */
  activate() {
    this.isActive = true;
  }

  /**
   * Desativa o efeito
   */
  deactivate() {
    this.isActive = false;
  }

  /**
   * Atualiza o progresso da transição
   * @param {number} progress - Progresso de 0 a 1
   */
  updateProgress(progress) {
    if (this.uniforms.uProgress) {
      this.uniforms.uProgress.value = progress;
    }
  }

  /**
   * Atualiza o tempo (para animações)
   * @param {number} time - Tempo em segundos
   */
  updateTime(time) {
    if (this.uniforms.uTime) {
      this.uniforms.uTime.value = time;
    }
  }

  /**
   * Retorna todos os uniforms do efeito
   * @returns {Object}
   */
  getUniforms() {
    return this.uniforms;
  }

  /**
   * Cleanup do efeito
   */
  destroy() {
    this.isActive = false;
    this.uniforms = {};
  }
}

/**
 * Glass Effect - Efeito de vidro líquido
 */
export class GlassEffect extends BaseEffect {
  constructor(config = {}) {
    super(EFFECT_NAMES.GLASS, config);
  }

  getDefaultConfig() {
    return {
      glassRefractionStrength: 1.0,
      glassChromaticAberration: 1.0,
      glassBubbleClarity: 1.0,
      glassEdgeGlow: 1.0,
      glassLiquidFlow: 1.0,
      globalIntensity: 1.0,
      speedMultiplier: 1.0,
      distortionStrength: 1.0,
      colorEnhancement: 1.0,
    };
  }

  _addSpecificUniforms() {
    Object.assign(this.uniforms, {
      uGlassRefractionStrength: { value: this.config.glassRefractionStrength },
      uGlassChromaticAberration: {
        value: this.config.glassChromaticAberration,
      },
      uGlassBubbleClarity: { value: this.config.glassBubbleClarity },
      uGlassEdgeGlow: { value: this.config.glassEdgeGlow },
      uGlassLiquidFlow: { value: this.config.glassLiquidFlow },
    });
  }

  _updateSpecificUniforms() {
    if (this.uniforms.uGlassRefractionStrength) {
      this.uniforms.uGlassRefractionStrength.value =
        this.config.glassRefractionStrength;
    }
    if (this.uniforms.uGlassChromaticAberration) {
      this.uniforms.uGlassChromaticAberration.value =
        this.config.glassChromaticAberration;
    }
    if (this.uniforms.uGlassBubbleClarity) {
      this.uniforms.uGlassBubbleClarity.value = this.config.glassBubbleClarity;
    }
    if (this.uniforms.uGlassEdgeGlow) {
      this.uniforms.uGlassEdgeGlow.value = this.config.glassEdgeGlow;
    }
    if (this.uniforms.uGlassLiquidFlow) {
      this.uniforms.uGlassLiquidFlow.value = this.config.glassLiquidFlow;
    }
  }

  getFragmentShader() {
    return `
      vec4 glassEffect(vec2 uv, float progress) {
        float glassStrength = 0.08 * uGlassRefractionStrength * uDistortionStrength * uGlobalIntensity;
        float chromaticAberration = 0.02 * uGlassChromaticAberration * uGlobalIntensity;
        float waveDistortion = 0.025 * uDistortionStrength;
        float clearCenterSize = 0.3 * uGlassBubbleClarity;
        float surfaceRipples = 0.004 * uDistortionStrength;
        float liquidFlow = 0.015 * uGlassLiquidFlow * uSpeedMultiplier;
        float rimLightWidth = 0.05;
        float glassEdgeWidth = 0.025;
        
        float brightnessPhase = smoothstep(0.8, 1.0, progress);
        float rimLightIntensity = 0.08 * (1.0 - brightnessPhase) * uGlassEdgeGlow * uGlobalIntensity;
        float glassEdgeOpacity = 0.06 * (1.0 - brightnessPhase) * uGlassEdgeGlow;

        vec2 center = vec2(0.5, 0.5);
        vec2 p = uv * uResolution;
        
        vec2 uv1 = getCoverUV(uv, uTexture1Size);
        vec2 uv2_base = getCoverUV(uv, uTexture2Size);
        
        float maxRadius = length(uResolution) * 0.85;
        float bubbleRadius = progress * maxRadius;
        vec2 sphereCenter = center * uResolution;
        
        float dist = length(p - sphereCenter);
        float normalizedDist = dist / max(bubbleRadius, 0.001);
        vec2 direction = (dist > 0.0) ? (p - sphereCenter) / dist : vec2(0.0);
        float inside = smoothstep(bubbleRadius + 3.0, bubbleRadius - 3.0, dist);
        
        float distanceFactor = smoothstep(clearCenterSize, 1.0, normalizedDist);
        float time = progress * 5.0 * uSpeedMultiplier;
        
        vec2 liquidSurface = vec2(
          smoothNoise(uv * 100.0 + time * 0.3),
          smoothNoise(uv * 100.0 + time * 0.2 + 50.0)
        ) - 0.5;
        liquidSurface *= surfaceRipples * distanceFactor;

        vec2 distortedUV = uv2_base;
        if (inside > 0.0) {
          float refractionOffset = glassStrength * pow(distanceFactor, 1.5);
          vec2 flowDirection = normalize(direction + vec2(sin(time), cos(time * 0.7)) * 0.3);
          distortedUV -= flowDirection * refractionOffset;

          float wave1 = sin(normalizedDist * 22.0 - time * 3.5);
          float wave2 = sin(normalizedDist * 35.0 + time * 2.8) * 0.7;
          float wave3 = sin(normalizedDist * 50.0 - time * 4.2) * 0.5;
          float combinedWave = (wave1 + wave2 + wave3) / 3.0;
          
          float waveOffset = combinedWave * waveDistortion * distanceFactor;
          distortedUV -= direction * waveOffset + liquidSurface;

          vec2 flowOffset = vec2(
            sin(time + normalizedDist * 10.0),
            cos(time * 0.8 + normalizedDist * 8.0)
          ) * liquidFlow * distanceFactor * inside;
          distortedUV += flowOffset;
        }

        vec4 newImg;
        if (inside > 0.0) {
          float aberrationOffset = chromaticAberration * pow(distanceFactor, 1.2);
          
          vec2 uv_r = distortedUV + direction * aberrationOffset * 1.2;
          vec2 uv_g = distortedUV + direction * aberrationOffset * 0.2;
          vec2 uv_b = distortedUV - direction * aberrationOffset * 0.8;

          float r = texture2D(uTexture2, uv_r).r;
          float g = texture2D(uTexture2, uv_g).g;
          float b = texture2D(uTexture2, uv_b).b;
          newImg = vec4(r, g, b, 1.0);
        } else {
          newImg = texture2D(uTexture2, uv2_base);
        }

        if (inside > 0.0 && rimLightIntensity > 0.0) {
          float rim = smoothstep(1.0 - rimLightWidth, 1.0, normalizedDist) *
                      (1.0 - smoothstep(1.0, 1.01, normalizedDist));
          newImg.rgb += rim * rimLightIntensity;

          float edge = smoothstep(1.0 - glassEdgeWidth, 1.0, normalizedDist) *
                       (1.0 - smoothstep(1.0, 1.01, normalizedDist));
          newImg.rgb = mix(newImg.rgb, vec3(1.0), edge * glassEdgeOpacity);
        }
        
        newImg.rgb = mix(newImg.rgb, newImg.rgb * 1.2, (uColorEnhancement - 1.0) * 0.5);
        
        vec4 currentImg = texture2D(uTexture1, uv1);
        
        if (progress > 0.95) {
          vec4 pureNewImg = texture2D(uTexture2, uv2_base);
          float endTransition = (progress - 0.95) / 0.05;
          newImg = mix(newImg, pureNewImg, endTransition);
        }
        
        return mix(currentImg, newImg, inside);
      }
    `;
  }
}

/**
 * Frost Effect - Efeito de gelo/frost
 */
export class FrostEffect extends BaseEffect {
  constructor(config = {}) {
    super(EFFECT_NAMES.FROST, config);
  }

  getDefaultConfig() {
    return {
      frostIntensity: 1.5,
      frostCrystalSize: 1.0,
      frostIceCoverage: 1.0,
      frostTemperature: 1.0,
      frostTexture: 1.0,
      globalIntensity: 1.0,
      speedMultiplier: 1.0,
      distortionStrength: 1.0,
      colorEnhancement: 1.0,
    };
  }

  _addSpecificUniforms() {
    Object.assign(this.uniforms, {
      uFrostIntensity: { value: this.config.frostIntensity },
      uFrostCrystalSize: { value: this.config.frostCrystalSize },
      uFrostIceCoverage: { value: this.config.frostIceCoverage },
      uFrostTemperature: { value: this.config.frostTemperature },
      uFrostTexture: { value: this.config.frostTexture },
    });
  }

  _updateSpecificUniforms() {
    if (this.uniforms.uFrostIntensity) {
      this.uniforms.uFrostIntensity.value = this.config.frostIntensity;
    }
    if (this.uniforms.uFrostCrystalSize) {
      this.uniforms.uFrostCrystalSize.value = this.config.frostCrystalSize;
    }
    if (this.uniforms.uFrostIceCoverage) {
      this.uniforms.uFrostIceCoverage.value = this.config.frostIceCoverage;
    }
    if (this.uniforms.uFrostTemperature) {
      this.uniforms.uFrostTemperature.value = this.config.frostTemperature;
    }
    if (this.uniforms.uFrostTexture) {
      this.uniforms.uFrostTexture.value = this.config.frostTexture;
    }
  }

  getFragmentShader() {
    return `
      vec4 frostEffect(vec2 uv, float progress) {
        vec4 currentImg = texture2D(uTexture1, getCoverUV(uv, uTexture1Size));
        vec4 newImg = texture2D(uTexture2, getCoverUV(uv, uTexture2Size));
        
        float effectiveIntensity = uFrostIntensity * uGlobalIntensity;
        float crystalScale = 80.0 / uFrostCrystalSize;
        float iceScale = 40.0 / uFrostCrystalSize;
        float temperatureEffect = uFrostTemperature;
        
        float frost1 = smoothNoise(uv * crystalScale * uFrostTexture);
        float frost2 = smoothNoise(uv * iceScale + 50.0) * 0.7;
        float frost3 = smoothNoise(uv * (crystalScale * 2.0) + 100.0) * 0.3;
        float frost = (frost1 + frost2 + frost3) / 2.0;
        
        float icespread = smoothNoise(uv * 25.0 / uFrostCrystalSize + 200.0);
        
        vec2 rnd = vec2(
          rand(uv + frost * 0.1), 
          rand(uv + frost * 0.1 + 0.5)
        );
        
        float clampedIceCoverage = clamp(uFrostIceCoverage, 0.1, 2.5);
        float size = mix(progress, sqrt(progress), 0.5) * 1.12 * clampedIceCoverage + 0.0000001;
        
        float lensY = clamp(pow(size, clamp(4.0, 1.5, 6.0)) / 2.0, size * 0.1, size * 8.0);
        vec2 lens = vec2(size, lensY);
        
        float dist = distance(uv, vec2(0.5, 0.5));
        float vignette = pow(1.0 - smoothstep(lens.x, lens.y, dist), 2.0);
        
        float frostyness = 0.8 * effectiveIntensity * uDistortionStrength;
        rnd *= frost * vignette * frostyness * (1.0 - floor(vignette));
        
        vec4 regular = newImg;
        vec4 frozen = texture2D(uTexture2, getCoverUV(uv + rnd * 0.06, uTexture2Size));
        
        float tempShift = clamp(temperatureEffect * 0.15, 0.0, 0.3);
        frozen *= vec4(
          clamp(0.85 + tempShift, 0.7, 1.2),
          clamp(0.9, 0.8, 1.0),
          clamp(1.2 - tempShift, 0.8, 1.3),
          1.0
        );
        float tempMixStrength = clamp(0.1 * temperatureEffect, 0.0, 0.25);
        frozen = mix(frozen, vec4(0.9, 0.95, 1.1, 1.0), tempMixStrength);
        
        float frostMask = smoothstep(icespread * 0.8, 1.0, pow(vignette, 1.5));
        vec4 frostResult = mix(frozen, regular, frostMask);
        
        float transitionStart = mix(0.85, 0.7, clamp(effectiveIntensity - 1.0, 0.0, 1.0));
        float colorTransition = smoothstep(transitionStart, 1.0, progress);
        vec4 finalFrost = mix(frostResult, regular, colorTransition);
        
        finalFrost.rgb = mix(finalFrost.rgb, finalFrost.rgb * 1.2, (uColorEnhancement - 1.0) * 0.5);
        
        float overallBlend = smoothstep(0.0, 1.0, progress);
        
        if (progress > 0.95) {
          float endTransition = (progress - 0.95) / 0.05;
          finalFrost = mix(finalFrost, newImg, endTransition * 0.5);
        }
        
        return mix(currentImg, finalFrost, overallBlend);
      }
    `;
  }
}

/**
 * Ripple Effect - Efeito de ondas/ripples
 */
export class RippleEffect extends BaseEffect {
  constructor(config = {}) {
    super(EFFECT_NAMES.RIPPLE, config);
  }

  getDefaultConfig() {
    return {
      rippleFrequency: 25.0,
      rippleAmplitude: 0.08,
      rippleWaveSpeed: 1.0,
      rippleRippleCount: 1.0,
      rippleDecay: 1.0,
      globalIntensity: 1.0,
      speedMultiplier: 1.0,
      distortionStrength: 1.0,
      colorEnhancement: 1.0,
    };
  }

  _addSpecificUniforms() {
    Object.assign(this.uniforms, {
      uRippleFrequency: { value: this.config.rippleFrequency },
      uRippleAmplitude: { value: this.config.rippleAmplitude },
      uRippleWaveSpeed: { value: this.config.rippleWaveSpeed },
      uRippleRippleCount: { value: this.config.rippleRippleCount },
      uRippleDecay: { value: this.config.rippleDecay },
    });
  }

  _updateSpecificUniforms() {
    if (this.uniforms.uRippleFrequency) {
      this.uniforms.uRippleFrequency.value = this.config.rippleFrequency;
    }
    if (this.uniforms.uRippleAmplitude) {
      this.uniforms.uRippleAmplitude.value = this.config.rippleAmplitude;
    }
    if (this.uniforms.uRippleWaveSpeed) {
      this.uniforms.uRippleWaveSpeed.value = this.config.rippleWaveSpeed;
    }
    if (this.uniforms.uRippleRippleCount) {
      this.uniforms.uRippleRippleCount.value = this.config.rippleRippleCount;
    }
    if (this.uniforms.uRippleDecay) {
      this.uniforms.uRippleDecay.value = this.config.rippleDecay;
    }
  }

  getFragmentShader() {
    return `
      vec4 rippleEffect(vec2 uv, float progress) {
        vec4 currentImg = texture2D(uTexture1, getCoverUV(uv, uTexture1Size));
        vec4 newImg = texture2D(uTexture2, getCoverUV(uv, uTexture2Size));
        
        vec2 center = vec2(0.5, 0.5);
        float dist = distance(uv, center);
        float maxDist = 0.8;
        
        float effectiveSpeed = uRippleWaveSpeed * uSpeedMultiplier;
        float effectiveAmplitude = uRippleAmplitude * uDistortionStrength * uGlobalIntensity;
        float effectiveDecay = uRippleDecay;
        
        float waveRadius = progress * maxDist * 1.5 * effectiveSpeed;
        
        float ripple1 = sin((dist - waveRadius) * uRippleFrequency) * exp(-abs(dist - waveRadius) * 8.0 * effectiveDecay);
        float ripple2 = sin((dist - waveRadius * 0.7) * uRippleFrequency * 1.3) * 
                       exp(-abs(dist - waveRadius * 0.7) * 6.0 * effectiveDecay) * 0.6 * uRippleRippleCount;
        float ripple3 = sin((dist - waveRadius * 0.4) * uRippleFrequency * 1.8) * 
                       exp(-abs(dist - waveRadius * 0.4) * 4.0 * effectiveDecay) * 0.3 * uRippleRippleCount;
        
        float combinedRipple = (ripple1 + ripple2 + ripple3) * effectiveAmplitude;
        
        vec2 normal = normalize(uv - center);
        vec2 distortedUV = getCoverUV(uv + normal * combinedRipple, uTexture2Size);
        
        vec4 distortedImg = texture2D(uTexture2, distortedUV);
        
        float fadeEdge = smoothstep(maxDist, maxDist * 0.9, dist);
        vec4 rippleResult = mix(newImg, distortedImg, fadeEdge);
        
        float mask = smoothstep(0.0, 0.3, progress) * (1.0 - smoothstep(0.7, 1.0, progress));
        rippleResult = mix(newImg, rippleResult, mask);
        
        rippleResult.rgb = mix(rippleResult.rgb, rippleResult.rgb * 1.2, (uColorEnhancement - 1.0) * 0.5);
        
        float transition = smoothstep(0.0, 1.0, progress);
        return mix(currentImg, rippleResult, transition);
      }
    `;
  }
}

/**
 * Plasma Effect - Efeito de plasma/energia
 */
export class PlasmaEffect extends BaseEffect {
  constructor(config = {}) {
    super(EFFECT_NAMES.PLASMA, config);
  }

  getDefaultConfig() {
    return {
      plasmaIntensity: 1.2,
      plasmaSpeed: 0.8,
      plasmaEnergyIntensity: 0.4,
      plasmaContrastBoost: 0.3,
      plasmaTurbulence: 1.0,
      globalIntensity: 1.0,
      speedMultiplier: 1.0,
      distortionStrength: 1.0,
      colorEnhancement: 1.0,
    };
  }

  _addSpecificUniforms() {
    Object.assign(this.uniforms, {
      uPlasmaIntensity: { value: this.config.plasmaIntensity },
      uPlasmaSpeed: { value: this.config.plasmaSpeed },
      uPlasmaEnergyIntensity: { value: this.config.plasmaEnergyIntensity },
      uPlasmaContrastBoost: { value: this.config.plasmaContrastBoost },
      uPlasmaTurbulence: { value: this.config.plasmaTurbulence },
    });
  }

  _updateSpecificUniforms() {
    if (this.uniforms.uPlasmaIntensity) {
      this.uniforms.uPlasmaIntensity.value = this.config.plasmaIntensity;
    }
    if (this.uniforms.uPlasmaSpeed) {
      this.uniforms.uPlasmaSpeed.value = this.config.plasmaSpeed;
    }
    if (this.uniforms.uPlasmaEnergyIntensity) {
      this.uniforms.uPlasmaEnergyIntensity.value =
        this.config.plasmaEnergyIntensity;
    }
    if (this.uniforms.uPlasmaContrastBoost) {
      this.uniforms.uPlasmaContrastBoost.value =
        this.config.plasmaContrastBoost;
    }
    if (this.uniforms.uPlasmaTurbulence) {
      this.uniforms.uPlasmaTurbulence.value = this.config.plasmaTurbulence;
    }
  }

  getFragmentShader() {
    return `
      vec4 plasmaEffect(vec2 uv, float progress) {
        vec4 currentImg = texture2D(uTexture1, getCoverUV(uv, uTexture1Size));
        vec4 newImg = texture2D(uTexture2, getCoverUV(uv, uTexture2Size));
        
        float effectiveSpeed = uPlasmaSpeed * uSpeedMultiplier;
        float effectiveIntensity = uPlasmaIntensity * uGlobalIntensity;
        float time = progress * 8.0 * effectiveSpeed;
        
        float plasma1 = sin(uv.x * 10.0 + time) * cos(uv.y * 8.0 + time * 0.7);
        float plasma2 = sin((uv.x + uv.y) * 12.0 + time * 1.3) * cos((uv.x - uv.y) * 15.0 + time * 0.9);
        float plasma3 = sin(length(uv - vec2(0.5)) * 20.0 + time * 1.8);
        
        float turbulence1 = smoothNoise(uv * 15.0 * uPlasmaTurbulence + vec2(time * 0.5, time * 0.3));
        float turbulence2 = smoothNoise(uv * 25.0 * uPlasmaTurbulence + vec2(time * 0.8, -time * 0.4)) * 0.7;
        float turbulence3 = smoothNoise(uv * 40.0 * uPlasmaTurbulence + vec2(-time * 0.6, time * 0.9)) * 0.4;
        
        float combinedTurbulence = (turbulence1 + turbulence2 + turbulence3) / 2.1;
        
        float plasma = (plasma1 + plasma2 + plasma3) * 0.333 + combinedTurbulence * 0.5;
        plasma = sin(plasma * 3.14159);
        
        float plasmaPhase = smoothstep(0.0, 0.3, progress) * (1.0 - smoothstep(0.7, 1.0, progress));
        
        vec2 electricField = vec2(
          sin(plasma * 6.28 + time) * 0.02,
          cos(plasma * 4.71 + time * 1.1) * 0.02
        ) * effectiveIntensity * plasmaPhase * uDistortionStrength;
        
        vec2 flowField1 = vec2(
          smoothNoise(uv * 8.0 + time * 0.4),
          smoothNoise(uv * 8.0 + time * 0.4 + 100.0)
        ) - 0.5;
        
        vec2 flowField2 = vec2(
          smoothNoise(uv * 16.0 + time * 0.6 + 200.0),
          smoothNoise(uv * 16.0 + time * 0.6 + 300.0)
        ) - 0.5;
        
        flowField1 *= 0.015 * effectiveIntensity * plasmaPhase * uDistortionStrength;
        flowField2 *= 0.008 * effectiveIntensity * plasmaPhase * uDistortionStrength;
        
        vec2 totalDistortion = electricField + flowField1 + flowField2;
        
        vec2 distortedUV1 = getCoverUV(uv + totalDistortion, uTexture1Size);
        vec2 distortedUV2 = getCoverUV(uv + totalDistortion, uTexture2Size);
        
        vec4 distortedCurrentImg = texture2D(uTexture1, distortedUV1);
        vec4 distortedNewImg = texture2D(uTexture2, distortedUV2);
        
        float energyMask = abs(plasma) * plasmaPhase * effectiveIntensity;
        
        vec4 blendedDistorted = mix(distortedCurrentImg, distortedNewImg, progress);
        
        vec3 energyColor = vec3(0.9, 0.95, 1.0);
        
        float energyPulse = sin(time * 4.0) * 0.5 + 0.5;
        float finalEnergyIntensity = energyMask * uPlasmaEnergyIntensity * (0.7 + energyPulse * 0.3);
        
        float contrast = 1.0 + energyMask * uPlasmaContrastBoost;
        vec3 contrastedColor = (blendedDistorted.rgb - 0.5) * contrast + 0.5;
        
        float saturationBoost = 1.0 + energyMask * 0.4;
        float luminance = dot(contrastedColor, vec3(0.299, 0.587, 0.114));
        vec3 saturatedColor = mix(vec3(luminance), contrastedColor, saturationBoost);
        
        vec3 glowColor = saturatedColor + energyColor * finalEnergyIntensity;
        
        float crackle = smoothNoise(uv * 50.0 + time * 2.0);
        crackle = smoothstep(0.85, 1.0, crackle) * energyMask;
        glowColor += vec3(1.0) * crackle * uPlasmaEnergyIntensity * 0.5;
        
        float brightnessPulse = sin(time * 6.0 + plasma * 10.0) * 0.5 + 0.5;
        glowColor += energyMask * brightnessPulse * uPlasmaEnergyIntensity * 0.2;
        
        glowColor = mix(glowColor, glowColor * 1.2, (uColorEnhancement - 1.0) * 0.5);
        
        vec4 plasmaResult = vec4(glowColor, 1.0);
        
        if (progress > 0.85) {
          float endFade = (progress - 0.85) / 0.15;
          plasmaResult = mix(plasmaResult, newImg, endFade);
        }
        
        float overallTransition = smoothstep(0.0, 1.0, progress);
        return mix(currentImg, plasmaResult, overallTransition);
      }
    `;
  }
}

/**
 * Timeshift Effect - Efeito de distorção temporal
 */
export class TimeshiftEffect extends BaseEffect {
  constructor(config = {}) {
    super(EFFECT_NAMES.TIMESHIFT, config);
  }

  getDefaultConfig() {
    return {
      timeshiftDistortion: 1.6,
      timeshiftBlur: 1.5,
      timeshiftFlow: 1.4,
      timeshiftChromatic: 1.5,
      timeshiftTurbulence: 1.4,
      globalIntensity: 1.0,
      speedMultiplier: 1.0,
      distortionStrength: 1.0,
      colorEnhancement: 1.0,
    };
  }

  _addSpecificUniforms() {
    Object.assign(this.uniforms, {
      uTimeshiftDistortion: { value: this.config.timeshiftDistortion },
      uTimeshiftBlur: { value: this.config.timeshiftBlur },
      uTimeshiftFlow: { value: this.config.timeshiftFlow },
      uTimeshiftChromatic: { value: this.config.timeshiftChromatic },
      uTimeshiftTurbulence: { value: this.config.timeshiftTurbulence },
    });
  }

  _updateSpecificUniforms() {
    if (this.uniforms.uTimeshiftDistortion) {
      this.uniforms.uTimeshiftDistortion.value =
        this.config.timeshiftDistortion;
    }
    if (this.uniforms.uTimeshiftBlur) {
      this.uniforms.uTimeshiftBlur.value = this.config.timeshiftBlur;
    }
    if (this.uniforms.uTimeshiftFlow) {
      this.uniforms.uTimeshiftFlow.value = this.config.timeshiftFlow;
    }
    if (this.uniforms.uTimeshiftChromatic) {
      this.uniforms.uTimeshiftChromatic.value = this.config.timeshiftChromatic;
    }
    if (this.uniforms.uTimeshiftTurbulence) {
      this.uniforms.uTimeshiftTurbulence.value =
        this.config.timeshiftTurbulence;
    }
  }

  getFragmentShader() {
    return `
      vec4 timeshiftEffect(vec2 uv, float progress) {
        vec2 uv1 = getCoverUV(uv, uTexture1Size);
        vec2 uv2_base = getCoverUV(uv, uTexture2Size);
        vec4 currentImg = texture2D(uTexture1, uv1);
        vec4 newImg = texture2D(uTexture2, uv2_base);
        
        float effectiveDistortion = uTimeshiftDistortion * uDistortionStrength * uGlobalIntensity;
        float effectiveBlur = uTimeshiftBlur * uGlobalIntensity;
        float effectiveFlow = uTimeshiftFlow * uSpeedMultiplier;
        float effectiveChromatic = uTimeshiftChromatic * uGlobalIntensity;
        float effectiveTurbulence = uTimeshiftTurbulence;
        
        vec2 center = vec2(0.5, 0.5);
        vec2 p = uv * uResolution;
        vec2 sphereCenter = center * uResolution;
        
        float maxRadius = length(uResolution) * 0.85;
        float circleRadius = progress * maxRadius;
        
        float dist = length(p - sphereCenter);
        float normalizedDist = dist / max(circleRadius, 0.001);
        
        float boundaryWidth = 0.2 * effectiveBlur;
        float inside = smoothstep(circleRadius + circleRadius * boundaryWidth, 
                                 circleRadius - circleRadius * boundaryWidth, dist);
        
        vec4 finalColor = newImg;
        
        if (inside > 0.01 && inside < 0.99) {
          vec2 fromCenter = uv - center;
          float radius = length(fromCenter);
          vec2 direction = radius > 0.0 ? fromCenter / radius : vec2(0.0);
          
          float boundaryStrength = smoothstep(0.0, 0.3, inside) * smoothstep(1.0, 0.7, inside);
          
          float time = progress * 6.28 * effectiveFlow;
          
          float turb1 = smoothNoise(uv * 12.0 * effectiveTurbulence + time * 0.4);
          float turb2 = smoothNoise(uv * 20.0 * effectiveTurbulence - time * 0.5);
          float turb3 = smoothNoise(uv * 35.0 * effectiveTurbulence + time * 0.7);
          float turb4 = smoothNoise(uv * 55.0 * effectiveTurbulence - time * 0.4);
          
          vec2 turbulence = vec2(
            (turb1 - 0.5) * 1.2 + (turb2 - 0.5) * 0.8 + (turb3 - 0.5) * 0.4,
            (turb2 - 0.5) * 1.2 + (turb3 - 0.5) * 0.8 + (turb4 - 0.5) * 0.4
          );
          
          float displacementStrength = 0.18 * effectiveDistortion * boundaryStrength;
          vec2 displacement = turbulence * displacementStrength;
          
          float radialPull = sin(normalizedDist * 12.0 - time * 2.5) * 0.05 * effectiveDistortion;
          displacement += direction * radialPull * boundaryStrength;
          
          vec2 perpendicular = vec2(-direction.y, direction.x);
          float swirl = sin(time * 2.5 + normalizedDist * 10.0) * 0.06 * effectiveFlow;
          displacement += perpendicular * swirl * boundaryStrength;
          
          vec2 distortedUV1 = getCoverUV(uv + displacement, uTexture1Size);
          vec2 distortedUV2 = getCoverUV(uv + displacement, uTexture2Size);
          
          vec4 distortedOld = texture2D(uTexture1, distortedUV1);
          vec4 distortedNew = texture2D(uTexture2, distortedUV2);
          
          if (effectiveChromatic > 0.01) {
            float chromaticStr = boundaryStrength * 0.03 * effectiveChromatic;
            
            vec2 uv1_r = getCoverUV(uv + displacement + direction * chromaticStr * 2.0, uTexture1Size);
            vec2 uv1_b = getCoverUV(uv + displacement - direction * chromaticStr * 1.2, uTexture1Size);
            distortedOld = vec4(
              texture2D(uTexture1, uv1_r).r,
              distortedOld.g,
              texture2D(uTexture1, uv1_b).b,
              1.0
            );
            
            vec2 uv2_r = getCoverUV(uv + displacement + direction * chromaticStr * 2.0, uTexture2Size);
            vec2 uv2_b = getCoverUV(uv + displacement - direction * chromaticStr * 1.2, uTexture2Size);
            distortedNew = vec4(
              texture2D(uTexture2, uv2_r).r,
              distortedNew.g,
              texture2D(uTexture2, uv2_b).b,
              1.0
            );
          }
          
          finalColor = mix(distortedOld, distortedNew, inside);
          
          if (effectiveBlur > 0.5) {
            vec4 blurSample1 = texture2D(uTexture2, getCoverUV(uv + displacement + turbulence * 0.015, uTexture2Size));
            vec4 blurSample2 = texture2D(uTexture2, getCoverUV(uv + displacement - turbulence * 0.015, uTexture2Size));
            vec4 blurSample3 = texture2D(uTexture1, getCoverUV(uv + displacement + vec2(turbulence.y, -turbulence.x) * 0.015, uTexture1Size));
            
            float blurAmount = boundaryStrength * effectiveBlur * 0.6;
            finalColor = mix(finalColor, (finalColor + blurSample1 + blurSample2 + blurSample3) * 0.25, blurAmount);
          }
          
        } else if (inside >= 0.99) {
          finalColor = newImg;
        } else {
          finalColor = currentImg;
        }
        
        finalColor.rgb = mix(finalColor.rgb, finalColor.rgb * 1.2, (uColorEnhancement - 1.0) * 0.5);
        
        if (progress > 0.95) {
          float endTransition = (progress - 0.95) / 0.05;
          finalColor = mix(finalColor, newImg, endTransition);
        }
        
        return mix(currentImg, finalColor, smoothstep(0.0, 1.0, progress));
      }
    `;
  }
}

/**
 * Effect Factory - Factory Pattern
 * Cria instâncias dos efeitos baseado no nome
 */
export class EffectFactory {
  static createEffect(effectName, config = {}) {
    switch (effectName) {
      case EFFECT_NAMES.GLASS:
        return new GlassEffect(config);

      case EFFECT_NAMES.FROST:
        return new FrostEffect(config);

      case EFFECT_NAMES.RIPPLE:
        return new RippleEffect(config);

      case EFFECT_NAMES.PLASMA:
        return new PlasmaEffect(config);

      case EFFECT_NAMES.TIMESHIFT:
        return new TimeshiftEffect(config);

      default:
        throw new Error(`Efeito desconhecido: ${effectName}`);
    }
  }

  static getAvailableEffects() {
    return Object.values(EFFECT_NAMES);
  }

  static getEffectType(effectName) {
    return EFFECT_TYPES[effectName.toUpperCase()] ?? -1;
  }
}

/**
 * Effect Manager - Gerencia múltiplos efeitos
 */
export class EffectManager {
  constructor() {
    this.effects = new Map();
    this.currentEffect = null;
    this.isTransitioning = false;
  }

  /**
   * Registra um efeito
   * @param {string} name - Nome do efeito
   * @param {BaseEffect} effect - Instância do efeito
   */
  registerEffect(name, effect) {
    if (!(effect instanceof BaseEffect)) {
      throw new Error("Effect deve ser uma instância de BaseEffect");
    }

    this.effects.set(name, effect);
  }

  /**
   * Ativa um efeito
   * @param {string} name - Nome do efeito
   */
  activateEffect(name) {
    const effect = this.effects.get(name);
    if (!effect) {
      throw new Error(`Efeito não encontrado: ${name}`);
    }

    // Desativar efeito atual
    if (this.currentEffect) {
      this.currentEffect.deactivate();
    }

    // Ativar novo efeito
    effect.activate();
    this.currentEffect = effect;
  }

  /**
   * Obtém o efeito atual
   * @returns {BaseEffect|null}
   */
  getCurrentEffect() {
    return this.currentEffect;
  }

  /**
   * Atualiza configuração do efeito atual
   * @param {Object} config - Nova configuração
   */
  updateCurrentConfig(config) {
    if (this.currentEffect) {
      this.currentEffect.updateConfig(config);
    }
  }

  /**
   * Atualiza progresso do efeito atual
   * @param {number} progress - Progresso de 0 a 1
   */
  updateProgress(progress) {
    if (this.currentEffect) {
      this.currentEffect.updateProgress(progress);
    }
  }

  /**
   * Atualiza tempo do efeito atual
   * @param {number} time - Tempo em segundos
   */
  updateTime(time) {
    if (this.currentEffect) {
      this.currentEffect.updateTime(time);
    }
  }

  /**
   * Obtém uniforms do efeito atual
   * @returns {Object}
   */
  getCurrentUniforms() {
    return this.currentEffect ? this.currentEffect.getUniforms() : {};
  }

  /**
   * Destrói todos os efeitos
   */
  destroy() {
    this.effects.forEach((effect) => effect.destroy());
    this.effects.clear();
    this.currentEffect = null;
  }
}
