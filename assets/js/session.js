/* ===========================
   session.js
   Gestión de ciclos y modos
=========================== */
const Session = (() => {

  // Modos posibles
  const MODES = { POMODORO: 'pomodoro', SHORT: 'short', LONG: 'long' };

  let currentMode    = MODES.POMODORO;
  let cycleCount     = 0;   // Pomodoros completados en la ronda actual
  let totalPomodoros = 0;   // Acumulado del día (desde stats)

  const els = {
    tabs:        () => document.querySelectorAll('.tab'),
    dots:        () => document.querySelectorAll('.dot'),
    cycleNum:    () => document.getElementById('cycle-current'),
    statPomodoros: () => document.getElementById('stat-pomodoros'),
    statFocus:     () => document.getElementById('stat-focus'),
  };

  function getDuration(mode) {
    const cfg = Settings.get();
    const map = { pomodoro: cfg.pomodoro * 60, short: cfg.short * 60, long: cfg.long * 60 };
    return map[mode];
  }

  function applyMode(mode) {
    currentMode = mode;
    document.body.dataset.mode = mode;

    // Tabs: marcar activa
    els.tabs().forEach(tab => {
      tab.classList.toggle('active', tab.dataset.mode === mode);
    });

    // Reiniciar temporizador con la duración del modo
    Timer.reset(getDuration(mode));
  }

  function updateDots() {
    const cfg  = Settings.get();
    const dots = els.dots();
    dots.forEach((dot, i) => {
      dot.classList.remove('active', 'done');
      if (i < cycleCount)            dot.classList.add('done');
      if (i === cycleCount)          dot.classList.add('active');
    });
    els.cycleNum().textContent = cycleCount + 1;
  }

  function rebuildDots() {
    const cfg = Settings.get();
    const container = document.getElementById('cycles-dots');
    container.innerHTML = '';
    for (let i = 0; i < cfg.cycles; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot';
      container.appendChild(dot);
    }
    updateDots();
  }

  function updateStats() {
    const stats = Storage.getStats();
    els.statPomodoros().textContent = stats.pomodoros;
    els.statFocus().textContent     = stats.focusMinutes + 'm';
  }

  function onPomodoroComplete() {
    const cfg = Settings.get();

    // Guardar estadísticas
    const stats = Storage.getStats();
    stats.pomodoros++;
    stats.focusMinutes += cfg.pomodoro;
    Storage.saveStats(stats);
    updateStats();

    cycleCount++;
    const isLongBreak = cycleCount >= cfg.cycles;

    if (isLongBreak) {
      cycleCount = 0;
      Notifications.notify(MODES.POMODORO);
      Notifications.showToast('¡Ronda completa! Tómate un descanso largo 🎉');
      applyMode(MODES.LONG);
    } else {
      Notifications.notify(MODES.POMODORO);
      Notifications.showToast('¡Pomodoro completado! Descansa un momento ✅');
      applyMode(MODES.SHORT);
    }

    updateDots();
    if (cfg.auto) Timer.start();
  }

  function onBreakComplete() {
    const cfg = Settings.get();
    Notifications.notify(currentMode);
    Notifications.showToast('¡Descanso terminado! Vuelve al trabajo 💪');
    applyMode(MODES.POMODORO);
    updateDots();
    if (cfg.auto) Timer.start();
  }

  function skip() {
    Timer.stop();
    if (currentMode === MODES.POMODORO) {
      onPomodoroComplete();
    } else {
      onBreakComplete();
    }
  }

  function selectMode(mode) {
    Timer.stop();
    if (mode === MODES.POMODORO) {
      cycleCount = 0;
      updateDots();
    }
    applyMode(mode);
  }

  function init() {
    // Tabs manuales
    els.tabs().forEach(tab => {
      tab.addEventListener('click', () => selectMode(tab.dataset.mode));
    });

    // Botón skip
    document.getElementById('btn-skip').addEventListener('click', skip);

    // Escuchar cambios de configuración
    document.addEventListener('settings:saved', () => {
      rebuildDots();
      applyMode(currentMode);
    });

    // Estado inicial
    rebuildDots();
    applyMode(MODES.POMODORO);
    updateStats();

    // Registrar callback de completado en Timer
    Timer.onComplete(() => {
      if (currentMode === MODES.POMODORO) {
        onPomodoroComplete();
      } else {
        onBreakComplete();
      }
    });
  }

  return { init };
})();
