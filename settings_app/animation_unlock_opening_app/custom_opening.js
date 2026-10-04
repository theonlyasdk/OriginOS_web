const previewAspect = document.getElementById("previewAspect");
const previewAll = document.getElementById("previewAll");
const timeAllInput = document.getElementById("timeAll");
const timeAllVal = document.getElementById("timeAllVal");

function saveSettings() {
  localStorage.setItem("time_all", time_all);
  localStorage.setItem("cubic_ratio", cubic_ratio);
  localStorage.setItem("cubic_all", cubic_all);
}

function updatePreviewTransition() {
  previewAspect.style.transition = `all ${time_all}s ${cubic_ratio}`;
  previewAll.style.transition = `all ${time_all}s ${cubic_all}`;
}

function setCustomCubic(x1, y1, x2, y2, typeCubic) {
  const cubic = `cubic-bezier(${x1},${y1},${x2},${y2})`;
  if (typeCubic === "ratio") {
    cubic_ratio = cubic;
  } else {
    cubic_all = cubic;
  }
  saveSettings();
  updatePreviewTransition();
}

function parseCubic(cubicStr) {
  const match = cubicStr.match(/cubic-bezier\(([^)]+)\)/);
  if (!match) return null;
  const nums = match[1].split(",").map((n) => parseFloat(n));
  return {
    p1: { x: nums[0], y: 1 - nums[1] },
    p2: { x: nums[2], y: 1 - nums[3] },
  };
}

function initBezier(sectionId, isRatio, cubicInit) {
  const section = document.getElementById(sectionId);
  const canvas = section.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const handles = section.querySelectorAll(".handle");
  const cubicLabel = section.querySelector("span[id^=cubic]");

  let points = parseCubic(cubicInit);
  if (!points) {
    points = isRatio
      ? { p1: { x: 0.07, y: 0.26 }, p2: { x: 0.37, y: 0.02 } }
      : { p1: { x: 0.25, y: 0.9 }, p2: { x: 0.75, y: 0.0 } };
  }

  function drawBezier() {
    ctx.clearRect(0, 0, 260, 260);
    ctx.strokeStyle = "#777";
    ctx.beginPath();
    ctx.moveTo(0, 260);
    ctx.lineTo(points.p1.x * 260, points.p1.y * 260);
    ctx.lineTo(points.p2.x * 260, points.p2.y * 260);
    ctx.lineTo(260, 0);
    ctx.stroke();

    ctx.strokeStyle = "#ff9800";
    ctx.beginPath();
    ctx.moveTo(0, 260);
    ctx.bezierCurveTo(
      points.p1.x * 260,
      points.p1.y * 260,
      points.p2.x * 260,
      points.p2.y * 260,
      260,
      0
    );
    ctx.stroke();

    const cubicText = `${points.p1.x.toFixed(2)}, ${(1 - points.p1.y).toFixed(
      2
    )}, ${points.p2.x.toFixed(2)}, ${(1 - points.p2.y).toFixed(2)}`;
    cubicLabel.textContent = cubicText;

    setCustomCubic(
      points.p1.x.toFixed(2),
      (1 - points.p1.y).toFixed(2),
      points.p2.x.toFixed(2),
      (1 - points.p2.y).toFixed(2),
      isRatio ? "ratio" : "all"
    );
  }

  function setHandlePosition(handle, point) {
    handle.style.left = point.x * 260 + "px";
    handle.style.top = point.y * 260 + "px";
  }

  function startDrag(handle, pointName) {
    const move = (e) => {
      let rect = canvas.getBoundingClientRect();
      let x =
        ((e.touches ? e.touches[0].clientX : e.clientX) - rect.left) / 260;
      let y = ((e.touches ? e.touches[0].clientY : e.clientY) - rect.top) / 260;
      points[pointName].x = Math.min(Math.max(x, 0), 1);
      points[pointName].y = Math.min(Math.max(y, 0), 1);
      setHandlePosition(handle, points[pointName]);
      drawBezier();
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
  }

  handles.forEach((h, i) => {
    let name = i === 0 ? "p1" : "p2";
    h.addEventListener("mousedown", () => startDrag(h, name));
    h.addEventListener("touchstart", (e) => {
      e.preventDefault();
      startDrag(h, name);
    });
  });

  setHandlePosition(handles[0], points.p1);
  setHandlePosition(handles[1], points.p2);
  drawBezier();
}

// Sự kiện thay đổi time_all
timeAllInput.value = time_all;
timeAllVal.textContent = time_all;
timeAllInput.addEventListener("input", (e) => {
  time_all = parseFloat(e.target.value);
  time_opening_app = time_all * currentSpeed;
  time_aspect_ratio_app = time_all * currentSpeed * 0.9;

  timeAllVal.textContent = time_all;
  saveSettings();
  updatePreviewTransition();
});

// Khởi tạo
updatePreviewTransition();
initBezier("section-aspect", true, cubic_ratio);
initBezier("section-all", false, cubic_all);

// Animation loop preview
let toggle = true;
setInterval(() => {
  previewAspect.style.aspectRatio = toggle ? "1 / 1" : "1 /2";
  previewAspect.style.width = "110px";
  previewAll.style.transform = toggle ? "scale(0.5)" : "scale(1.2)";
  toggle = !toggle;
}, 1000);

const scaleWallpaperAniminput = document.getElementById("scaleWallpaperAnim");
const scaleWallpaperAnimVal = document.getElementById("scaleWallpaperAnimVal");

scaleWallpaperAniminput.value =
  parseFloat(localStorage.getItem("scaleWallpaperAnim")) || 110;
scaleWallpaperAnimVal.textContent =
  parseFloat(localStorage.getItem("scaleWallpaperAnim")) || 110;
document.getElementById("wallpaperPreviewAnim").style.scale = `${
  parseFloat(localStorage.getItem("scaleWallpaperAnim")) || 110
}%`;

function scaleWallpaperAnimEvent(e) {
  const val = parseFloat(e.target.value);

  document.getElementById("wallpaperPreviewAnim").style.scale = `${val}%`;
  scaleWallpaper = val;

  scaleWallpaperAnimVal.textContent = val;
  localStorage.setItem("scaleWallpaperAnim", val);
}

const scaleAllAppinput = document.getElementById("scaleAllAppAnim");
const scaleAllAppVal = document.getElementById("scaleAllAppVal");

scaleAllAppinput.value = parseFloat(localStorage.getItem("scaleAllApp")) || 86;
scaleAllAppVal.textContent =
  parseFloat(localStorage.getItem("scaleAllApp")) || 86;
document.getElementById("scaleAllAppPreivew").style.scale = `${
  parseFloat(localStorage.getItem("scaleAllApp")) || 86
}%`;

function scaleAllAppEvent(e) {
  const val = parseFloat(e.target.value);

  document.getElementById("scaleAllAppPreivew").style.scale = `${val}%`;

  scaleAllApp = val;
  scaleAllAppReverse = 100 / val;

  scaleAllAppVal.textContent = val;
  localStorage.setItem("scaleAllApp", val);
}
function scaleAllAppEventUp() {
  if (currentOpeningBtn) {
    currentOpeningBtn.style.transition = "none";
    allApp.style.transition = "none";
    currentOpeningBtn.style.transform = `scale(${scaleAllAppReverse})`;
    allApp.style.scale = `${scaleAllApp}%`;
    lp.style.scale = `${scaleAllAppReverse}`;
  }
}

const blurAllAppinput = document.getElementById("blurAllAppAnim");
const blurAllAppVal = document.getElementById("blurAllAppVal");

blurAllAppinput.value = localStorage.getItem("blurAllApp") || 20;
blurAllAppVal.textContent = localStorage.getItem("blurAllApp") || 20;
document.getElementById("blurAllAppPreivew").style.filter = `blur(calc(${
  localStorage.getItem("blurAllApp") || 20
}px - ${localStorage.getItem("blurAllApp") || 20}px / 2))`;

function blurAllAppEvent(e) {
  const val = parseFloat(e.target.value);

  document.getElementById(
    "blurAllAppPreivew"
  ).style.filter = `blur(calc(${val}px - ${val}px / 2))`;

  blurCustomOpeing = val;
  if (localStorage.getItem("blur_App_saved"))
    lp.style.filter = `blur(${blurCustomOpeing}px)`;

  blurAllAppVal.textContent = val;
  localStorage.setItem("blurAllApp", val);
}

function updateBezierGraphs() {
  initBezier("section-aspect", true, cubic_ratio);
  initBezier("section-all", false, cubic_all);
}

const previewPositionIcon = document.getElementById("previewPositionIcon");
function itemScrollIconPositionEvent(e) {
  const item = e.currentTarget;
  const size = item.getAttribute("data-sizeIcon");
  const position = item.getAttribute("data-positionIcon");
  document.querySelectorAll(".itemScrollIconPosition").forEach((el) => {
    el.classList.remove("active");
  });
  item.classList.add("active");

  document.querySelectorAll(".box").forEach((box) => {
    box.style.setProperty("--bg--sizeIcon", size);
    box.style.setProperty("--bg--positionIcon", position);
  });
  previewPositionIcon.style.setProperty("--bg--sizeIcon", size);
  previewPositionIcon.style.setProperty("--bg--positionIcon", position);

  localStorage.setItem("sizeIcon", size);
  localStorage.setItem("positionIcon", position);
}

const timeHidingIcon = document.getElementById("timeHidingIcon");
const timeHidingIconVal = document.getElementById("timeHidingIconVal");

const delayHidingIcon = document.getElementById("delayHidingIcon");
const delayHidingIconVal = document.getElementById("delayHidingIconVal");

// Hàm riêng cho time
function updateTimeHidingIcon() {
  const val = parseFloat(timeHidingIcon.value).toFixed(2);
  timeHidingIconVal.textContent = val;
  root.style.setProperty("--bg--timeHidingIcon", `${val * currentSpeed}s`);
  localStorage.setItem("timeHidingIcon", `${val}`);
}

// Hàm riêng cho delay
function updateDelayHidingIcon() {
  const val = parseFloat(delayHidingIcon.value).toFixed(2);
  delayHidingIconVal.textContent = val;
  root.style.setProperty("--bg--delayHidingIcon", `${val * currentSpeed}s`);
  localStorage.setItem("delayHidingIcon", `${val}`);
}

function resetAnimOpenAppBtnEvent(e) {
  time_all = 0.5;
  time_opening_app = time_all * currentSpeed;
  time_aspect_ratio_app = time_all * currentSpeed * 0.9;
  cubic_ratio = "cubic-bezier(0.05,0.55,0.2,0.95)";
  cubic_all = "cubic-bezier(0.15,0.45,0.45,0.85)";

  saveSettings();

  // Cập nhật UI
  document.getElementById("timeAll").value = time_all;
  document.getElementById("timeAllVal").textContent = time_all;

  // Cập nhật đồ thị cubic
  updatePreviewTransition(true); // truyền true để ép update đồ thị theo cubic mới
  updateBezierGraphs(); // gọi để vẽ lại đồ thị

  scaleAllAppinput.value = 86;
  scaleAllAppVal.textContent = 86;
  const valScaleApp = 86;
  document.getElementById("scaleAllAppPreivew").style.scale = `${valScaleApp}%`;
  scaleAllApp = valScaleApp;
  scaleAllAppReverse = 100 / valScaleApp;
  scaleAllAppVal.textContent = valScaleApp;
  localStorage.setItem("scaleAllApp", valScaleApp);

  if (currentOpeningBtn) {
    currentOpeningBtn.style.transition = "none";
    allApp.style.transition = "none";
    currentOpeningBtn.style.transform = `scale(${scaleAllAppReverse})`;
    allApp.style.scale = `${scaleAllApp}%`;
    lp.style.scale = `${scaleAllAppReverse}`;
  }

  scaleWallpaperAniminput.value = 110;
  scaleWallpaperAnimVal.textContent = 110;
  const valScaleWallpaper = 110;
  document.getElementById(
    "wallpaperPreviewAnim"
  ).style.scale = `${valScaleWallpaper}%`;
  scaleWallpaper = valScaleWallpaper;
  scaleWallpaperAnimVal.textContent = valScaleWallpaper;
  localStorage.setItem("scaleWallpaperAnim", valScaleWallpaper);

  const timeHidingIconAppOpening = 0.3;
  timeHidingIcon.value = timeHidingIconAppOpening;
  timeHidingIconVal.textContent = timeHidingIconAppOpening;
  root.style.setProperty(
    "--bg--timeHidingIcon",
    `${timeHidingIconAppOpening * currentSpeed}s`
  );
  localStorage.setItem("timeHidingIcon", `${timeHidingIconAppOpening}`);

  const delayHidingIconAppOpening = 0;
  delayHidingIcon.value = delayHidingIconAppOpening;
  delayHidingIconVal.textContent = delayHidingIconAppOpening;
  root.style.setProperty(
    "--bg--delayHidingIcon",
    `${delayHidingIconAppOpening * currentSpeed}s`
  );
  localStorage.setItem("delayHidingIcon", `${delayHidingIconAppOpening}`);

  document.querySelectorAll(".itemScrollIconPosition").forEach((el) => {
    el.classList.remove("active");
  });

  document.querySelectorAll(".box").forEach((box) => {
    box.style.setProperty("--bg--sizeIcon", "100%");
    box.style.setProperty("--bg--positionIcon", "top");
  });
  previewPositionIcon.style.setProperty("--bg--sizeIcon", "100%");
  previewPositionIcon.style.setProperty("--bg--positionIcon", "top");

  localStorage.setItem("sizeIcon", "100%");
  localStorage.setItem("positionIcon", "top");

  const valBlur = 20;
  blurAllAppinput.value = valBlur;
  blurAllAppVal.textContent = valBlur;
  document.getElementById("blurAllAppPreivew").style.filter = `blur(15px)`;

  blurCustomOpeing = valBlur;
  if (localStorage.getItem("blur_App_saved"))
    lp.style.filter = `blur(${blurCustomOpeing}px)`;

  blurAllAppVal.textContent = valBlur;
  localStorage.setItem("blurAllApp", valBlur);
}

function addEventCustomOpening() {
  scaleWallpaperAniminput.addEventListener("input", scaleWallpaperAnimEvent);
  scaleAllAppinput.addEventListener("input", scaleAllAppEvent);
  scaleAllAppinput.addEventListener("pointerup", scaleAllAppEventUp);
  blurAllAppinput.addEventListener("input", blurAllAppEvent);

  document.querySelectorAll(".itemScrollIconPosition").forEach((item) => {
    item.addEventListener("click", itemScrollIconPositionEvent);
  });

  timeHidingIcon.addEventListener("input", updateTimeHidingIcon);
  delayHidingIcon.addEventListener("input", updateDelayHidingIcon);

  document
    .getElementById("reset_anim_open_app_btn")
    .addEventListener("click", resetAnimOpenAppBtnEvent);
}

function removeEventCustomOpening() {
  scaleWallpaperAniminput.removeEventListener("input", scaleWallpaperAnimEvent);
  scaleAllAppinput.removeEventListener("input", scaleAllAppEvent);
  scaleAllAppinput.removeEventListener("pointerup", scaleAllAppEventUp);
  blurAllAppinput.removeEventListener("input", blurAllAppEvent);

  document.querySelectorAll(".itemScrollIconPosition").forEach((item) => {
    item.removeEventListener("click", itemScrollIconPositionEvent);
  });

  timeHidingIcon.removeEventListener("input", updateTimeHidingIcon);
  delayHidingIcon.removeEventListener("input", updateDelayHidingIcon);

  document
    .getElementById("reset_anim_open_app_btn")
    .removeEventListener("click", resetAnimOpenAppBtnEvent);
}

function animationCustomByTXT({
  // Closing Transform closing
  valTimeTransform = 0.5,
  valDampingTransform = 0,

  // Closing Scale closing
  timeScale = 0.5,
  valDampingScale = 0,

  // Easing closing
  valEasing = 0.25,
  easingScaleClosing = 1 - valEasing,
  sensitivityNavBarValue = 0.08,
  maxDragNavValue = 150,

  // Opening App
  time_allTmp = 0.25,
  valScaleApp = 86,
  valScaleWallpaper = 110,
  cubic_ratioParam = "cubic-bezier(0.05,0.55,0.2,0.95)",
  cubic_allParam = "cubic-bezier(0.15,0.45,0.45,0.85)",

  timeHidingIconAppTmp = 0.3,
  delayHidingIconAppTmp = 0,

  timeShowingIconAppTmp = 0.3,
  delayShowingIconAppTmp = 0.05,
  positionIconOpening = "top",
  sizeIconOpening = "100%",

  // unlock animation
  easingForUnlockAnimation = 0.25,
  speedForUnlockAnimation = 0.6,

  animationGroupForUnlockAnimation = 1,
  animationForUnlockAnimation = 1,
} = {}) {
  document.querySelectorAll(".itemScrollIconPosition").forEach((el) => {
    el.classList.remove("active");
  });

  document.querySelectorAll(".box").forEach((box) => {
    box.style.setProperty("--bg--sizeIcon", sizeIconOpening);
    box.style.setProperty("--bg--positionIcon", positionIconOpening);
  });
  previewPositionIcon.style.setProperty("--bg--sizeIcon", sizeIconOpening);
  previewPositionIcon.style.setProperty(
    "--bg--positionIcon",
    positionIconOpening
  );

  localStorage.setItem("sizeIcon", sizeIconOpening);
  localStorage.setItem("positionIcon", positionIconOpening);

  const root = document.documentElement;
  // ---------------- Closing Transform ----------------
  timeTransformClosing = valTimeTransform * currentSpeed;
  timeTransformClosingVal.textContent = valTimeTransform;
  timeTransformClosinginput.value = valTimeTransform;

  cubicTransformClosing = `cubic-bezier(.25,.1,.25,${1 + valDampingTransform})`;
  dampingTransformClosinginput.value = valDampingTransform;
  dampingTransformClosingVal.textContent = valDampingTransform;

  localStorage.setItem("timeTransformClosing", valTimeTransform);
  localStorage.setItem("dampingTransformClosing", valDampingTransform);

  clearInterval(idLoopTransformClosing);
  previewTransformClosing.style.transition = `all ${timeTransformClosing}s ${cubicTransformClosing}`;
  idLoopTransformClosing = setInterval(() => {
    previewTransformClosing.classList.toggle("animation");
    loopTransformClosing = !loopTransformClosing;
  }, timeTransformClosing * 1000);

  // ---------------- Closing Scale ----------------
  timeScaleClosing = timeScale * currentSpeed;
  timeScaleClosingVal.textContent = timeScale;
  timeScaleClosinginput.value = timeScale;

  cubicScaleClosing = `cubic-bezier(.25,.1,.25,${1 + valDampingScale})`;
  dampingScaleClosinginput.value = valDampingScale;
  dampingScaleClosingVal.textContent = valDampingScale;

  localStorage.setItem("timeScaleClosing", timeScale);
  localStorage.setItem("dampingScaleClosing", valDampingScale);

  clearInterval(idLoopScaleClosing);
  previewScaleClosing.style.transition = `all ${timeScaleClosing}s ${cubicScaleClosing}`;
  idLoopScaleClosing = setInterval(() => {
    previewScaleClosing.classList.toggle("animation");
    loopScaleClosing = !loopScaleClosing;
  }, timeScaleClosing * 1000);

  // ---------------- Easing ----------------
  easingScaleClosinginput.value = easingScaleClosing;

  cubicScaleClosing = `cubic-bezier(.25,.1,${valEasing},${
    1 + valDampingScale
  })`;
  cubicTransformClosing = `cubic-bezier(.25,.1,${valEasing},${
    1 + valDampingTransform
  })`;

  previewScaleClosing.style.transition = `all ${timeScaleClosing}s ${cubicScaleClosing}`;
  previewTransformClosing.style.transition = `all ${timeTransformClosing}s ${cubicTransformClosing}`;

  clearInterval(idLoopScaleClosing);
  idLoopScaleClosing = setInterval(() => {
    previewScaleClosing.classList.toggle("animation");
    loopScaleClosing = !loopScaleClosing;
  }, (timeScaleClosing + 0.1) * 1000);

  easingScaleClosingVal.textContent = easingScaleClosing;
  localStorage.setItem("easingScaleClosing", valEasing.toFixed(2));

  // ---------------- Opening App ----------------
  time_all = time_allTmp;
  time_opening_app = time_all * currentSpeed;
  time_aspect_ratio_app = time_all * currentSpeed * 0.9;

  // Giờ lấy cubic từ tham số
  cubic_ratio = cubic_ratioParam;
  cubic_all = cubic_allParam;

  saveSettings();

  document.getElementById("timeAll").value = time_all;
  document.getElementById("timeAllVal").textContent = time_all;

  updatePreviewTransition(true);
  updateBezierGraphs();

  // Scale App
  scaleAllAppinput.value = valScaleApp;
  scaleAllAppVal.textContent = valScaleApp;
  document.getElementById("scaleAllAppPreivew").style.scale = `${valScaleApp}%`;
  scaleAllApp = valScaleApp;
  scaleAllAppReverse = 100 / valScaleApp;
  localStorage.setItem("scaleAllApp", valScaleApp);

  if (currentOpeningBtn) {
    currentOpeningBtn.style.transition = "none";
    allApp.style.transition = "none";
    currentOpeningBtn.style.transform = `scale(${scaleAllAppReverse})`;
    allApp.style.scale = `${valScaleApp}%`;
    lp.style.scale = `${scaleAllAppReverse}`;
  }

  // Scale Wallpaper
  scaleWallpaperAniminput.value = valScaleWallpaper;
  scaleWallpaperAnimVal.textContent = valScaleWallpaper;
  document.getElementById(
    "wallpaperPreviewAnim"
  ).style.scale = `${valScaleWallpaper}%`;
  scaleWallpaper = valScaleWallpaper;
  localStorage.setItem("scaleWallpaperAnim", valScaleWallpaper);

  const timeHidingIconAppOpening = timeHidingIconAppTmp;
  timeHidingIcon.value = timeHidingIconAppOpening;
  timeHidingIconVal.textContent = timeHidingIconAppOpening;
  root.style.setProperty(
    "--bg--timeHidingIcon",
    `${timeHidingIconAppOpening * currentSpeed}s`
  );
  localStorage.setItem("timeHidingIcon", `${timeHidingIconAppOpening}`);

  const delayHidingIconAppOpening = delayHidingIconAppTmp;
  delayHidingIcon.value = delayHidingIconAppTmp;
  delayHidingIconVal.textContent = delayHidingIconAppOpening;
  root.style.setProperty(
    "--bg--delayHidingIcon",
    `${delayHidingIconAppOpening * currentSpeed}s`
  );
  localStorage.setItem("delayHidingIcon", `${delayHidingIconAppOpening}`);

  const timeShowingIconAppClosingTmp2 = timeShowingIconAppTmp;
  timeShowingIcon.value = timeShowingIconAppTmp;
  timeShowingIconVal.textContent = timeShowingIconAppClosingTmp2;
  root.style.setProperty(
    "--bg--timeShowingIcon",
    `${timeShowingIconAppClosingTmp2 * currentSpeed}s`
  );
  localStorage.setItem("timeShowingIcon", `${timeShowingIconAppClosingTmp2}`);

  let delayShowingIconAppClosingTmp2 = delayShowingIconAppTmp;
  delayShowingIcon.value = delayShowingIconAppTmp;
  delayShowingIconVal.textContent = delayShowingIconAppClosingTmp2;
  root.style.setProperty(
    "--bg--delayShowingIcon",
    `${delayShowingIconAppClosingTmp2 * currentSpeed}s`
  );
  localStorage.setItem("delayShowingIcon", `${delayShowingIconAppClosingTmp2}`);

  sensitivityNavBarVal.textContent = sensitivityNavBarValue;
  sensitivityNavBar.value = sensitivityNavBarValue;
  sensitivityNav = sensitivityNavBarValue;

  maxDragNavVal.textContent = maxDragNavValue;
  maxDragNav.value = maxDragNavValue;
  maxNav = maxDragNavValue;

  localStorage.setItem("sensitivityNavBar", sensitivityNavBarValue);
  localStorage.setItem("maxDragNav", maxDragNavValue);

  reset_anim_unlock_btn_event(
    (animunlock = 1),
    (groupunlock = 1),
    (timeunlock = 0.6),
    (easingunlock = 0.25)
  );
}

// chỉnh tất cả
//animationCustomByTXT({
//  /* ================= OPEN APP ================= */
//  time_allTmp: 0.4, // total duration for opening animation (should be between 0.3 - 1)
//  valScaleApp: 92, // scale value for app when opening (should be between 60 - 100)
//  valScaleWallpaper: 120, // scale value for wallpaper when opening (should be between 100 - 200)
//  cubic_ratioParam: "cubic-bezier(.79,-0.25,.12,.95)", // easing curve for app scaling during opening
//  cubic_allParam: "cubic-bezier(.79,-0.25,.12,.95)", // main easing curve for opening
//  timeHidingIconAppTmp: 0.4, // time to hide the icon (should be between 0 - 0.5)
//  delayHidingIconAppTmp: 0, // delay before hiding the icon (should be between 0 - 0.5)
//
//  /* ================= CLOSE APP ================= */
//  valTimeTransform: 0.7, // transform duration when closing (should be between 0.4 - 1)
//  valDampingTransform: 0.2, // damping factor for transform when closing (should be between 0.1 - 0.25)
//  timeScale: 0.6, // scale duration when closing (should be between 0.4 - 1)
//  valDampingScale: 0.15, // damping factor for scale when closing (should be between 0.1 - 0.4)
//  valEasing: 0.35, // secondary easing factor for closing (should be between 0 - 1)

//  timeShowingIconAppTmp: 0.4, // time to show the icon (should be between 0 - 0.5)
//  delayShowingIconAppTmp: 0, // delay before showing the icon (should be between 0 - 0.5)

//  //unlock animation
//  easingForUnlockAnimation = 0.25,
//  speedForUnlockAnimation = 0.6,

//  animationGroupForUnlockAnimation = 1, // (⚠️ ONLY BETWEEN 1 - 3)
//  animationForUnlockAnimation = 1,// (⚠️ ONLY BETWEEN 1 - )
//});
