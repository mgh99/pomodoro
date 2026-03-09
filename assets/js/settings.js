/* ===========================
   settings.js
   Gestión del modal de configuración
=========================== */
const Settings = (() => {

  let current = Storage.getSettings();

  const els = {
    modal:     () => document.getElementById('modal-settings'),
    btnOpen:   () => document.getElementById('btn-settings'),
    btnClose:  () => document.getElementById('btn-close-settings'),
    btnSave:   () => document.getElementById('btn-save-settings'),
    pomodoro:  () => document.getElementById('input-pomodoro'),
    short:     () => document.getElementById('input-short'),
    long:      () => document.getElementById('input-long'),
    cycles:    () => document.getElementById('input-cycles'),
    sound:     () => document.getElementById('input-sound'),
    auto:      () => document.getElementById('input-auto'),
  };

  function open() {
    // Rellenar inputs con valores actuales
    els.pomodoro().value = current.pomodoro;
    els.short().value    = current.short;
    els.long().value     = current.long;
    els.cycles().value   = current.cycles;
    els.sound().checked  = current.sound;
    els.auto().checked   = current.auto;
    els.modal().classList.remove('hidden');
  }

  function close() {
    els.modal().classList.add('hidden');
  }

  function save() {
    current = {
      pomodoro: Math.max(1, parseInt(els.pomodoro().value) || 25),
      short:    Math.max(1, parseInt(els.short().value)    || 5),
      long:     Math.max(1, parseInt(els.long().value)     || 15),
      cycles:   Math.max(1, parseInt(els.cycles().value)   || 4),
      sound:    els.sound().checked,
      auto:     els.auto().checked,
    };
    Storage.saveSettings(current);
    close();
    // Notificar al resto de la app
    document.dispatchEvent(new CustomEvent('settings:saved', { detail: current }));
  }

  function get() { return { ...current }; }

  function init() {
    els.btnOpen().addEventListener('click', open);
    els.btnClose().addEventListener('click', close);
    els.btnSave().addEventListener('click', save);
    // Cerrar al hacer click fuera del modal
    els.modal().addEventListener('click', (e) => {
      if (e.target === els.modal()) close();
    });
  }

  return { init, get };
})();
