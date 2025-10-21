export class EventBus {
  constructor() {
    this.events = new Map();
  }

  /**
   * Registra um listener para um evento
   * @param {string} eventName - Nome do evento
   * @param {Function} callback - Função a ser executada
   * @param {Object} context - Contexto de execução (opcional)
   */
  on(eventName, callback, context = null) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    this.events.get(eventName).push({
      callback,
      context,
      once: false,
    });
  }

  /**
   * Registra um listener que será executado apenas uma vez
   * @param {string} eventName - Nome do evento
   * @param {Function} callback - Função a ser executada
   * @param {Object} context - Contexto de execução (opcional)
   */
  once(eventName, callback, context = null) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    this.events.get(eventName).push({
      callback,
      context,
      once: true,
    });
  }

  /**
   * Remove um listener específico
   * @param {string} eventName - Nome do evento
   * @param {Function} callback - Função a ser removida
   * @param {Object} context - Contexto de execução (opcional)
   */
  off(eventName, callback, context = null) {
    if (!this.events.has(eventName)) return;

    const listeners = this.events.get(eventName);
    const index = listeners.findIndex(
      (listener) =>
        listener.callback === callback && listener.context === context
    );

    if (index > -1) {
      listeners.splice(index, 1);
    }

    // Remove o array se estiver vazio
    if (listeners.length === 0) {
      this.events.delete(eventName);
    }
  }

  /**
   * Remove todos os listeners de um evento
   * @param {string} eventName - Nome do evento
   */
  offAll(eventName) {
    this.events.delete(eventName);
  }

  /**
   * Emite um evento para todos os listeners registrados
   * @param {string} eventName - Nome do evento
   * @param {...any} args - Argumentos a serem passados
   */
  emit(eventName, ...args) {
    if (!this.events.has(eventName)) return;

    const listeners = [...this.events.get(eventName)]; // Cópia para evitar problemas com remoção durante iteração

    listeners.forEach((listener) => {
      try {
        if (listener.context) {
          listener.callback.call(listener.context, ...args);
        } else {
          listener.callback(...args);
        }

        // Remove listeners "once" após execução
        if (listener.once) {
          this.off(eventName, listener.callback, listener.context);
        }
      } catch (error) {
        console.error(
          `Erro ao executar listener para evento "${eventName}":`,
          error
        );
      }
    });
  }

  /**
   * Verifica se há listeners para um evento
   * @param {string} eventName - Nome do evento
   * @returns {boolean}
   */
  hasListeners(eventName) {
    return this.events.has(eventName) && this.events.get(eventName).length > 0;
  }

  /**
   * Retorna o número de listeners para um evento
   * @param {string} eventName - Nome do evento
   * @returns {number}
   */
  listenerCount(eventName) {
    return this.events.has(eventName) ? this.events.get(eventName).length : 0;
  }

  /**
   * Remove todos os eventos e listeners
   */
  clear() {
    this.events.clear();
  }

  /**
   * Retorna uma lista de todos os eventos registrados
   * @returns {string[]}
   */
  getEventNames() {
    return Array.from(this.events.keys());
  }

  /**
   * Debug: Mostra informações sobre os eventos registrados
   */
  debug() {
    console.group("EventBus Debug Info");
    for (const [eventName, listeners] of this.events) {
      console.log(`${eventName}: ${listeners.length} listener(s)`);
      listeners.forEach((listener, index) => {
        console.log(
          `  ${index + 1}. ${listener.callback.name || "anonymous"} ${
            listener.once ? "(once)" : ""
          }`
        );
      });
    }
    console.groupEnd();
  }
}

// Instância singleton do EventBus
export const eventBus = new EventBus();
