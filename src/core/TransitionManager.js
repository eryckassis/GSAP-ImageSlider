// src/core/TransitionManager.js

import gsap from "https://esm.sh/gsap";
import { SLIDER_CONFIG } from "../config/slide.config";

/**
 * TRANSITION MANAGER
 * Responsabilidade: Gerenciar transições entre slides usando GSAP
 * Princípio: Single Responsibility + Open/Closed (fácil estender)
 */
export class TransitionManager {
  constructor(shaderManager) {
    this.shaderManager = shaderManager;
    this.isTransitioning = false;
    this.currentAnimation = null;
  }

  /**
   * Executa transição entre dois slides
   * @param {THREE.Texture} fromTexture - Textura atual
   * @param {THREE.Texture} toTexture - Próxima textura
   * @param {Function} onComplete - Callback ao completar
   * @returns {Promise<void>}
   */
  async transition(fromTexture, toTexture, onComplete) {
    if (this.isTransitioning) {
      console.warn("Transition already in progress");
      return;
    }

    this.isTransitioning = true;

    // Atualiza texturas no shader
    this.shaderManager.updateTextures(fromTexture, toTexture);

    // Cria animação GSAP
    return new Promise((resolve) => {
      this.currentAnimation = gsap.fromTo(
        this.shaderManager.progress,
        { value: 0 },
        {
          value: 1,
          duration: this._getTransitionDuration(),
          ease: "power2.inOut",
          onComplete: () => {
            this._onTransitionComplete(toTexture, onComplete);
            resolve();
          },
        }
      );
    });
  }

  /**
   * Cancela transição atual se existir
   * Princípio: Defensive Programming
   */
  cancel() {
    if (this.currentAnimation) {
      this.currentAnimation.kill();
      this.currentAnimation = null;
    }
    this.isTransitioning = false;
  }

  /**
   * Callback interno quando transição completa
   * Regra do Escoteiro: Reseta estado para próxima transição
   */
  _onTransitionComplete(newTexture, callback) {
    // Reset progress
    this.shaderManager.progress.value = 0;

    // Atualiza textura base
    this.shaderManager.updateTextures(newTexture, newTexture);

    this.isTransitioning = false;
    this.currentAnimation = null;

    // Executa callback externo
    if (typeof callback === "function") {
      callback();
    }
  }

  /**
   * Obtém duração da transição das configurações
   * Princípio: DRY - Única fonte de verdade
   */
  _getTransitionDuration() {
    return SLIDER_CONFIG.settings.transitionDuration;
  }

  /**
   * Verifica se está em transição
   */
  get inProgress() {
    return this.isTransitioning;
  }
}
