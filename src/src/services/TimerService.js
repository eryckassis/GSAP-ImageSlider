/**
 * Timer Service
 * Implementa Single Responsibility Principle
 * Responsável apenas por gerenciar timers e progressos
 */

import { eventBus } from "../core/EventBus.js";
import { EVENTS, TIMING } from "../utils/constants.js";
import { PerformanceUtils } from "../utils/helpers.js";

export class TimerService {
  constructor(configModel, stateModel) {
    this.configModel = configModel;
    this.stateModel = stateModel;

    // Timer state
    this.isRunning = false;
    this.isPaused = false;
    this.startTime = null;
    this.pausedTime = 0;
    this.elapsedTime = 0;

    // Interval IDs
    this.progressIntervalId = null;
    this.autoSlideTimeoutId = null;

    // Configuration
    this.updateInterval = TIMING.PROGRESS_UPDATE_INTERVAL;
    this.currentDuration = null;

    // Callbacks
    this.onProgressUpdate = null;
    this.onComplete = null;

    // Performance tracking
    this.lastUpdateTime = 0;
    this.frameCount = 0;
    this.fps = 60;

    // Bind methods
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.update = this.update.bind(this);

    this._setupVisibilityHandling();
  }

  /**
   * Inicia o timer
   * @param {number} duration - Duração em ms (opcional, usa config se não fornecida)
   * @param {Function} onProgress - Callback de progresso (opcional)
   * @param {Function} onComplete - Callback de conclusão (opcional)
   */
  start(duration = null, onProgress = null, onComplete = null) {
    if (this.isRunning && !this.isPaused) {
      console.warn("Timer já está rodando");
      return;
    }

    // Configurar duração
    this.currentDuration = duration || this.configModel.get("autoSlideSpeed");

    // Configurar callbacks
    if (onProgress) this.onProgressUpdate = onProgress;
    if (onComplete) this.onComplete = onComplete;

    // Reset state se não estiver pausado
    if (!this.isPaused) {
      this.elapsedTime = 0;
      this.pausedTime = 0;
      this.frameCount = 0;
    }

    this.startTime = performance.now() - this.pausedTime;
    this.isRunning = true;
    this.isPaused = false;
    this.lastUpdateTime = performance.now();

    // Iniciar loop de atualização
    this._startUpdateLoop();

    // Configurar timeout de conclusão
    this._scheduleCompletion();

    console.log(`⏱️ Timer iniciado: ${this.currentDuration}ms`);

    eventBus.emit(EVENTS.TIMER_START, {
      duration: this.currentDuration,
      timestamp: Date.now(),
    });
  }

  /**
   * Pausa o timer
   */
  pause() {
    if (!this.isRunning || this.isPaused) {
      console.warn("Timer não está rodando ou já está pausado");
      return;
    }

    this.isPaused = true;
    this.pausedTime = this.elapsedTime;

    this._stopUpdateLoop();
    this._clearCompletion();

    console.log("⏸️ Timer pausado");

    eventBus.emit(EVENTS.TIMER_PAUSE, {
      elapsedTime: this.elapsedTime,
      progress: this.getProgress(),
      timestamp: Date.now(),
    });
  }

  /**
   * Retoma o timer pausado
   */
  resume() {
    if (!this.isPaused) {
      console.warn("Timer não está pausado");
      return;
    }

    this.start(this.currentDuration, this.onProgressUpdate, this.onComplete);

    console.log("▶️ Timer retomado");

    eventBus.emit(EVENTS.TIMER_RESUME, {
      remainingTime: this.getRemainingTime(),
      timestamp: Date.now(),
    });
  }

  /**
   * Para o timer
   */
  stop() {
    if (!this.isRunning) {
      console.warn("Timer não está rodando");
      return;
    }

    this.isRunning = false;
    this.isPaused = false;
    this.elapsedTime = 0;
    this.pausedTime = 0;

    this._stopUpdateLoop();
    this._clearCompletion();

    console.log("⏹️ Timer parado");

    eventBus.emit(EVENTS.TIMER_STOP, {
      timestamp: Date.now(),
    });
  }

  /**
   * Reseta o timer
   */
  reset() {
    const wasRunning = this.isRunning;

    this.stop();

    if (wasRunning) {
      this.start(this.currentDuration, this.onProgressUpdate, this.onComplete);
    }

    console.log("🔄 Timer resetado");

    eventBus.emit(EVENTS.TIMER_RESET, {
      wasRunning,
      timestamp: Date.now(),
    });
  }

  /**
   * Define nova duração (ajusta em tempo real se rodando)
   * @param {number} duration - Nova duração em ms
   */
  setDuration(duration) {
    const oldDuration = this.currentDuration;
    this.currentDuration = duration;

    if (this.isRunning && !this.isPaused) {
      // Recalcular timing se timer está rodando
      const progress = this.getProgress();
      const newElapsedTime = progress * duration;
      const adjustment = newElapsedTime - this.elapsedTime;

      this.startTime -= adjustment;
      this._rescheduleCompletion();
    }

    console.log(`⏱️ Duração alterada: ${oldDuration}ms → ${duration}ms`);

    eventBus.emit(EVENTS.TIMER_DURATION_CHANGED, {
      oldDuration,
      newDuration: duration,
      isRunning: this.isRunning,
    });
  }

  /**
   * Pula para um progresso específico
   * @param {number} progress - Progresso de 0 a 1
   */
  seekTo(progress) {
    if (!this.isRunning) {
      console.warn("Timer não está rodando para fazer seek");
      return;
    }

    progress = Math.max(0, Math.min(1, progress));
    const targetElapsedTime = progress * this.currentDuration;
    const adjustment = targetElapsedTime - this.elapsedTime;

    this.startTime -= adjustment;
    this.elapsedTime = targetElapsedTime;

    if (!this.isPaused) {
      this._rescheduleCompletion();
    }

    console.log(`⏭️ Seek para: ${Math.round(progress * 100)}%`);

    eventBus.emit(EVENTS.TIMER_SEEK, {
      progress,
      elapsedTime: this.elapsedTime,
      timestamp: Date.now(),
    });
  }

  /**
   * Obtém progresso atual (0 a 1)
   * @returns {number}
   */
  getProgress() {
    if (!this.currentDuration) return 0;
    return Math.min(this.elapsedTime / this.currentDuration, 1);
  }

  /**
   * Obtém progresso em porcentagem (0 a 100)
   * @returns {number}
   */
  getProgressPercent() {
    return Math.round(this.getProgress() * 100);
  }

  /**
   * Obtém tempo decorrido em ms
   * @returns {number}
   */
  getElapsedTime() {
    return this.elapsedTime;
  }

  /**
   * Obtém tempo restante em ms
   * @returns {number}
   */
  getRemainingTime() {
    return Math.max(0, this.currentDuration - this.elapsedTime);
  }

  /**
   * Obtém tempo restante formatado
   * @returns {string}
   */
  getRemainingTimeFormatted() {
    const remaining = this.getRemainingTime();
    const seconds = Math.ceil(remaining / 1000);
    return `${seconds}s`;
  }

  /**
   * Verifica se o timer está rodando
   * @returns {boolean}
   */
  isActive() {
    return this.isRunning && !this.isPaused;
  }

  /**
   * Obtém estatísticas de performance
   * @returns {Object}
   */
  getPerformanceStats() {
    return {
      fps: this.fps,
      frameCount: this.frameCount,
      updateInterval: this.updateInterval,
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      averageUpdateTime:
        this.frameCount > 0 ? this.elapsedTime / this.frameCount : 0,
    };
  }

  /**
   * Loop principal de atualização
   * @private
   */
  update() {
    if (!this.isRunning || this.isPaused) return;

    const currentTime = performance.now();
    this.elapsedTime = currentTime - this.startTime;

    // Calcular FPS
    const deltaTime = currentTime - this.lastUpdateTime;
    if (deltaTime > 0) {
      this.fps = Math.round(1000 / deltaTime);
    }
    this.lastUpdateTime = currentTime;
    this.frameCount++;

    // Verificar se completou
    if (this.elapsedTime >= this.currentDuration) {
      this._handleCompletion();
      return;
    }

    // Callback de progresso
    if (this.onProgressUpdate) {
      try {
        this.onProgressUpdate(this.getProgress(), this.elapsedTime);
      } catch (error) {
        console.error("Erro no callback de progresso:", error);
      }
    }

    // Emitir evento de progresso (throttled)
    this._emitProgressEvent();
  }

  /**
   * Inicia loop de atualização
   * @private
   */
  _startUpdateLoop() {
    this._stopUpdateLoop();

    const updateFn = () => {
      this.update();
      if (this.isRunning && !this.isPaused) {
        this.progressIntervalId = setTimeout(updateFn, this.updateInterval);
      }
    };

    this.progressIntervalId = setTimeout(updateFn, this.updateInterval);
  }

  /**
   * Para loop de atualização
   * @private
   */
  _stopUpdateLoop() {
    if (this.progressIntervalId) {
      clearTimeout(this.progressIntervalId);
      this.progressIntervalId = null;
    }
  }

  /**
   * Agenda conclusão do timer
   * @private
   */
  _scheduleCompletion() {
    this._clearCompletion();

    const remainingTime = this.getRemainingTime();
    this.autoSlideTimeoutId = setTimeout(() => {
      this._handleCompletion();
    }, remainingTime);
  }

  /**
   * Reagenda conclusão (para mudanças de duração)
   * @private
   */
  _rescheduleCompletion() {
    if (this.isRunning && !this.isPaused) {
      this._scheduleCompletion();
    }
  }

  /**
   * Limpa timeout de conclusão
   * @private
   */
  _clearCompletion() {
    if (this.autoSlideTimeoutId) {
      clearTimeout(this.autoSlideTimeoutId);
      this.autoSlideTimeoutId = null;
    }
  }

  /**
   * Handle de conclusão do timer
   * @private
   */
  _handleCompletion() {
    this.isRunning = false;
    this.isPaused = false;

    this._stopUpdateLoop();
    this._clearCompletion();

    console.log("✅ Timer completado");

    // Callback de conclusão
    if (this.onComplete) {
      try {
        this.onComplete();
      } catch (error) {
        console.error("Erro no callback de conclusão:", error);
      }
    }

    eventBus.emit(EVENTS.TIMER_COMPLETE, {
      duration: this.currentDuration,
      timestamp: Date.now(),
    });
  }

  /**
   * Emite evento de progresso (throttled)
   * @private
   */
  _emitProgressEvent = PerformanceUtils.throttle(() => {
    eventBus.emit(EVENTS.TIMER_PROGRESS, {
      progress: this.getProgress(),
      progressPercent: this.getProgressPercent(),
      elapsedTime: this.elapsedTime,
      remainingTime: this.getRemainingTime(),
      timestamp: Date.now(),
    });
  }, 100);

  /**
   * Configura handling de visibilidade
   * @private
   */
  _setupVisibilityHandling() {
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }

  /**
   * Handle mudança de visibilidade da página
   */
  handleVisibilityChange() {
    if (document.hidden) {
      if (this.isActive()) {
        this.pause();
        this._pausedByVisibility = true;
      }
    } else {
      if (this._pausedByVisibility && this.isPaused) {
        this.resume();
        this._pausedByVisibility = false;
      }
    }
  }

  /**
   * Configura callbacks
   * @param {Function} onProgress - Callback de progresso
   * @param {Function} onComplete - Callback de conclusão
   */
  setCallbacks(onProgress, onComplete) {
    this.onProgressUpdate = onProgress;
    this.onComplete = onComplete;
  }

  /**
   * Remove callbacks
   */
  clearCallbacks() {
    this.onProgressUpdate = null;
    this.onComplete = null;
  }

  /**
   * Cria um timer de duração única (helper)
   * @param {number} duration - Duração em ms
   * @param {Function} callback - Callback a executar
   * @returns {Object} Objeto com métodos cancel
   */
  static createTimeout(duration, callback) {
    const timeoutId = setTimeout(callback, duration);

    return {
      cancel: () => clearTimeout(timeoutId),
      isActive: () => !!timeoutId,
    };
  }

  /**
   * Cria um timer que se repete (helper)
   * @param {number} interval - Intervalo em ms
   * @param {Function} callback - Callback a executar
   * @returns {Object} Objeto com métodos cancel
   */
  static createInterval(interval, callback) {
    const intervalId = setInterval(callback, interval);

    return {
      cancel: () => clearInterval(intervalId),
      isActive: () => !!intervalId,
    };
  }

  /**
   * Aguarda um tempo específico (Promise-based)
   * @param {number} ms - Tempo em ms
   * @returns {Promise}
   */
  static wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Executa função com timeout
   * @param {Function} fn - Função a executar
   * @param {number} timeout - Timeout em ms
   * @returns {Promise}
   */
  static withTimeout(fn, timeout) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Timeout de ${timeout}ms excedido`));
      }, timeout);

      Promise.resolve(fn()).then(
        (result) => {
          clearTimeout(timeoutId);
          resolve(result);
        },
        (error) => {
          clearTimeout(timeoutId);
          reject(error);
        }
      );
    });
  }

  /**
   * Destrói o timer service
   */
  destroy() {
    this.stop();

    // Remover event listeners
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange
    );

    // Limpar referências
    this.onProgressUpdate = null;
    this.onComplete = null;

    console.log("🧹 TimerService destruído");
  }
}

/**
 * Timer Simples - Classe utilitária para timers básicos
 */
export class SimpleTimer {
  constructor(duration, callback) {
    this.duration = duration;
    this.callback = callback;
    this.startTime = null;
    this.timeoutId = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;

    this.startTime = Date.now();
    this.isRunning = true;

    this.timeoutId = setTimeout(() => {
      this.isRunning = false;
      this.callback?.();
    }, this.duration);
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.isRunning = false;
  }

  getRemainingTime() {
    if (!this.isRunning) return 0;
    const elapsed = Date.now() - this.startTime;
    return Math.max(0, this.duration - elapsed);
  }

  getProgress() {
    if (!this.isRunning) return 0;
    const elapsed = Date.now() - this.startTime;
    return Math.min(elapsed / this.duration, 1);
  }
}
