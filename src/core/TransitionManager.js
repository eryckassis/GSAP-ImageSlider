// src/core/TransitionManager.js

import gsap from 'gsap';
import { SLIDER_CONFIG } from '../config/slide.config';

export class TransitionManager {
  constructor(shaderManager) {
    this.shaderManager = shaderManager;
    this.isTransitioning = false;
    this.currentAnimation = null;
  }

  async transition(fromTexture, toTexture, onComplete) {
    if (this.isTransitioning) {
      console.warn('Transition already in progress');
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
          ease: 'power2.inOut',
          onComplete: () => {
            this._onTransitionComplete(toTexture, onComplete);
            resolve();
          },
        }
      );
    });
  }

  cancel() {
    if (this.currentAnimation) {
      this.currentAnimation.kill();
      this.currentAnimation = null;
    }
    this.isTransitioning = false;
  }

  _onTransitionComplete(newTexture, callback) {
    // Reset progress
    this.shaderManager.progress.value = 0;

    // Atualiza textura base
    this.shaderManager.updateTextures(newTexture, newTexture);

    this.isTransitioning = false;
    this.currentAnimation = null;

    // Executa callback externo
    if (typeof callback === 'function') {
      callback();
    }
  }

  _getTransitionDuration() {
    return SLIDER_CONFIG.settings.transitionDuration;
  }

  get inProgress() {
    return this.isTransitioning;
  }
}
