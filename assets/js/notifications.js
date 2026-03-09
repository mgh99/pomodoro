/* ===========================
   notifications.js
   Sonido y notificaciones del navegador
=========================== */
const Notifications = (() => {

  // Genera un beep con Web Audio API (sin archivo externo)
  function playBeep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.warn('No se pudo reproducir sonido:', e);
    }
  }

  async function requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  function sendNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '' });
    }
  }

  function notify(mode) {
    const cfg = Settings.get();

    if (cfg.sound) playBeep();

    const messages = {
      pomodoro: { title: '¡Pomodoro completado! 🍅', body: 'Es hora de descansar.' },
      short:    { title: '¡Descanso corto terminado!', body: 'Vuelve a enfocarte.' },
      long:     { title: '¡Descanso largo terminado!', body: 'Listo para un nuevo ciclo.' },
    };

    const msg = messages[mode] || messages.pomodoro;
    sendNotification(msg.title, msg.body);
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    // Forzar reflow para que la transición funcione
    toast.offsetHeight;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2800);
  }

  return { notify, showToast, requestPermission };
})();
