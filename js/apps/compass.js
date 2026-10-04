import { eventBus } from '../core/event_bus.js';

/**
 * Compass App Logic - Minimal OPPO Aesthetic
 * Simulates and listens to device orientation with smooth interactive fallback.
 */
class CompassApp {
  constructor() {
    this.heading = 0;
    this.targetHeading = 0;
    this.isDragging = false;
    this.startX = 0;
    this.startHeading = 0;
    this.initialized = false;
    this.rafId = null;

    // Default sample coords (can be updated with Geolocation API if available)
    this.coords = {
      lat: "36°43'32\" N",
      lon: "4°29'1\" W"
    };
  }

  init() {
    const appEl = document.getElementById('app10');
    if (!appEl || this.initialized) return;
    this.initialized = true;

    this.dialEl = document.getElementById('compass_dial');
    this.headingNumEl = document.getElementById('compass_heading_num');
    this.headingCardinalEl = document.getElementById('compass_heading_cardinal');
    this.mainLabelEl = document.getElementById('compass_main_label');
    this.svgEl = document.getElementById('compass_ticks_svg');

    this.renderTicks();
    this.bindEvents();
    this.setupSensors();
    this.updateHeading(268); // Match initial preview or natural angle
  }

  renderTicks() {
    if (!this.svgEl) return;
    const center = 150;
    const radius = 135;
    const totalTicks = 120; // Every 3 degrees

    let svgInner = '';
    for (let i = 0; i < totalTicks; i++) {
      const angle = (i * 360) / totalTicks;
      const rad = (angle - 90) * (Math.PI / 180);
      const isMajor = i % 10 === 0; // Every 30 degrees
      const isMedium = i % 5 === 0; // Every 15 degrees
      const tickLength = isMajor ? 14 : isMedium ? 10 : 6;
      const strokeColor = angle === 0 ? '#00e5b0' : isMajor ? '#aaaaaa' : isMedium ? '#666666' : '#333333';
      const strokeWidth = angle === 0 ? 2 : isMajor ? 1.8 : 1;

      const x1 = center + (radius - tickLength) * Math.cos(rad);
      const y1 = center + (radius - tickLength) * Math.sin(rad);
      const x2 = center + radius * Math.cos(rad);
      const y2 = center + radius * Math.sin(rad);

      svgInner += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" />`;

      // Numbers for major ticks (0, 30, 60... 330)
      if (isMajor) {
        const textRadius = radius - tickLength - 12;
        const tx = center + textRadius * Math.cos(rad);
        const ty = center + textRadius * Math.sin(rad) + 3.5;
        const textColor = angle === 0 ? '#00e5b0' : '#777777';
        svgInner += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" font-size="9" fill="${textColor}" font-weight="${angle === 0 ? '600' : '400'}">${angle}</text>`;
      }
    }
    this.svgEl.innerHTML = svgInner;
  }

  getCardinal(deg) {
    const directions = ['North', 'NE', 'East', 'SE', 'South', 'SW', 'West', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  }

  updateHeading(rawDeg) {
    const normalized = (Math.round(rawDeg) % 360 + 360) % 360;
    this.heading = normalized;

    if (this.dialEl) {
      // Rotating the dial counter to heading
      this.dialEl.style.transform = `rotate(${-this.heading}deg)`;
    }

    if (this.headingNumEl) {
      this.headingNumEl.textContent = `${this.heading}°`;
    }

    const cardinal = this.getCardinal(this.heading);
    if (this.headingCardinalEl) {
      this.headingCardinalEl.textContent = cardinal;
    }
    if (this.mainLabelEl) {
      this.mainLabelEl.textContent = cardinal;
    }

    eventBus.emit('compass:heading', { heading: this.heading, cardinal });
  }

  bindEvents() {
    const dialContainer = document.querySelector('.compass-dial-container');
    if (!dialContainer) return;

    // Support drag / swipe gesture on dial to rotate manually
    const onStart = (clientX) => {
      this.isDragging = true;
      this.startX = clientX;
      this.startHeading = this.heading;
    };

    const onMove = (clientX) => {
      if (!this.isDragging) return;
      const deltaX = clientX - this.startX;
      this.updateHeading(this.startHeading - deltaX * 0.8);
    };

    const onEnd = () => {
      this.isDragging = false;
    };

    dialContainer.addEventListener('mousedown', (e) => onStart(e.clientX));
    window.addEventListener('mousemove', (e) => onMove(e.clientX));
    window.addEventListener('mouseup', onEnd);

    dialContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) onStart(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) onMove(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', onEnd);

    // Tab switcher
    const tabCompass = document.getElementById('tab_compass');
    const tabLevel = document.getElementById('tab_level');
    if (tabCompass && tabLevel) {
      tabCompass.addEventListener('click', () => {
        tabCompass.classList.add('active');
        tabLevel.classList.remove('active');
      });
      tabLevel.addEventListener('click', () => {
        tabLevel.classList.add('active');
        tabCompass.classList.remove('active');
      });
    }
  }

  setupSensors() {
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', (event) => {
        if (event.webkitCompassHeading) {
          this.updateHeading(event.webkitCompassHeading);
        } else if (event.alpha !== null) {
          this.updateHeading(360 - event.alpha);
        }
      });
    }

    // Attempt HTML5 Geolocation for genuine coords
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const latStr = `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}`;
        const lonStr = `${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'E' : 'W'}`;
        const latEl = document.getElementById('compass_lat');
        const lonEl = document.getElementById('compass_lon');
        if (latEl) latEl.textContent = latStr;
        if (lonEl) lonEl.textContent = lonStr;
      }, () => {});
    }
  }
}

export const compassApp = new CompassApp();

if (typeof window !== 'undefined') {
  window.OriginCompass = compassApp;
}
