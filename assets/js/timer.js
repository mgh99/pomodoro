/* ===========================
   timer.js
   Lógica del temporizador
=========================== */
const Timer = (() => {

  const CIRCUMFERENCE = 2 * Math.PI * 90; // 565.48

  let totalSeconds  = 0;
  let remaining     = 0;
  let intervalId    = null;
  let isRunning     = false;
  let onTickCb      = null;
  let onCompleteCb  = null;

  const els = {
    minutes:  document.getElementById('timer-minutes'),
    seconds:  document.getElementById('timer-seconds'),
    ring:     document.getElementById('ring-progress'),
    btnStart: document.getElementById('btn-start'),
  };

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateDisplay() {
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    els.minutes.textContent = pad(m);
    els.seconds.textContent = pad(s);

    // Progreso del anillo SVG
    const progress = totalSeconds > 0 ? remaining / totalSeconds : 1;
    els.ring.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);

    // Título del documento
    document.title = `${pad(m)}:${pad(s)} — Pomodoro`;
  }

  function tick() {
    if (remaining <= 0) {
      stop();
      if (onCompleteCb) onCompleteCb();
      return;
    }
    remaining--;
    updateDisplay();
    if (onTickCb) onTickCb(remaining, totalSeconds);
  }

  function start() {
    if (isRunning) return;
    isRunning = true;
    els.btnStart.textContent = 'Pausar';
    intervalId = setInterval(tick, 1000);
  }

  function pause() {
    if (!isRunning) return;
    isRunning = false;
    els.btnStart.textContent = 'Reanudar';
    clearInterval(intervalId);
  }

  function stop() {
    isRunning = false;
    clearInterval(intervalId);
    els.btnStart.textContent = 'Iniciar';
  }

  function reset(seconds) {
    stop();
    totalSeconds = seconds;
    remaining    = seconds;
    updateDisplay();
  }

  function toggle() {
    isRunning ? pause() : start();
  }

  function onTick(cb)     { onTickCb = cb; }
  function onComplete(cb) { onCompleteCb = cb; }
  function getRemaining()  { return remaining; }
  function getRunning()    { return isRunning; }

  return { start, pause, stop, reset, toggle, onTick, onComplete, getRemaining, getRunning, updateDisplay };
})();
