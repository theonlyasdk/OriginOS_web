let display_phone = document.getElementById("display_phone");

function append_phone(val) {
  if (display_phone.innerText === " ") {
    display_phone.innerText = val;
  } else {
    display_phone.innerText += val;
  }
}

function backspace_phone() {
  let text = display_phone.innerText;
  if (text.length > 1) {
    display_phone.innerText = text.slice(0, -1);
  } else {
    display_phone.innerText = " ";
  }
}

function call_phone() {
  let num = display_phone.innerText;
  display_phone.innerText = " ";
  if (num != "") tb_system("SIM card not found");
}

function tb_system(message) {
  const toast = document.getElementById("systemToast");
  toast.textContent = message;
  showPopup_open_close(toast, "block", "show");

  clearTimeout(tb_system._timeout);
  tb_system._timeout = setTimeout(() => {
    hidePopup_open_close(toast, "none", "show");
  }, 3000);
}

function showPopupInput(options) {
  const {
    message = "",
    placeholder = "",
    defaultText = "",
    maxLength = null,
    buttonText = "OK",
    cancelText = "Cancel",
    onSubmit,
    onCancel,
  } = options;

  const phoneContainer = document.querySelector(".phone");

  const backdrop_alert = document.createElement("div");
  backdrop_alert.className = "popup-backdrop_alert";

  const box_alert = document.createElement("div");
  box_alert.className = "popup-box_alert";

  const msg_alert = document.createElement("div");
  msg_alert.className = "popup-message_alert";
  msg_alert.textContent = message;

  // Input container
  const inputContainer = document.createElement("div");
  inputContainer.className = "popup-input_alert";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = placeholder;
  input.value = defaultText;
  input.classList.add("editable");

  if (maxLength) {
    input.maxLength = maxLength;
    input.addEventListener("input", () => {
      if (input.value.length >= maxLength) {
        input.style.borderBottomColor = "#f65268"; // Đỏ
        tb_system(`Maximum ${maxLength} characters!`);
      } else {
        input.style.borderBottomColor = "gray";
      }
    });
  }

  inputContainer.appendChild(input);

  // Button container
  const btnContainer_alert = document.createElement("div");
  btnContainer_alert.className = "popup-btns_alert";

  // OK button
  const btn_ok = document.createElement("button");
  btn_ok.className = "popup-btn_alert ok";
  btn_ok.textContent = buttonText;

  btn_ok.onclick = () => {
    closePopup_alert(backdrop_alert);
    if (typeof onSubmit === "function") onSubmit(input.value);
  };

  // Cancel button
  const btn_cancel = document.createElement("button");
  btn_cancel.className = "popup-btn_alert secondary_alert";
  btn_cancel.textContent = cancelText;

  btn_cancel.onclick = () => {
    closePopup_alert(backdrop_alert);
    if (typeof onCancel === "function") onCancel();
  };

  btnContainer_alert.appendChild(btn_ok);
  btnContainer_alert.appendChild(btn_cancel);

  // Assemble
  box_alert.appendChild(msg_alert);
  box_alert.appendChild(inputContainer);
  box_alert.appendChild(btnContainer_alert);
  backdrop_alert.appendChild(box_alert);
  phoneContainer.appendChild(backdrop_alert);

  // Trigger animation
  setTimeout(() => {
    backdrop_alert.classList.add("show_alert");
    box_alert.classList.add("show_alert");
  }, 10);
}

function showPopup1_alert(
  message_alert,
  btnText_alert = "Got it",
  onClose_alert = null
) {
  createPopup_alert(message_alert, [
    { text: btnText_alert, action: onClose_alert },
  ]);
}

function showPopup2_alert(
  message_alert,
  yesText_alert = "Yes",
  noText_alert = "No",
  onYes_alert = null,
  onNo_alert = null
) {
  createPopup_alert(message_alert, [
    { text: yesText_alert, action: onYes_alert },
    { text: noText_alert, action: onNo_alert, secondary: true },
  ]);
}

function createPopup_alert(message_alert, buttons_alert) {
  const phoneContainer = document.querySelector(".phone");

  const backdrop_alert = document.createElement("div");
  backdrop_alert.className = "popup-backdrop_alert";

  const box_alert = document.createElement("div");
  box_alert.className = "popup-box_alert";

  const msg_alert = document.createElement("div");
  msg_alert.className = "popup-message_alert";
  msg_alert.textContent = message_alert;

  const btnContainer_alert = document.createElement("div");

  buttons_alert.forEach((btnData_alert) => {
    const btn_alert = document.createElement("button");
    btn_alert.className =
      "popup-btn_alert" + (btnData_alert.secondary ? " secondary_alert" : "");
    btn_alert.textContent = btnData_alert.text;
    btn_alert.onclick = () => {
      closePopup_alert(backdrop_alert);
      if (typeof btnData_alert.action === "function") btnData_alert.action();
    };
    btnContainer_alert.appendChild(btn_alert);
  });

  box_alert.appendChild(msg_alert);
  box_alert.appendChild(btnContainer_alert);
  backdrop_alert.appendChild(box_alert);
  phoneContainer.appendChild(backdrop_alert);

  // Trigger animation
  setTimeout(() => {
    backdrop_alert.classList.add("show_alert");
    box_alert.classList.add("show_alert");
  }, 10);
}

function closePopup_alert(backdrop_alert) {
  const box_alert = backdrop_alert.querySelector(".popup-box_alert");
  backdrop_alert.classList.remove("show_alert");
  box_alert.classList.remove("show_alert");
  setTimeout(() => backdrop_alert.remove(), 500);
}

function hideAllAlerts() {
  document
    .querySelectorAll(".popup-backdrop_alert")
    .forEach((backdrop_alert) => {
      const box_alert = backdrop_alert.querySelector(".popup-box_alert");
      backdrop_alert.classList.remove("show_alert");
      if (box_alert) box_alert.classList.remove("show_alert");
      setTimeout(() => backdrop_alert.remove(), 500);
    });
}
