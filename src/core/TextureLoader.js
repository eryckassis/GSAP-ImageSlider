// src/core/TextureLoader.js

import * as THREE from "three";

export class SlideTextureLoader {
  constructor() {
    this.textures = [];
    this.loader = new THREE.TextureLoader();
    this.loadTimeout = 10000; // 10 seconds
  }

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

  _prepareTexture(texture) {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.userData = {
      size: new THREE.Vector2(texture.image.width, texture.image.height),
    };
  }

  getTexture(index) {
    return this.textures[index] || null;
  }

  get isLoaded() {
    return this.textures.length >= 2;
  }

  get count() {
    return this.textures.length;
  }

  dispose() {
    this.textures.forEach((texture) => {
      if (texture) texture.dispose();
    });
    this.textures = [];
  }
}
