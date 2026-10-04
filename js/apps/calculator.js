import { eventBus } from '../core/event_bus.js';

/**
 * iOS 26 Inspired Calculator Logic
 * Supports dual expression/result displays, formatted numbers with commas,
 * percentage, sign toggle, history drawer, and keyboard support.
 */
class CalculatorApp {
  constructor() {
    this.currentInput = '0';
    this.expression = '';
    this.history = [
      { expr: '38,670 ÷ 50,000', res: '0.7734' }
    ];
    this.lastEvaluated = false;
    this.activeOperator = null;
  }

  getDisplay() {
    return document.getElementById('display_calc');
  }

  getExprDisplay() {
    return document.getElementById('ios_calc_expr');
  }

  formatNumber(valStr) {
    if (valStr === 'Error' || valStr === 'Infinity' || valStr === 'NaN') return valStr;
    const parts = valStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  unformatNumber(valStr) {
    return valStr.replace(/,/g, '');
  }

  updateDisplay() {
    const disp = this.getDisplay();
    const exprDisp = this.getExprDisplay();
    if (disp) {
      disp.innerText = this.formatNumber(this.currentInput);
      // Shrink until the number fits, applied synchronously (no transition on the element)
      let size = 73.6; // 4.6rem
      disp.style.fontSize = size + 'px';
      while (disp.scrollWidth > disp.clientWidth && size > 28) {
        size -= 2;
        disp.style.fontSize = size + 'px';
      }
    }
    if (exprDisp) {
      exprDisp.innerText = this.expression;
    }
  }

  append(value) {
    if (this.currentInput === 'Error' || this.currentInput === 'Infinity' || this.currentInput === 'NaN') {
      this.clear();
    }

    if (this.lastEvaluated && !['+', '-', '×', ':', '%'].includes(value)) {
      this.currentInput = '0';
      this.expression = '';
      this.lastEvaluated = false;
    }

    if (value === '+/-') {
      if (this.currentInput.startsWith('-')) {
        this.currentInput = this.currentInput.slice(1);
      } else if (this.currentInput !== '0') {
        this.currentInput = '-' + this.currentInput;
      }
    } else if (value === '%') {
      try {
        const num = parseFloat(this.unformatNumber(this.currentInput)) / 100;
        this.currentInput = String(num);
      } catch {
        this.currentInput = 'Error';
      }
    } else if (value === '.') {
      if (!this.currentInput.includes('.')) {
        this.currentInput += '.';
      }
    } else if (['+', '-', '×', ':'].includes(value)) {
      const displaySymbol = value === ':' ? '÷' : value;
      this.expression = `${this.formatNumber(this.currentInput)} ${displaySymbol}`;
      this.activeOperator = value;
      this.storedValue = parseFloat(this.unformatNumber(this.currentInput));
      this.currentInput = '0';
      this.lastEvaluated = false;
    } else {
      // Numbers
      if (this.currentInput === '0') {
        this.currentInput = value;
      } else {
        this.currentInput += value;
      }
    }

    this.updateDisplay();
    eventBus.emit('calc:input', { value, current: this.currentInput });
  }

  clear() {
    this.currentInput = '0';
    this.expression = '';
    this.activeOperator = null;
    this.lastEvaluated = false;
    this.updateDisplay();
    eventBus.emit('calc:clear');
  }

  backspace() {
    if (this.currentInput === 'Error') {
      this.clear();
      return;
    }
    if (this.currentInput.length > 1) {
      this.currentInput = this.currentInput.slice(0, -1);
      if (this.currentInput === '-') this.currentInput = '0';
    } else {
      this.currentInput = '0';
    }
    this.updateDisplay();
    eventBus.emit('calc:backspace', { current: this.currentInput });
  }

  calculate() {
    if (!this.activeOperator || this.storedValue === undefined) return;

    const opSymbol = this.activeOperator === ':' ? '÷' : this.activeOperator;
    const currentNum = parseFloat(this.unformatNumber(this.currentInput));
    const fullExpr = `${this.formatNumber(String(this.storedValue))} ${opSymbol} ${this.formatNumber(this.currentInput)}`;

    let result = 0;
    switch (this.activeOperator) {
      case '+':
        result = this.storedValue + currentNum;
        break;
      case '-':
        result = this.storedValue - currentNum;
        break;
      case '×':
        result = this.storedValue * currentNum;
        break;
      case ':':
        result = currentNum !== 0 ? this.storedValue / currentNum : 'Error';
        break;
      default:
        result = currentNum;
    }

    if (typeof result === 'number') {
      // Round floating point inaccuracies
      result = parseFloat(result.toPrecision(12));
    }

    const resStr = String(result);
    this.expression = fullExpr;
    this.currentInput = resStr;
    this.lastEvaluated = true;
    this.activeOperator = null;

    // Add to history
    this.history.unshift({ expr: fullExpr, res: this.formatNumber(resStr) });
    this.renderHistory();

    this.updateDisplay();
    eventBus.emit('calc:calculated', { expression: fullExpr, result: resStr });
  }

  renderHistory() {
    const listEl = document.getElementById('ios_calc_history_list');
    if (!listEl) return;
    listEl.innerHTML = '';
    this.history.slice(0, 5).forEach(item => {
      const div = document.createElement('div');
      div.className = 'ios-calc-history-item';
      div.innerHTML = `
        <span class="ios-calc-history-expr">${item.expr}</span>
        <span class="ios-calc-history-res">${item.res}</span>
      `;
      div.addEventListener('click', () => {
        this.currentInput = this.unformatNumber(item.res);
        this.updateDisplay();
      });
      listEl.appendChild(div);
    });
  }

  init() {
    const historyBtn = document.getElementById('ios_calc_history_btn');
    const historyDrawer = document.getElementById('ios_calc_history_drawer');

    if (historyBtn && historyDrawer) {
      historyBtn.addEventListener('click', () => {
        historyDrawer.classList.toggle('show');
      });
    }

    // Hardware-keyboard Backspace support (no ⌫ key on the iOS keypad)
    document.addEventListener('keydown', (e) => {
      const appEl = document.getElementById('ios_calc_app');
      if (!appEl || appEl.offsetParent === null) return;
      if (e.key === 'Backspace') {
        e.preventDefault();
        this.backspace();
      }
    });

    this.renderHistory();
    this.updateDisplay();
  }
}

export const calculatorApp = new CalculatorApp();

// Legacy bridges for inline onclicks in HTML
if (typeof window !== 'undefined') {
  window.append_calc = (v) => calculatorApp.append(v);
  window.clearDisplay_calc = () => calculatorApp.clear();
  window.backspace_calc = () => calculatorApp.backspace();
  window.calculate_calc = () => calculatorApp.calculate();
  window.OriginCalculator = calculatorApp;
}
