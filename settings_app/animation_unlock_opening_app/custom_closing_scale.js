// Scale Closing =======================

// input & hiển thị time
const timeScaleClosinginput = document.getElementById("timeScaleClosing");
const timeScaleClosingVal = document.getElementById("timeScaleClosingVal");

timeScaleClosinginput.value =
  parseFloat(localStorage.getItem("timeScaleClosing")) || 0.5;
timeScaleClosingVal.textContent =
  parseFloat(localStorage.getItem("timeScaleClosing")) || 0.5;

function timeScaleClosinginputEvent(e) {
  const time = parseFloat(e.target.value);
  timeScaleClosing = time * currentSpeed;

  clearInterval(idLoopScaleClosing);
  previewScaleClosing.style.transition = `all ${timeScaleClosing}s ${cubicScaleClosing}`;
  idLoopScaleClosing = setInterval(() => {
    if (loopScaleClosing) previewScaleClosing.classList.add("animation");
    else previewScaleClosing.classList.remove("animation");
    loopScaleClosing = !loopScaleClosing;
  }, timeScaleClosing * 1000);

  timeScaleClosingVal.textContent = time;
  localStorage.setItem("timeScaleClosing", time);
}

const previewScaleClosing = document.getElementById("previewScaleClosing");
let loopScaleClosing = true;

previewScaleClosing.style.transition = `all ${timeScaleClosing}s ${cubicScaleClosing}`;
let idLoopScaleClosing = setInterval(() => {
  if (loopScaleClosing) previewScaleClosing.classList.add("animation");
  else previewScaleClosing.classList.remove("animation");
  loopScaleClosing = !loopScaleClosing;
}, timeScaleClosing * 1000);

// damping
const dampingScaleClosinginput = document.getElementById("dampingScaleClosing");
const dampingScaleClosingVal = document.getElementById(
  "dampingScaleClosingVal"
);

dampingScaleClosinginput.value =
  parseFloat(localStorage.getItem("dampingScaleClosing")) || 0;
dampingScaleClosingVal.textContent =
  parseFloat(localStorage.getItem("dampingScaleClosing")) || 0;

function dampingScaleClosinginputEvent(e) {
  const val = parseFloat(e.target.value);
  cubicScaleClosing = `cubic-bezier(.25,.1,${
    parseFloat(localStorage.getItem("easingScaleClosing")) || 0.25
  },${1 + val})`;

  clearInterval(idLoopScaleClosing);
  previewScaleClosing.style.transition = `all ${timeScaleClosing}s ${cubicScaleClosing}`;
  idLoopScaleClosing = setInterval(() => {
    if (loopScaleClosing) previewScaleClosing.classList.add("animation");
    else previewScaleClosing.classList.remove("animation");
    loopScaleClosing = !loopScaleClosing;
  }, timeScaleClosing * 1000);

  dampingScaleClosingVal.textContent = val;
  localStorage.setItem("dampingScaleClosing", val);
}

// easing
const easingScaleClosinginput = document.getElementById("easingScaleClosing");
const easingScaleClosingVal = document.getElementById("easingScaleClosingVal");

easingScaleClosinginput.value =
  1 -
  (isNaN(parseFloat(localStorage.getItem("easingScaleClosing")))
    ? 0.25
    : parseFloat(localStorage.getItem("easingScaleClosing")));

easingScaleClosingVal.textContent =
  1 -
  (isNaN(parseFloat(localStorage.getItem("easingScaleClosing")))
    ? 0.25
    : parseFloat(localStorage.getItem("easingScaleClosing")));

function easingScaleClosinginputEvent(e) {
  const val = 1 - parseFloat(e.target.value);

  cubicScaleClosing = `cubic-bezier(.25,.1,${val},${
    1 + (parseFloat(localStorage.getItem("dampingScaleClosing")) || 0)
  })`;

  cubicTransformClosing = `cubic-bezier(.25,.1,${val},${
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

  easingScaleClosingVal.textContent = (1 - val).toFixed(2);
  localStorage.setItem("easingScaleClosing", val);
}
