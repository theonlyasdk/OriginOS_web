import { eventBus } from './core/event_bus.js';
import { state } from './core/state.js';
import * as calculator from './apps/calculator.js';
import * as music from './apps/music.js';
import * as stopwatch from './apps/stopwatch.js';
import * as toastAndAlerts from './system/toast_and_alerts.js';
import { compassApp } from './apps/compass.js';
import { calendarApp } from './apps/calendar.js';

/**
 * OriginOS Application Bootstrapper
 * Coordinates core subsystems, template injection, and OS lifecycle.
 */
export class OriginOS {
  constructor() {
    this.eventBus = eventBus;
    this.state = state;
    this.apps = {
      calculator,
      music,
      stopwatch,
      toastAndAlerts,
      compass: compassApp,
      calendar: calendarApp
    };
  }

  /**
   * Helper to load and mount HTML templates dynamically into a host element
   * @param {string} url - Template URL
   * @param {HTMLElement|string} target - Target element or selector
   */
  async loadTemplate(url, target) {
    try {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el) return;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const html = await res.text();
      el.innerHTML = html;
      this.eventBus.emit('template:loaded', { url, target });
    } catch (err) {
      console.warn(`[OriginOS] Failed loading template from ${url}:`, err);
    }
  }

  init() {
    console.log('[OriginOS] OS Core Initialized');
    this.apps.calculator.calculatorApp.init();
    this.apps.compass.init();
    this.apps.calendar.init();
    this.eventBus.emit('system:ready');
  }
}

export const os = new OriginOS();

if (typeof window !== 'undefined') {
  window.OriginOS = os;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => os.init());
  } else {
    os.init();
  }
}
