import { eventBus } from '../core/eventBus.js';

let displayPhone = null;

function getDisplayPhone() {
  if (!displayPhone) {
    displayPhone = document.getElementById('display_phone');
  }
  return displayPhone;
}

export function appendPhone(val) {
  const display = getDisplayPhone();
  if (!display) return;
  if (display.innerText === ' ') {
    display.innerText = val;
  } else {
    display.innerText += val;
  }
  eventBus.emit('phone:digit', val);
}

export function backspacePhone() {
  const display = getDisplayPhone();
  if (!display) return;
  const text = display.innerText;
  if (text.length > 1) {
    display.innerText = text.slice(0, -1);
  } else {
    display.innerText = ' ';
  }
}

export function callPhone() {
  const display = getDisplayPhone();
  if (!display) return;
  const num = display.innerText;
  display.innerText = ' ';
  if (num.trim() !== '') {
    tbSystem('SIM card not found');
    eventBus.emit('phone:call', num);
  }
}

export function tbSystem(message) {
  const toast = document.getElementById('systemToast');
  if (!toast) return;
  toast.textContent = message;

  if (typeof window.showPopup_open_close === 'function') {
    window.showPopup_open_close(toast, 'block', 'show');
  } else {
    toast.style.display = 'block';
    toast.classList.add('show');
  }

  clearTimeout(tbSystem._timeout);
  tbSystem._timeout = setTimeout(() => {
    if (typeof window.hidePopup_open_close === 'function') {
      window.hidePopup_open_close(toast, 'none', 'show');
    } else {
      toast.style.display = 'none';
      toast.classList.remove('show');
    }
  }, 3000);

  eventBus.emit('system:toast', message);
}

export function showPopupInput(options) {
  const {
    message = '',
    placeholder = '',
    defaultText = '',
    maxLength = null,
    buttonText = 'OK',
    cancelText = 'Cancel',
    onSubmit,
    onCancel,
  } = options;

  const phoneContainer = document.querySelector('.phone');
  if (!phoneContainer) return;

  const backdropAlert = document.createElement('div');
  backdropAlert.className = 'popup-backdrop_alert';

  const boxAlert = document.createElement('div');
  boxAlert.className = 'popup-box_alert';

  const msgAlert = document.createElement('div');
  msgAlert.className = 'popup-message_alert';
  msgAlert.textContent = message;

  const inputContainer = document.createElement('div');
  inputContainer.className = 'popup-input_alert';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = placeholder;
  input.value = defaultText;
  input.classList.add('editable');

  if (maxLength) {
    input.maxLength = maxLength;
    input.addEventListener('input', () => {
      if (input.value.length >= maxLength) {
        input.style.borderBottomColor = '#f65268';
        tbSystem(`Maximum ${maxLength} characters!`);
      } else {
        input.style.borderBottomColor = 'gray';
      }
    });
  }

  inputContainer.appendChild(input);

  const btnContainerAlert = document.createElement('div');
  btnContainerAlert.className = 'popup-btns_alert';

  const btnOk = document.createElement('button');
  btnOk.className = 'popup-btn_alert ok';
  btnOk.textContent = buttonText;
  btnOk.onclick = () => {
    closePopupAlert(backdropAlert);
    if (typeof onSubmit === 'function') onSubmit(input.value);
  };

  const btnCancel = document.createElement('button');
  btnCancel.className = 'popup-btn_alert secondary_alert';
  btnCancel.textContent = cancelText;
  btnCancel.onclick = () => {
    closePopupAlert(backdropAlert);
    if (typeof onCancel === 'function') onCancel();
  };

  btnContainerAlert.appendChild(btnOk);
  btnContainerAlert.appendChild(btnCancel);

  boxAlert.appendChild(msgAlert);
  boxAlert.appendChild(inputContainer);
  boxAlert.appendChild(btnContainerAlert);
  backdropAlert.appendChild(boxAlert);
  phoneContainer.appendChild(backdropAlert);

  setTimeout(() => {
    backdropAlert.classList.add('show_alert');
    boxAlert.classList.add('show_alert');
  }, 10);
}

export function showPopup1Alert(messageAlert, btnTextAlert = 'Got it', onCloseAlert = null) {
  createPopupAlert(messageAlert, [{ text: btnTextAlert, action: onCloseAlert }]);
}

export function showPopup2Alert(messageAlert, yesTextAlert = 'Yes', noTextAlert = 'No', onYesAlert = null, onNoAlert = null) {
  createPopupAlert(messageAlert, [
    { text: yesTextAlert, action: onYesAlert },
    { text: noTextAlert, action: onNoAlert, secondary: true },
  ]);
}

export function createPopupAlert(messageAlert, buttonsAlert) {
  const phoneContainer = document.querySelector('.phone');
  if (!phoneContainer) return;

  const backdropAlert = document.createElement('div');
  backdropAlert.className = 'popup-backdrop_alert';

  const boxAlert = document.createElement('div');
  boxAlert.className = 'popup-box_alert';

  const msgAlert = document.createElement('div');
  msgAlert.className = 'popup-message_alert';
  msgAlert.textContent = messageAlert;

  const btnContainerAlert = document.createElement('div');

  buttonsAlert.forEach((btnDataAlert) => {
    const btnAlert = document.createElement('button');
    btnAlert.className = 'popup-btn_alert' + (btnDataAlert.secondary ? ' secondary_alert' : '');
    btnAlert.textContent = btnDataAlert.text;
    btnAlert.onclick = () => {
      closePopupAlert(backdropAlert);
      if (typeof btnDataAlert.action === 'function') btnDataAlert.action();
    };
    btnContainerAlert.appendChild(btnAlert);
  });

  boxAlert.appendChild(msgAlert);
  boxAlert.appendChild(btnContainerAlert);
  backdropAlert.appendChild(boxAlert);
  phoneContainer.appendChild(backdropAlert);

  setTimeout(() => {
    backdropAlert.classList.add('show_alert');
    boxAlert.classList.add('show_alert');
  }, 10);
}

export function closePopupAlert(backdropAlert) {
  if (!backdropAlert) return;
  const boxAlert = backdropAlert.querySelector('.popup-box_alert');
  backdropAlert.classList.remove('show_alert');
  if (boxAlert) boxAlert.classList.remove('show_alert');
  setTimeout(() => backdropAlert.remove(), 500);
}

export function hideAllAlerts() {
  document.querySelectorAll('.popup-backdrop_alert').forEach((backdropAlert) => {
    const boxAlert = backdropAlert.querySelector('.popup-box_alert');
    backdropAlert.classList.remove('show_alert');
    if (boxAlert) boxAlert.classList.remove('show_alert');
    setTimeout(() => backdropAlert.remove(), 500);
  });
}

// Global bridges for HTML onclick bindings and existing legacy scripts
if (typeof window !== 'undefined') {
  window.append_phone = appendPhone;
  window.backspace_phone = backspacePhone;
  window.call_phone = callPhone;
  window.tb_system = tbSystem;
  window.showPopupInput = showPopupInput;
  window.showPopup1_alert = showPopup1Alert;
  window.showPopup2_alert = showPopup2Alert;
  window.createPopup_alert = createPopupAlert;
  window.closePopup_alert = closePopupAlert;
  window.hideAllAlerts = hideAllAlerts;
}
