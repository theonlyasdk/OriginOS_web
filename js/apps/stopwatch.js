import { eventBus } from '../core/event_bus.js';

let startTimeClock = 0;
let isRunningClock = false;
let intervalClock = null;
let elapsedBeforePauseClock = 0;

function padClock(num) {
  return num.toString().padStart(2, '0');
}

export function getIconSVG(name) {
  if (name === 'pause') {
    return `<svg xmlns="http://www.w3.org/2000/svg" height="60" width="60" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
  } else if (name === 'play_arrow') {
    return `<svg xmlns="http://www.w3.org/2000/svg" height="60" width="60" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
  }
  return '';
}

export function updateTimeClock() {
  const displayClock = document.getElementById('display_clock');
  const displayIsland = document.getElementById('display_island');

  const nowClock = Date.now();
  const elapsedClock = nowClock - startTimeClock + elapsedBeforePauseClock;
  const minutesClock = Math.floor(elapsedClock / 60000);
  const secondsClock = Math.floor((elapsedClock % 60000) / 1000);
  const millisecondsClock = Math.floor((elapsedClock % 1000) / 10);

  const formattedMain = `${padClock(minutesClock)}:${padClock(secondsClock)}.${padClock(millisecondsClock)}`;
  const formattedIsland = `${padClock(minutesClock)}:${padClock(secondsClock)}`;

  if (displayClock) displayClock.textContent = formattedMain;
  if (displayIsland) displayIsland.textContent = formattedIsland;

  eventBus.emit('stopwatch:tick', { elapsed: elapsedClock, formatted: formattedMain });
}

export function startClock() {
  const appClock = document.getElementById('app_clock');
  const startStopBtn = document.getElementById('startStopBtn_clock');
  const toggleBtn = document.getElementById('toggleBtn');

  if (typeof window.updateActionsMap === 'function') window.updateActionsMap();
  if (appClock) appClock.classList.add('show-split_clock');
  
  startTimeClock = Date.now();
  intervalClock = setInterval(updateTimeClock, 10);
  isRunningClock = true;
  elapsedBeforePauseClock = 0;

  if (startStopBtn) {
    startStopBtn.textContent = 'Stop';
    startStopBtn.style.pointerEvents = 'auto';
  }
  if (toggleBtn) toggleBtn.innerHTML = getIconSVG('pause');

  if (typeof window.updateActionsMap === 'function') window.updateActionsMap();
  eventBus.emit('stopwatch:start');
}

export function stopStartClock() {
  const startStopBtn = document.getElementById('startStopBtn_clock');
  const toggleBtn = document.getElementById('toggleBtn');

  if (isRunningClock) {
    clearInterval(intervalClock);
    elapsedBeforePauseClock += Date.now() - startTimeClock;
    isRunningClock = false;
    if (startStopBtn) startStopBtn.textContent = 'Start';
    if (toggleBtn) toggleBtn.innerHTML = getIconSVG('play_arrow');
    eventBus.emit('stopwatch:pause');
  } else {
    startTimeClock = Date.now();
    intervalClock = setInterval(updateTimeClock, 10);
    isRunningClock = true;
    if (startStopBtn) startStopBtn.textContent = 'Stop';
    if (toggleBtn) toggleBtn.innerHTML = getIconSVG('pause');
    eventBus.emit('stopwatch:resume');
  }
  if (typeof window.updateActionsMap === 'function') window.updateActionsMap();
}

export function resetClock() {
  const appClock = document.getElementById('app_clock');
  const displayClock = document.getElementById('display_clock');
  const displayIsland = document.getElementById('display_island');
  const startStopBtn = document.getElementById('startStopBtn_clock');
  const toggleBtn = document.getElementById('toggleBtn');

  clearInterval(intervalClock);
  if (startStopBtn) {
    startStopBtn.style.pointerEvents = 'none';
    startStopBtn.textContent = 'Stop';
  }
  isRunningClock = false;
  elapsedBeforePauseClock = 0;
  startTimeClock = 0;

  if (displayClock) displayClock.textContent = '00:00.00';
  if (displayIsland) displayIsland.textContent = '00:00';
  if (appClock) appClock.classList.remove('show-split_clock');
  if (toggleBtn) toggleBtn.innerHTML = getIconSVG('play_arrow');

  if (typeof window.updateActionsMap === 'function') window.updateActionsMap();
  eventBus.emit('stopwatch:reset');
}

export function initStopwatch() {
  const mainBtn = document.getElementById('mainBtn_clock');
  const startStopBtn = document.getElementById('startStopBtn_clock');
  const resetBtn = document.getElementById('resetBtn_clock');

  if (mainBtn) mainBtn.addEventListener('click', startClock);
  if (startStopBtn) startStopBtn.addEventListener('click', stopStartClock);
  if (resetBtn) resetBtn.addEventListener('click', resetClock);
}

// Global bridges
if (typeof window !== 'undefined') {
  window.stop_start_clock = stopStartClock;
  window.reset_clock = resetClock;
  window.getIconSVG = getIconSVG;
}
