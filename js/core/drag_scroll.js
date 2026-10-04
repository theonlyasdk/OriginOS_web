/**
 * Pointer drag-to-scroll with velocity (momentum) scrolling.
 * Mouse + pen — touch keeps native scrolling (which already has momentum).
 * Usage: enableDragScroll(el, { disableSnap: true })
 */
const bound = new WeakSet();

export function enableDragScroll(el, opts = {}) {
  if (!el || bound.has(el)) return;
  bound.add(el);
  const { disableSnap = false } = opts;

  let down = false, pid = null, moved = false;
  let sx = 0, sy = 0, sl = 0, st = 0;
  let vx = 0, vy = 0, lastX = 0, lastY = 0, lastT = 0;
  let raf = 0, lastSwipe = 0, lastStamp = 0, prevSnap = '';

  const canX = () => el.scrollWidth > el.clientWidth + 1;
  const canY = () => el.scrollHeight > el.clientHeight + 1;
  const stopMomentum = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };

  el.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (e.pointerType === 'touch') return; // touch scrolls natively (already has momentum)
    down = true; pid = e.pointerId; moved = false;
    sx = e.clientX; sy = e.clientY;
    sl = el.scrollLeft; st = el.scrollTop;
    lastX = sx; lastY = sy; lastT = performance.now();
    vx = 0; vy = 0;
    stopMomentum();
    if (disableSnap) {
      prevSnap = el.style.scrollSnapType;
      el.style.scrollSnapType = 'none';
    }
    try { el.setPointerCapture(e.pointerId); } catch (_) {}
  });

  function onMove(e) {
    if (!down || (e.pointerId !== undefined && e.pointerId !== pid)) return;
    if (e.timeStamp === lastStamp) return; // same event seen via el + window
    lastStamp = e.timeStamp;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    if (!moved && Math.hypot(dx, dy) < 6) return;
    moved = true;
    lastSwipe = Date.now();
    const now = performance.now();
    const dt = Math.max(1, now - lastT);
    // Smoothed instantaneous velocity (px/ms)
    vx = vx * 0.7 + ((e.clientX - lastX) / dt) * 0.3;
    vy = vy * 0.7 + ((e.clientY - lastY) / dt) * 0.3;
    lastX = e.clientX; lastY = e.clientY; lastT = now;
    if (canX()) el.scrollLeft = sl - dx;
    if (canY()) el.scrollTop = st - dy;
  }
  el.addEventListener('pointermove', onMove);
  window.addEventListener('pointermove', onMove);

  function momentum() {
    vx *= 0.94; vy *= 0.94;
    if (Math.abs(vx) < 0.05 && Math.abs(vy) < 0.05) {
      raf = 0;
      if (disableSnap) el.style.scrollSnapType = prevSnap;
      return;
    }
    if (canX()) el.scrollLeft -= vx * 16;
    if (canY()) el.scrollTop -= vy * 16;
    raf = requestAnimationFrame(momentum);
  }

  function up(e) {
    if (!down || (e.pointerId !== undefined && e.pointerId !== pid)) return;
    down = false;
    if (moved && (Math.abs(vx) > 0.1 || Math.abs(vy) > 0.1)) {
      raf = requestAnimationFrame(momentum);
    } else if (disableSnap) {
      el.style.scrollSnapType = prevSnap;
    }
  }
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);

  // Swallow taps synthesized right after a drag
  el.addEventListener('click', (e) => {
    if (Date.now() - lastSwipe < 300) { e.stopPropagation(); e.preventDefault(); }
  }, true);

  // Never let the browser start a native drag/select gesture here
  el.addEventListener('dragstart', (e) => e.preventDefault());
  el.addEventListener('selectstart', (e) => { if (down) e.preventDefault(); });
}
