import { eventBus } from '../core/event_bus.js';

/**
 * Calculator App Logic
 */
let displayCalc = null;

function getDisplay() {
  if (!displayCalc) {
    displayCalc = document.getElementById('display_calc');
  }
  return displayCalc;
}

export function appendCalc(value) {
  const display = getDisplay();
  if (!display) return;
  const current = display.innerText;

  if (current === 'Error' || current === 'Infinity' || current === 'NaN') return;

  if (value === '+/-') {
    if (current.startsWith('-')) {
      display.innerText = current.slice(1);
    } else if (current !== '0') {
      display.innerText = '-' + current;
    }
  } else if (value === '.') {
    if (current === '0') {
      display.innerText = '0.';
    } else {
      display.innerText += '.';
    }
  } else {
    if (current === '0') {
      display.innerText = value;
    } else {
      display.innerText += value;
    }
  }
  eventBus.emit('calc:input', { value, current: display.innerText });
}

export function clearDisplayCalc() {
  const display = getDisplay();
  if (!display) return;
  display.innerText = '0';
  eventBus.emit('calc:clear');
}

export function backspaceCalc() {
  const display = getDisplay();
  if (!display || display.innerText === 'Error') return;

  const text = display.innerText;
  if (text.length > 1) {
    display.innerText = text.slice(0, -1);
  } else {
    display.innerText = '0';
  }
  eventBus.emit('calc:backspace', { current: display.innerText });
}

export function calculateCalc() {
  const display = getDisplay();
  if (!display) return;
  if (display.innerText === 'Error' || display.innerText === 'Infinity' || display.innerText === 'NaN') return;

  try {
    const expression = display.innerText
      .replace(/:/g, '/')
      .replace(/×/g, '*');

    // Safe evaluation
    // eslint-disable-next-line no-eval
    const result = Function(`'use strict'; return (${expression})`)();
    display.innerText = String(result);
    eventBus.emit('calc:calculated', { expression, result });
  } catch {
    display.innerText = 'Error';
    eventBus.emit('calc:error');
  }
}

// Global bridge for legacy inline onclick attributes
if (typeof window !== 'undefined') {
  window.append_calc = appendCalc;
  window.clearDisplay_calc = clearDisplayCalc;
  window.backspace_calc = backspaceCalc;
  window.calculate_calc = calculateCalc;
}
