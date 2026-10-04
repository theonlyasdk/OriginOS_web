import { eventBus } from './eventBus.js';

/**
 * OriginOS State Manager
 * Centralized reactive state with localStorage persistence.
 */
class StateManager {
  constructor() {
    this.storageKey = 'origin_os_state_v1';
    this.defaultState = {
      brightness: 100,
      volume: 80,
      wifi: true,
      bluetooth: false,
      airplaneMode: false,
      flashlight: false,
      theme: 'light',
      currentWallpaper: 'wallpaper_2.png',
      isLocked: true,
      runningApps: [],
      activeApp: null,
      notifications: []
    };

    this.state = this._loadInitialState();
  }

  _loadInitialState() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return { ...this.defaultState, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('[StateManager] Failed to parse saved state, using defaults:', e);
    }
    return { ...this.defaultState };
  }

  _persist() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn('[StateManager] Failed to save state to localStorage:', e);
    }
  }

  get(key) {
    return this.state[key];
  }

  getAll() {
    return { ...this.state };
  }

  set(key, value) {
    const oldValue = this.state[key];
    if (oldValue === value) return;

    this.state[key] = value;
    this._persist();

    // Notify listeners via event bus
    eventBus.emit(`state:${key}`, { value, oldValue });
    eventBus.emit('state:change', { key, value, oldValue });
  }

  update(patch) {
    Object.entries(patch).forEach(([key, value]) => {
      this.set(key, value);
    });
  }
}

export const state = new StateManager();

if (typeof window !== 'undefined') {
  window.OriginState = state;
}
