const timeTransformClosinginput = document.getElementById(
  "timeTransformClosing"
);
const timeTransformClosingVal = document.getElementById(
  "timeTransformClosingVal"
);

timeTransformClosinginput.value =
  parseFloat(localStorage.getItem("timeTransformClosing")) || 0.5;
timeTransformClosingVal.textContent =
  parseFloat(localStorage.getItem("timeTransformClosing")) || 0.5;

function timeTransformClosinginputEvent(e) {
  const time = parseFloat(e.target.value);
  timeTransformClosing = time * currentSpeed;

  clearInterval(idLoopTransformClosing);
  previewTransformClosing.style.transition = `all ${timeTransformClosing}s ${cubicTransformClosing}`;
  idLoopTransformClosing = setInterval(() => {
    if (loopTransformClosing)
      previewTransformClosing.classList.add("animation");
    else previewTransformClosing.classList.remove("animation");
    loopTransformClosing = !loopTransformClosing;
  }, timeTransformClosing * 1000);

  timeTransformClosingVal.textContent = time;
  localStorage.setItem("timeTransformClosing", time);
}

const previewTransformClosing = document.getElementById(
  "previewTransformClosing"
);

let loopTransformClosing = true;

previewTransformClosing.style.transition = `all ${timeTransformClosing}s ${cubicTransformClosing}`;
let idLoopTransformClosing = setInterval(() => {
  if (loopTransformClosing) previewTransformClosing.classList.add("animation");
  else previewTransformClosing.classList.remove("animation");
  loopTransformClosing = !loopTransformClosing;
}, timeTransformClosing * 1000);

//damping

const dampingTransformClosinginput = document.getElementById(
  "dampingTransformClosing"
);
const dampingTransformClosingVal = document.getElementById(
  "dampingTransformClosingVal"
);

dampingTransformClosinginput.value =
  parseFloat(localStorage.getItem("dampingTransformClosing")) || 0;
dampingTransformClosingVal.textContent =
  parseFloat(localStorage.getItem("dampingTransformClosing")) || 0;

function dampingTransformClosinginputEvent(e) {
  const val = parseFloat(e.target.value);

  cubicTransformClosing = `cubic-bezier(.25,.1,${
    parseFloat(localStorage.getItem("easingScaleClosing")) || 0.25
  },${1 + val})`;

  clearInterval(idLoopTransformClosing);
  previewTransformClosing.style.transition = `all ${timeTransformClosing}s ${cubicTransformClosing}`;
  idLoopTransformClosing = setInterval(() => {
    if (loopTransformClosing)
      previewTransformClosing.classList.add("animation");
    else previewTransformClosing.classList.remove("animation");
    loopTransformClosing = !loopTransformClosing;
  }, timeTransformClosing * 1000);

  dampingTransformClosingVal.textContent = val;
  localStorage.setItem("dampingTransformClosing", val);
}

const reset_anim_close_app_btn = document.getElementById(
  "reset_anim_close_app_btn"
);

const timeShowingIcon = document.getElementById("timeShowingIcon");
const timeShowingIconVal = document.getElementById("timeShowingIconVal");

const delayShowingIcon = document.getElementById("delayShowingIcon");
const delayShowingIconVal = document.getElementById("delayShowingIconVal");

// Hàm riêng cho time
function updateTimeShowingIcon() {
  const val = parseFloat(timeShowingIcon.value).toFixed(2);
  timeShowingIconVal.textContent = val;
  root.style.setProperty("--bg--timeShowingIcon", `${val * currentSpeed}s`);
  localStorage.setItem("timeShowingIcon", `${val}`);
}

// Hàm riêng cho delay
function updateDelayShowingIcon() {
  const val = parseFloat(delayShowingIcon.value).toFixed(2);
  delayShowingIconVal.textContent = val;
  root.style.setProperty("--bg--delayShowingIcon", `${val * currentSpeed}s`);
  localStorage.setItem("delayShowingIcon", `${val}`);
}

const sensitivityNavBar = document.getElementById("sensitivityNavBar");
const sensitivityNavBarVal = document.getElementById("sensitivityNavBarVal");
sensitivityNavBarVal.textContent =
  parseFloat(localStorage.getItem("sensitivityNavBar")) || 0.08;
sensitivityNavBar.value =
  parseFloat(localStorage.getItem("sensitivityNavBar")) || 0.08;

const maxDragNav = document.getElementById("maxDragNav");
const maxDragNavVal = document.getElementById("maxDragNavVal");
maxDragNavVal.textContent =
  parseFloat(localStorage.getItem("maxDragNav")) || 150;
maxDragNav.value = parseFloat(localStorage.getItem("maxDragNav")) || 150;

// Hàm riêng cho time
function sensitivityNavBarEvent() {
  const val = parseFloat(sensitivityNavBar.value).toFixed(2);
  sensitivityNavBarVal.textContent = val;
  sensitivityNav = val;
  localStorage.setItem("sensitivityNavBar", `${val}`);
}

// Hàm riêng cho delay
function maxDragNavEvent() {
  const val = parseFloat(maxDragNav.value).toFixed(2);
  maxDragNavVal.textContent = val;
  maxNav = val;
  localStorage.setItem("maxDragNav", `${val}`);
}

function resetBtnClosingAppAnimCustom() {
  const valTimeTransform = 0.5;
  timeTransformClosing = valTimeTransform * currentSpeed;
  timeTransformClosingVal.textContent = valTimeTransform;
  timeTransformClosinginput.value = valTimeTransform;

  const valDampingTransform = 0;
  cubicTransformClosing = `cubic-bezier(.25,.1,.25,${1 + valDampingTransform})`;
  dampingTransformClosinginput.value = valDampingTransform;
  dampingTransformClosingVal.textContent = valDampingTransform;

  localStorage.setItem("timeTransformClosing", valTimeTransform);
  localStorage.setItem("dampingTransformClosing", valDampingTransform);

  clearInterval(idLoopTransformClosing);
  previewTransformClosing.style.transition = `all ${timeTransformClosing}s ${cubicTransformClosing}`;
  idLoopTransformClosing = setInterval(() => {
    if (loopTransformClosing)
      previewTransformClosing.classList.add("animation");
    else previewTransformClosing.classList.remove("animation");
    loopTransformClosing = !loopTransformClosing;
  }, timeTransformClosing * 1000);

  //scale
  const time = 0.5;
  timeScaleClosing = time * currentSpeed;
  timeScaleClosingVal.textContent = time;
  timeScaleClosinginput.value = time;

  const valScaleClosing = 0;
  cubicScaleClosing = `cubic-bezier(.25,.1,.25,${1 + valScaleClosing})`;
  dampingScaleClosinginput.value = valScaleClosing;
  dampingScaleClosingVal.textContent = valScaleClosing;

  localStorage.setItem("timeScaleClosing", time);
  localStorage.setItem("dampingScaleClosing", valScaleClosing);

  clearInterval(idLoopScaleClosing);
  previewScaleClosing.style.transition = `all ${timeScaleClosing}s ${cubicScaleClosing}`;
  idLoopScaleClosing = setInterval(() => {
    if (loopScaleClosing) previewScaleClosing.classList.add("animation");
    else previewScaleClosing.classList.remove("animation");
    loopScaleClosing = !loopScaleClosing;
  }, timeScaleClosing * 1000);

  // easing

  const valeasing = 0.25;
  easingScaleClosinginput.value = 0.75;

  cubicScaleClosing = `cubic-bezier(.25,.1,${valeasing},${
    1 + (parseFloat(localStorage.getItem("dampingScaleClosing")) || 0)
  })`;

  cubicTransformClosing = `cubic-bezier(.25,.1,${valeasing},${
    1 + (parseFloat(localStorage.getItem("dampingTransformClosing")) || 0)
  })`;

  clearInterval(idLoopScaleClosing);
  previewScaleClosing.style.transition = `all ${timeScaleClosing}s ${cubicScaleClosing}`;
  previewTransformClosing.style.transition = `all ${timeTransformClosing}s ${cubicTransformClosing}`;

  idLoopScaleClosing = setInterval(() => {
    if (loopScaleClosing) previewScaleClosing.classList.add("animation");
    else previewScaleClosing.classList.remove("animation");
    loopScaleClosing = !loopScaleClosing;
  }, (timeScaleClosing + 0.1) * 1000);

  easingScaleClosingVal.textContent = 0.75;
  localStorage.setItem("easingScaleClosing", valeasing.toFixed(2));

  const timeShowingIconAppClosingTmp2 = 0.3;
  timeShowingIcon.value = 0.3;
  timeShowingIconVal.textContent = timeShowingIconAppClosingTmp2;
  root.style.setProperty(
    "--bg--timeShowingIcon",
    `${timeShowingIconAppClosingTmp2 * currentSpeed}s`
  );
  localStorage.setItem("timeShowingIcon", `${timeShowingIconAppClosingTmp2}`);

  const delayShowingIconAppClosingTmp2 = 0.05;
  delayShowingIcon.value = 0.05;
  delayShowingIconVal.textContent = delayShowingIconAppClosingTmp2;
  root.style.setProperty(
    "--bg--delayShowingIcon",
    `${delayShowingIconAppClosingTmp2 * currentSpeed}s`
  );
  localStorage.setItem("delayShowingIcon", `${delayShowingIconAppClosingTmp2}`);

  sensitivityNavBarVal.textContent = 0.08;
  sensitivityNavBar.value = 0.08;
  maxDragNavVal.textContent = 150;
  maxDragNav.value = 150;
  sensitivityNav = 0.08;
  maxNav = 150;

  localStorage.setItem("sensitivityNavBar", 0.08);
  localStorage.setItem("maxDragNav", 150);
}
function addEventCustomSclosing() {
  // transform
  timeTransformClosinginput.addEventListener(
    "input",
    timeTransformClosinginputEvent
  );
  dampingTransformClosinginput.addEventListener(
    "input",
    dampingTransformClosinginputEvent
  );

  // scale
  timeScaleClosinginput.addEventListener("input", timeScaleClosinginputEvent);
  dampingScaleClosinginput.addEventListener(
    "input",
    dampingScaleClosinginputEvent
  );
  easingScaleClosinginput.addEventListener(
    "input",
    easingScaleClosinginputEvent
  );

  // icon
  timeShowingIcon.addEventListener("input", updateTimeShowingIcon);
  delayShowingIcon.addEventListener("input", updateDelayShowingIcon);

  sensitivityNavBar.addEventListener("input", sensitivityNavBarEvent);
  maxDragNav.addEventListener("input", maxDragNavEvent);

  // reset
  reset_anim_close_app_btn.addEventListener(
    "click",
    resetBtnClosingAppAnimCustom
  );
}

function removeEventCustomSclosing() {
  // transform
  timeTransformClosinginput.removeEventListener(
    "input",
    timeTransformClosinginputEvent
  );
  dampingTransformClosinginput.removeEventListener(
    "input",
    dampingTransformClosinginputEvent
  );

  // scale
  timeScaleClosinginput.removeEventListener(
    "input",
    timeScaleClosinginputEvent
  );
  dampingScaleClosinginput.removeEventListener(
    "input",
    dampingScaleClosinginputEvent
  );
  easingScaleClosinginput.removeEventListener(
    "input",
    easingScaleClosinginputEvent
  );

  sensitivityNavBar.removeEventListener("input", sensitivityNavBarEvent);
  maxDragNav.removeEventListener("input", maxDragNavEvent);

  // icon
  timeShowingIcon.removeEventListener("input", updateTimeShowingIcon);
  delayShowingIcon.removeEventListener("input", updateDelayShowingIcon);

  // reset
  reset_anim_close_app_btn.removeEventListener(
    "click",
    resetBtnClosingAppAnimCustom
  );
}
