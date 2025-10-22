// src/core/UIController.js

import { Pane } from "https://cdn.skypack.dev/tweakpane@4.0.4";
import { SLIDER_CONFIG } from "../config/slide.config";

export class UIController {
  constructor(shaderManager, onEffectChange, onRandomize) {
    this.shaderManager = shaderManager;
    this.onEffectChange = onEffectChange;
    this.onRandomize = onRandomize;

    this.pane = null;
    this.effectFolders = {};
    this.isApplyingPreset = false;

    this._createPane();
  }

  _createPane() {
    this.pane = new Pane({
      title: "Controle de Efeitos",
    });

    this._createGeneralSettings();
    this._createTimingSettings();
    this._createEffectSelection();
    this._createPresetSelection();
    this._createEffectSettings();
    this._setupEventHandlers();
    this._hide(); // Esconde inicialmente
  }

  _createGeneralSettings() {
    const folder = this.pane.addFolder({
      title: "Config Geral",
    });

    folder.addBinding(SLIDER_CONFIG.settings, "globalIntensity", {
      label: "Intesidade Global",
      min: 0.1,
      max: 2.0,
      step: 0.1,
    });

    folder.addBinding(SLIDER_CONFIG.settings, "speedMultiplier", {
      label: "Velocidade",
      min: 0.1,
      max: 3.0,
      step: 0.1,
    });

    folder.addBinding(SLIDER_CONFIG.settings, "distortionStrength", {
      label: "Distorção",
      min: 0.1,
      max: 3.0,
      step: 0.1,
    });

    folder.addBinding(SLIDER_CONFIG.settings, "colorEnhancement", {
      label: "Color Enhancement",
      min: 0.5,
      max: 2.0,
      step: 0.1,
    });
  }

  _createTimingSettings() {
    const folder = this.pane.addFolder({
      title: "Timing",
    });

    folder.addBinding(SLIDER_CONFIG.settings, "transitionDuration", {
      label: "Transition Duração",
      min: 0.5,
      max: 5.0,
      step: 0.1,
    });

    folder.addBinding(SLIDER_CONFIG.settings, "autoSlideSpeed", {
      label: "Auto Slide Speed",
      min: 2000,
      max: 10000,
      step: 500,
    });
  }

  _createEffectSelection() {
    const folder = this.pane.addFolder({
      title: "Selecionar Efeito",
    });

    folder.addBinding(SLIDER_CONFIG.settings, "currentEffect", {
      label: "Effect Type",
      options: {
        Glass: "glass",
        Frost: "frost",
        Ripple: "ripple",
        Plasma: "plasma",
        Timeshift: "timeshift",
      },
    });

    // Botão randomize
    folder
      .addButton({
        title: "Efeito Random",
      })
      .on("click", () => {
        if (this.onRandomize) {
          this.onRandomize();
        }
      });
  }

  _createPresetSelection() {
    this.presetsFolder = this.pane.addFolder({
      title: "Presets Efeito",
    });

    this.presetBinding = this.presetsFolder.addBinding(
      SLIDER_CONFIG.settings,
      "currentEffectPreset",
      {
        label: "Preset",
        options: this._getPresetOptions(SLIDER_CONFIG.settings.currentEffect),
      }
    );
  }

  _createEffectSettings() {
    this._createGlassSettings();
    this._createFrostSettings();
    this._createRippleSettings();
    this._createPlasmaSettings();
    this._createTimeshiftSettings();

    // Mostra apenas o efeito atual
    this._updateEffectFolderVisibility(SLIDER_CONFIG.settings.currentEffect);
  }

  /**
   * Glass settings
   */
  _createGlassSettings() {
    const folder = this.pane.addFolder({ title: "Glass Settings" });

    folder.addBinding(SLIDER_CONFIG.settings, "glassRefractionStrength", {
      label: "Refração Força",
      min: 0.1,
      max: 3.0,
      step: 0.1,
    });
    folder.addBinding(SLIDER_CONFIG.settings, "glassChromaticAberration", {
      label: "Chromatic Aberration",
      min: 0.1,
      max: 3.0,
      step: 0.1,
    });
    folder.addBinding(SLIDER_CONFIG.settings, "glassBubbleClarity", {
      label: "Bubble Clarity",
      min: 0.1,
      max: 2.0,
      step: 0.1,
    });
    folder.addBinding(SLIDER_CONFIG.settings, "glassEdgeGlow", {
      label: "Edge Glow",
      min: 0.0,
      max: 2.0,
      step: 0.1,
    });
    folder.addBinding(SLIDER_CONFIG.settings, "glassLiquidFlow", {
      label: "Liquid Flow",
      min: 0.1,
      max: 3.0,
      step: 0.1,
    });

    this.effectFolders.glass = folder;
  }

  /**
   * Frost settings
   */
  _createFrostSettings() {
    const folder = this.pane.addFolder({ title: "Frost Settings" });

    folder.addBinding(SLIDER_CONFIG.settings, "frostIntensity", {
      label: "Frost Intensity",
      min: 0.5,
      max: 3.0,
      step: 0.1,
    });
    folder.addBinding(SLIDER_CONFIG.settings, "frostCrystalSize", {
      label: "Crystal Size",
      min: 0.3,
      max: 2.0,
      step: 0.1,
    });
    folder.addBinding(SLIDER_CONFIG.settings, "frostIceCoverage", {
      label: "Ice Coverage",
      min: 0.1,
      max: 2.0,
      step: 0.1,
    });
    folder.addBinding(SLIDER_CONFIG.settings, "frostTemperature", {
      label: "Temperature",
      min: 0.1,
      max: 3.0,
      step: 0.1,
    });
    folder.addBinding(SLIDER_CONFIG.settings, "frostTexture", {
      label: "Texture Detail",
      min: 0.3,
      max: 2.0,
      step: 0.1,
    });

    this.effectFolders.frost = folder;
  }

  /**
   * Ripple settings
   */
  _createRippleSettings() {
    const folder = this.pane.addFolder({ title: "Ripple Settings" });

    folder.addBinding(SLIDER_CONFIG.settings, "rippleFrequency", {
      label: "Frequency",
      min: 10.0,
      max: 50.0,
      step: 1.0,
    });
    folder.addBinding(SLIDER_CONFIG.settings, "rippleAmplitude", {
      label: "Amplitude",
      min: 0.02,
      max: 0.2,
      step: 0.01,
    });
    folder.addBinding(SLIDER_CONFIG.settings, "rippleWaveSpeed", {
      label: "Wave Speed",
      min: 0.2,
      max: 3.0,
      step: 0.1,
    });
    folder.addBinding(SLIDER_CONFIG.settings, "rippleRippleCount", {
      label: "Ripple Count",
      min: 0.1,
      max: 2.0,
      step: 0.1,
    });
    folder.addBinding(SLIDER_CONFIG.settings, "rippleDecay", {
      label: "Decay Rate",
      min: 0.2,
      max: 2.0,
      step: 0.1,
    });

    this.effectFolders.ripple = folder;
  }

  /**
   * Plasma settings
   */
  _createPlasmaSettings() {
    const folder = this.pane.addFolder({ title: "Plasma Settings" });

    folder.addBinding(SLIDER_CONFIG.settings, "plasmaIntensity", {
      label: "Plasma Intensity",
      min: 0.5,
      max: 3.0,
      step: 0.1,
    });
    folder.addBinding(SLIDER_CONFIG.settings, "plasmaSpeed", {
      label: "Plasma Speed",
      min: 0.2,
      max: 2.0,
      step: 0.1,
    });
    folder.addBinding(SLIDER_CONFIG.settings, "plasmaEnergyIntensity", {
      label: "Energy Intensity",
      min: 0.0,
      max: 1.0,
      step: 0.05,
    });
    folder.addBinding(SLIDER_CONFIG.settings, "plasmaContrastBoost", {
      label: "Contrast Boost",
      min: 0.0,
      max: 1.0,
      step: 0.05,
    });
    folder.addBinding(SLIDER_CONFIG.settings, "plasmaTurbulence", {
      label: "Turbulence",
      min: 0.1,
      max: 3.0,
      step: 0.1,
    });

    this.effectFolders.plasma = folder;
  }

  /**
   * Timeshift settings
   */
  _createTimeshiftSettings() {
    const folder = this.pane.addFolder({ title: "Timeshift Settings" });

    folder.addBinding(SLIDER_CONFIG.settings, "timeshiftDistortion", {
      label: "Distortion",
      min: 0.3,
      max: 3.0,
      step: 0.1,
    });
    folder.addBinding(SLIDER_CONFIG.settings, "timeshiftBlur", {
      label: "Blur Amount",
      min: 0.3,
      max: 3.0,
      step: 0.1,
    });
    folder.addBinding(SLIDER_CONFIG.settings, "timeshiftFlow", {
      label: "Flow Speed",
      min: 0.3,
      max: 3.0,
      step: 0.1,
    });
    folder.addBinding(SLIDER_CONFIG.settings, "timeshiftChromatic", {
      label: "Chromatic Glitch",
      min: 0.0,
      max: 3.0,
      step: 0.1,
    });
    folder.addBinding(SLIDER_CONFIG.settings, "timeshiftTurbulence", {
      label: "Turbulence",
      min: 0.3,
      max: 3.0,
      step: 0.1,
    });

    this.effectFolders.timeshift = folder;
  }

  /**
   * Setup event handlers
   */
  _setupEventHandlers() {
    this.pane.on("change", (event) => {
      if (this.isApplyingPreset) return;

      // Mudança de efeito
      if (event.target.key === "currentEffect") {
        this._handleEffectChange(SLIDER_CONFIG.settings.currentEffect);
      }
      // Mudança de preset
      else if (event.target.key === "currentEffectPreset") {
        this._applyPreset(
          SLIDER_CONFIG.settings.currentEffect,
          SLIDER_CONFIG.settings.currentEffectPreset
        );
      }
      // Qualquer outro setting
      else {
        // Marca como Custom se não for global/timing
        if (
          !event.target.key.includes("currentEffect") &&
          !event.target.key.includes("global") &&
          !event.target.key.includes("Duration") &&
          !event.target.key.includes("Speed")
        ) {
          SLIDER_CONFIG.settings.currentEffectPreset = "Custom";
          this.pane.refresh();
        }

        this.shaderManager.updateUniforms();
      }
    });

    // Tecla 'H'
    document.addEventListener("keydown", (e) => {
      if (e.code === "KeyH") {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  _handleEffectChange(newEffect) {
    // Atualiza shader
    this.shaderManager.setEffectType(newEffect);

    // Atualiza visibilidade de folders
    this._updateEffectFolderVisibility(newEffect);

    // Atualiza opções de preset
    this._updatePresetOptions(newEffect);

    // Aplica preset padrão
    SLIDER_CONFIG.settings.currentEffectPreset = "Default";
    this._applyPreset(newEffect, "Default");

    // Callback externo
    if (this.onEffectChange) {
      this.onEffectChange(newEffect);
    }

    this.pane.refresh();
  }

  _updateEffectFolderVisibility(currentEffect) {
    Object.keys(this.effectFolders).forEach((effectName) => {
      if (this.effectFolders[effectName]) {
        this.effectFolders[effectName].hidden = effectName !== currentEffect;
      }
    });
  }

  _updatePresetOptions(effectName) {
    // Remove binding antigo
    if (this.presetBinding) {
      this.presetsFolder.remove(this.presetBinding);
    }

    // Adiciona novo binding
    this.presetBinding = this.presetsFolder.addBinding(
      SLIDER_CONFIG.settings,
      "currentEffectPreset",
      {
        label: "Preset",
        options: this._getPresetOptions(effectName),
      }
    );
  }

  _getPresetOptions(effectName) {
    const presets = SLIDER_CONFIG.effectPresets[effectName];
    if (!presets) return { Custom: "Custom" };

    const options = {};
    Object.keys(presets).forEach((key) => {
      options[key] = key;
    });
    options["Custom"] = "Custom";

    return options;
  }

  _applyPreset(effectName, presetName) {
    const presets = SLIDER_CONFIG.effectPresets[effectName];
    if (!presets || !presets[presetName]) return;

    this.isApplyingPreset = true;

    // Aplica configurações do preset
    Object.assign(SLIDER_CONFIG.settings, presets[presetName]);

    // Atualiza shader
    this.shaderManager.updateUniforms();

    this.pane.refresh();

    setTimeout(() => {
      this.isApplyingPreset = false;
    }, 100);
  }

  show() {
    const paneElement = document.querySelector(".tp-dfwv");
    if (paneElement) {
      paneElement.style.display = "block";
    }
  }

  _hide() {
    const paneElement = document.querySelector(".tp-dfwv");
    if (paneElement) {
      paneElement.style.display = "none";
    }
  }

  toggle() {
    const paneElement = document.querySelector(".tp-dfwv");
    if (paneElement) {
      paneElement.style.display =
        paneElement.style.display === "none" ? "block" : "none";
    }
  }

  refresh() {
    this.pane.refresh();
  }

  dispose() {
    if (this.pane) {
      this.pane.dispose();
    }
  }
}
