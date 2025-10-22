// src/core/TextureLoader.js

import * as THREE from "https://esm.sh/three";

/**
 * TEXTURE LOADER
 * Responsabilidade: Carregar e gerenciar texturas
 * Princípio: Single Responsibility
 */
export class SlideTextureLoader {
  constructor() {
    this.textures = [];
    this.loader = new THREE.TextureLoader();
    this.loadTimeout = 10000; // 10 seconds
  }

  /**
   * Carrega uma única imagem e retorna como textura
   * @param {string} src - URL da imagem
   * @returns {Promise<THREE.Texture>}
   */
  async loadTexture(src) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Timeout loading texture: ${src}`));
      }, this.loadTimeout);

      this.loader.load(
        src,
        (texture) => {
          clearTimeout(timeout);
          this._prepareTexture(texture);
          resolve(texture);
        },
        undefined,
        (error) => {
          clearTimeout(timeout);
          reject(error);
        }
      );
    });
  }

  /**
   * Carrega múltiplas imagens em paralelo
   * Princípio: KISS - Simples e direto
   * @param {Array} slides - Array de objetos com propriedade 'media'
   * @returns {Promise<Array<THREE.Texture>>}
   */
  async loadAllTextures(slides) {
    const promises = slides.map((slide, index) =>
      this.loadTexture(slide.media).catch((error) => {
        console.warn(`Failed to load texture ${index}:`, error);
        return null;
      })
    );

    const results = await Promise.all(promises);
    this.textures = results.filter((texture) => texture !== null);
    return this.textures;
  }

  /**
   * Prepara textura com configurações otimizadas
   * Regra do Escoteiro: Deixa mais limpo do que encontrou
   */
  _prepareTexture(texture) {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.userData = {
      size: new THREE.Vector2(texture.image.width, texture.image.height),
    };
  }

  /**
   * Obtém textura por índice
   * @param {number} index
   * @returns {THREE.Texture|null}
   */
  getTexture(index) {
    return this.textures[index] || null;
  }

  /**
   * Verifica se texturas foram carregadas
   * @returns {boolean}
   */
  get isLoaded() {
    return this.textures.length >= 2;
  }

  /**
   * Número total de texturas carregadas
   * @returns {number}
   */
  get count() {
    return this.textures.length;
  }

  /**
   * Limpa recursos (boa prática de memória)
   */
  dispose() {
    this.textures.forEach((texture) => {
      if (texture) texture.dispose();
    });
    this.textures = [];
  }
}
