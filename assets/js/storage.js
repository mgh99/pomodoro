/* ===========================
   storage.js
   Persistencia con localStorage
=========================== */
const Storage = (() => {

  const KEYS = {
    settings: 'pomodoro_settings',
    stats:    'pomodoro_stats',
  };

  function getSettings() {
    const defaults = {
      pomodoro: 25,
      short: 5,
      long: 15,
      cycles: 4,
      sound: true,
      auto: false,
    };
    try {
      const saved = JSON.parse(localStorage.getItem(KEYS.settings));
      return saved ? { ...defaults, ...saved } : defaults;
    } catch {
      return defaults;
    }
  }

  function saveSettings(settings) {
    localStorage.setItem(KEYS.settings, JSON.stringify(settings));
  }

  function getStats() {
    const today = new Date().toDateString();
    try {
      const saved = JSON.parse(localStorage.getItem(KEYS.stats));
      if (saved && saved.date === today) return saved;
    } catch { /* ignore */ }
    return { date: today, pomodoros: 0, focusMinutes: 0 };
  }

  function saveStats(stats) {
    localStorage.setItem(KEYS.stats, JSON.stringify(stats));
  }

  return { getSettings, saveSettings, getStats, saveStats };
})();
