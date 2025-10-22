// src/core/NavigationController.js

import { SLIDER_CONFIG, SLIDES_DATA } from "../config/slide.config";

/**
 * NAVIGATION CONTROLLER
 * Responsabilidade: Gerenciar navegação, índices, progresso e eventos
 * Princípio: Single Responsibility
 */
export class NavigationController {
  constructor(textureLoader, transitionManager) {
    this.textureLoader = textureLoader;
    this.transitionManager = transitionManager;

    this.currentIndex = 0;
    this.slides = SLIDES_DATA;
    this.enabled = false;

    // Progress tracking
    this.progressTimer = null;
    this.autoSlideTimer = null;
    this.progressUpdateInterval = 50; // ms

    // Touch support
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.minSwipeDistance = 50;

    this._setupEventListeners();
  }

  /**
   * Inicia o slider após texturas carregadas
   */
  start() {
    if (!this.textureLoader.isLoaded) {
      console.warn("Textures not loaded yet");
      return;
    }

    this.enabled = true;
    this._updateUI();
    this._startAutoSlide();
  }

  /**
   * Para o slider
   */
  stop() {
    this.enabled = false;
    this._stopAllTimers();
  }

  /**
   * Navega para um slide específico
   * @param {number} targetIndex - Índice do slide destino
   */
  async navigateTo(targetIndex) {
    // Validações
    if (!this.enabled) return;
    if (this.transitionManager.inProgress) return;
    if (targetIndex === this.currentIndex) return;
    if (targetIndex < 0 || targetIndex >= this.slides.length) return;

    // Para timers
    this._stopAllTimers();
    this._quickResetProgress(this.currentIndex);

    // Pega texturas
    const currentTexture = this.textureLoader.getTexture(this.currentIndex);
    const targetTexture = this.textureLoader.getTexture(targetIndex);

    if (!currentTexture || !targetTexture) return;

    // Atualiza índice ANTES da transição
    this.currentIndex = targetIndex;
    this._updateUI();

    // Executa transição
    await this.transitionManager.transition(
      currentTexture,
      targetTexture,
      () => {
        // Callback: Reinicia auto-slide após transição
        this._startAutoSlide(100);
      }
    );
  }

  /**
   * Próximo slide
   */
  next() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.navigateTo(nextIndex);
  }

  /**
   * Slide anterior
   */
  previous() {
    const prevIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.navigateTo(prevIndex);
  }

  /**
   * Inicia auto-slide com delay opcional
   * @param {number} delay - Delay em ms antes de iniciar
   */
  _startAutoSlide(delay = 0) {
    if (!this.enabled) return;

    this._stopAllTimers();

    const startTimer = () => {
      let progress = 0;
      const slideDuration = SLIDER_CONFIG.settings.autoSlideSpeed;
      const increment = (100 / slideDuration) * this.progressUpdateInterval;

      this.progressTimer = setInterval(() => {
        if (!this.enabled) {
          this._stopAllTimers();
          return;
        }

        progress += increment;
        this._updateSlideProgress(this.currentIndex, progress);

        if (progress >= 100) {
          this._stopProgressTimer();
          this._fadeSlideProgress(this.currentIndex);

          // Auto-avança
          if (!this.transitionManager.inProgress) {
            this.next();
          }
        }
      }, this.progressUpdateInterval);
    };

    if (delay > 0) {
      this.autoSlideTimer = setTimeout(startTimer, delay);
    } else {
      startTimer();
    }
  }

  /**
   * Para todos os timers
   */
  _stopAllTimers() {
    this._stopProgressTimer();

    if (this.autoSlideTimer) {
      clearTimeout(this.autoSlideTimer);
      this.autoSlideTimer = null;
    }
  }

  /**
   * Para apenas o timer de progresso
   */
  _stopProgressTimer() {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  /**
   * Atualiza UI (navegação e contador)
   * Princípio: Tell, Don't Ask
   */
  _updateUI() {
    this._updateNavigationState(this.currentIndex);
    this._updateCounter(this.currentIndex);
  }

  /**
   * Atualiza estado visual da navegação
   */
  _updateNavigationState(activeIndex) {
    const navItems = document.querySelectorAll(".slide-nav-item");
    navItems.forEach((item, index) => {
      item.classList.toggle("active", index === activeIndex);
    });
  }

  /**
   * Atualiza contador de slides
   */
  _updateCounter(index) {
    const slideNumber = document.getElementById("slideNumber");
    const slideTotal = document.getElementById("slideTotal");

    if (slideNumber) {
      slideNumber.textContent = String(index + 1).padStart(2, "0");
    }
    if (slideTotal) {
      slideTotal.textContent = String(this.slides.length).padStart(2, "0");
    }
  }

  /**
   * Atualiza barra de progresso visual
   */
  _updateSlideProgress(slideIndex, progress) {
    const navItems = document.querySelectorAll(".slide-nav-item");
    if (navItems[slideIndex]) {
      const progressFill = navItems[slideIndex].querySelector(
        ".slide-progress-fill"
      );
      if (progressFill) {
        progressFill.style.width = `${progress}%`;
        progressFill.style.opacity = "1";
      }
    }
  }

  /**
   * Fade out do progresso
   */
  _fadeSlideProgress(slideIndex) {
    const navItems = document.querySelectorAll(".slide-nav-item");
    if (navItems[slideIndex]) {
      const progressFill = navItems[slideIndex].querySelector(
        ".slide-progress-fill"
      );
      if (progressFill) {
        progressFill.style.opacity = "0";
        setTimeout(() => (progressFill.style.width = "0%"), 300);
      }
    }
  }

  /**
   * Reset rápido do progresso
   */
  _quickResetProgress(slideIndex) {
    const navItems = document.querySelectorAll(".slide-nav-item");
    if (navItems[slideIndex]) {
      const progressFill = navItems[slideIndex].querySelector(
        ".slide-progress-fill"
      );
      if (progressFill) {
        progressFill.style.transition = "width 0.2s ease-out";
        progressFill.style.width = "0%";
        setTimeout(() => {
          progressFill.style.transition = "width 0.1s ease, opacity 0.3s ease";
        }, 200);
      }
    }
  }

  /**
   * Cria elementos de navegação no DOM
   */
  createNavigationUI() {
    const navContainer = document.getElementById("slidesNav");
    if (!navContainer) return;

    navContainer.innerHTML = "";

    this.slides.forEach((slide, index) => {
      const navItem = document.createElement("div");
      navItem.className = `slide-nav-item ${index === 0 ? "active" : ""}`;
      navItem.dataset.slideIndex = index;
      navItem.innerHTML = `
        <div class="slide-progress-line">
          <div class="slide-progress-fill" style="width: 0%"></div>
        </div>
        <div class="slide-nav-title">${slide.title}</div>
      `;

      // Event listener para clique
      navItem.addEventListener("click", (e) => {
        e.stopPropagation();
        const targetIndex = parseInt(navItem.dataset.slideIndex);
        this.navigateTo(targetIndex);
      });

      navContainer.appendChild(navItem);
    });
  }

  /**
   * Setup de event listeners
   * Princípio: Separation of Concerns
   */
  _setupEventListeners() {
    // Clique geral (próximo slide)
    document.addEventListener("click", (e) => {
      if (e.target.closest(".slides-navigation")) return;
      if (this.enabled && !this.transitionManager.inProgress) {
        this._stopAllTimers();
        this._quickResetProgress(this.currentIndex);
        this.next();
      }
    });

    // Teclado
    document.addEventListener("keydown", (e) => {
      if (!this.enabled || this.transitionManager.inProgress) return;

      if (e.code === "Space" || e.code === "ArrowRight") {
        e.preventDefault();
        this._stopAllTimers();
        this._quickResetProgress(this.currentIndex);
        this.next();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        this._stopAllTimers();
        this._quickResetProgress(this.currentIndex);
        this.previous();
      }
    });

    // Touch events (mobile)
    document.addEventListener("touchstart", (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener("touchend", (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this._handleSwipe();
    });

    // Visibility change (pausa quando tab não está visível)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this._stopAllTimers();
      } else if (this.enabled && !this.transitionManager.inProgress) {
        this._startAutoSlide();
      }
    });
  }

  /**
   * Gerencia swipe em mobile
   */
  _handleSwipe() {
    const swipeDistance = Math.abs(this.touchEndX - this.touchStartX);

    if (swipeDistance < this.minSwipeDistance) return;

    if (this.touchEndX < this.touchStartX) {
      // Swipe left - next
      this._stopAllTimers();
      this._quickResetProgress(this.currentIndex);
      this.next();
    } else if (this.touchEndX > this.touchStartX) {
      // Swipe right - previous
      this._stopAllTimers();
      this._quickResetProgress(this.currentIndex);
      this.previous();
    }
  }

  /**
   * Limpa recursos
   */
  dispose() {
    this._stopAllTimers();
    this.enabled = false;
  }
}
