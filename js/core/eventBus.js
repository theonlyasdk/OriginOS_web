/**
 * OriginOS EventBus
 * Lightweight pub/sub message broker for decoupled inter-module & app communications.
 */
class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * Subscribe to an event
   * @param {string} event 
   * @param {Function} callback 
   * @returns {Function} unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  /**
   * Subscribe to an event once
   * @param {string} event 
   * @param {Function} callback 
   */
  once(event, callback) {
    const wrapper = (payload) => {
      this.off(event, wrapper);
      callback(payload);
    };
    this.on(event, wrapper);
  }

  /**
   * Unsubscribe from an event
   * @param {string} event 
   * @param {Function} callback 
   */
  off(event, callback) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).delete(callback);
    if (this.listeners.get(event).size === 0) {
      this.listeners.delete(event);
    }
  }

  /**
   * Publish an event to all subscribers
   * @param {string} event 
   * @param {*} payload 
   */
  emit(event, payload) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`[EventBus] Error in listener for event "${event}":`, err);
        }
      });
    }
  }

  /**
   * Clear all event listeners
   */
  clear() {
    this.listeners.clear();
  }
}

export const eventBus = new EventBus();

// Also attach to window for backwards-compatible access across legacy scripts
if (typeof window !== 'undefined') {
  window.OriginEventBus = eventBus;
}
