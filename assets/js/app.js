/* ===========================
   app.js
   Punto de entrada e inicialización
=========================== */
document.addEventListener('DOMContentLoaded', () => {

  // Inicializar módulos en orden
  Settings.init();
  Session.init();
  Notifications.requestPermission();

  // Botón de inicio / pausa
  document.getElementById('btn-start').addEventListener('click', () => {
    Timer.toggle();
  });

  // Botón de reinicio
  document.getElementById('btn-reset').addEventListener('click', () => {
    const cfg = Settings.get();
    const durations = { pomodoro: cfg.pomodoro * 60, short: cfg.short * 60, long: cfg.long * 60 };
    const mode = document.body.dataset.mode || 'pomodoro';
    Timer.reset(durations[mode]);
  });

});
