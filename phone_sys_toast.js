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
  if (num && num.trim() !== "") logRecentCall_phone(num.trim(), "outgoing");
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

/* ---------- iOS-style Recents ---------- */
let recentsFilter_phone = "all";

function seedRecents_phone() {
  try {
    const stored = localStorage.getItem("origin_recents");
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  const now = Date.now();
  const H = 3600000;
  const seed = [
    { name: "Mom", number: "+1 (555) 010-2030", type: "incoming", at: now - 0.4 * H },
    { name: "Alex Rivera", number: "+1 (555) 014-8821", type: "missed", at: now - 2.2 * H },
    { name: "+1 (555) 077-3149", number: "+1 (555) 077-3149", type: "outgoing", at: now - 5.1 * H },
    { name: "Design Team", number: "+1 (555) 099-2018", type: "missed", at: now - 26 * H },
    { name: "Dad", number: "+1 (555) 003-7712", type: "incoming", at: now - 49 * H },
  ];
  try {
    localStorage.setItem("origin_recents", JSON.stringify(seed));
  } catch (e) {}
  return seed;
}

function getRecents_phone() {
  return seedRecents_phone();
}

function saveRecents_phone(list) {
  try {
    localStorage.setItem("origin_recents", JSON.stringify(list));
  } catch (e) {}
}

function logRecentCall_phone(number, type) {
  const list = getRecents_phone();
  list.unshift({ name: number, number, type: type || "outgoing", at: Date.now() });
  saveRecents_phone(list.slice(0, 50));
  renderRecents_phone();
}

function formatRecentTime_phone(ts) {
  const d = new Date(ts);
  const now = new Date();
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((today - day) / 86400000);
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const suffix = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  if (diffDays <= 0) return `${h12}:${m} ${suffix}`;
  if (diffDays === 1) return "Yesterday";
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  if (diffDays < 7) return days[d.getDay()];
  return `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(2)}`;
}

function renderRecents_phone() {
  const listEl = document.getElementById("recents_list_phone");
  if (!listEl) return;
  const all = getRecents_phone().slice().sort((a, b) => b.at - a.at);
  const shown = recentsFilter_phone === "missed" ? all.filter((c) => c.type === "missed") : all;
  listEl.innerHTML = "";
  if (!shown.length) {
    listEl.innerHTML = `<div class="recent-empty_phone">No Recents</div>`;
    return;
  }
  shown.forEach((c) => {
    const row = document.createElement("div");
    row.className = "recent-row_phone";
    const missed = c.type === "missed" ? " missed" : "";
    row.innerHTML = `
      <div class="recent-main_phone">
        <div class="recent-name_phone${missed}"></div>
        <div class="recent-sub_phone"></div>
      </div>
      <div class="recent-call_phone" title="Call back">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M6.62 10.79a15.53 15.53 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.4 11.4 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.57 1 1 0 0 1-.25 1.02l-2.2 2.2Z"/>
        </svg>
      </div>`;
    row.querySelector(".recent-name_phone").textContent = c.name || c.number;
    row.querySelector(".recent-sub_phone").textContent = `${formatRecentTime_phone(c.at)}`;
    row.addEventListener("click", () => {
      switchPhoneTab("dialer");
      display_phone.innerText = c.number;
    });
    row.querySelector(".recent-call_phone").addEventListener("click", (e) => {
      e.stopPropagation();
      tb_system("SIM card not found");
      logRecentCall_phone(c.number, "outgoing");
    });
    listEl.appendChild(row);
  });
}

function filterRecents_phone(mode) {
  recentsFilter_phone = mode === "missed" ? "missed" : "all";
  const a = document.getElementById("seg_all_phone");
  const m = document.getElementById("seg_missed_phone");
  if (a) a.classList.toggle("active", recentsFilter_phone === "all");
  if (m) m.classList.toggle("active", recentsFilter_phone === "missed");
  renderRecents_phone();
}

function clearRecents_phone() {
  saveRecents_phone([]);
  renderRecents_phone();
}

function switchPhoneTab(which) {
  const dialer = document.getElementById("dialer_view");
  const recents = document.getElementById("recents_view");
  const tabDialer = document.getElementById("Dialer");
  const tabRecents = document.getElementById("RecentsTab");
  const showRecents = which === "recents";
  if (dialer) dialer.style.display = showRecents ? "none" : "";
  if (recents) {
    recents.style.display = showRecents ? "flex" : "none";
    if (showRecents) renderRecents_phone();
  }
  if (tabDialer) tabDialer.classList.toggle("active", !showRecents);
  if (tabRecents) tabRecents.classList.toggle("active", showRecents);
}

renderRecents_phone();
