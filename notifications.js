// Minimal notifications helper - import { showNotification } from './notifications.js'
export function showNotification(message, type = 'primary', options = {}) {
  const { duration = 4000, dismissible = true } = options;
  const container = document.getElementById('notifications') || createNotificationsContainer();

  const el = document.createElement('div');
  el.className = `notification notification--${type || 'primary'}`;
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');

  const icon = document.createElement('div');
  icon.className = 'notif-icon';
  icon.innerHTML = (type === 'success') ? '✓' : (type === 'error') ? '✕' : (type === 'info') ? 'ℹ' : '•';

  const body = document.createElement('div');
  body.className = 'notif-body';
  body.textContent = message;

  el.appendChild(icon);
  el.appendChild(body);

  if (dismissible) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notif-close';
    closeBtn.setAttribute('aria-label', 'Dismiss notification');
    closeBtn.innerHTML = '✕';
    closeBtn.addEventListener('click', () => removeNotification(el, true));
    el.appendChild(closeBtn);
  }

  container.appendChild(el);

  let timeoutId = null;
  if (duration && duration > 0) {
    timeoutId = setTimeout(() => removeNotification(el), duration);
  }

  let resolved = false;
  const promise = new Promise((resolve) => { el._resolve = (val) => { if (!resolved) { resolved = true; resolve(val); } }; });

  el.removeNotification = () => removeNotification(el, true);

  function removeNotification(elem, fromUser = false) {
    if (!elem) return;
    if (timeoutId) clearTimeout(timeoutId);
    elem.style.animation = 'notif-out 240ms forwards';
    elem.addEventListener('animationend', () => {
      try { elem.remove(); } catch (e) {}
      elem._resolve && elem._resolve({ dismissedByUser: fromUser });
    }, { once: true });
  }

  return { element: el, promise };
}

function createNotificationsContainer() {
  const c = document.createElement('div');
  c.id = 'notifications';
  c.setAttribute('aria-live', 'polite');
  c.setAttribute('aria-atomic', 'true');
  c.style.position = 'fixed';
  c.style.top = '1rem';
  c.style.right = '1rem';
  c.style.display = 'flex';
  c.style.flexDirection = 'column';
  c.style.gap = '0.6rem';
  c.style.zIndex = '9999';
  document.body.appendChild(c);
  return c;
}

// showConfirm: displays a non-blocking confirmation UI and returns a promise
// resolves true if user confirms, false if cancels
export function showConfirm(message, options = {}) {
  const { confirmText = 'Yes', cancelText = 'No' } = options;
  const container = document.getElementById('notifications') || createNotificationsContainer();

  const el = document.createElement('div');
  el.className = 'notification notification--primary notification--confirm';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-live', 'polite');

  const body = document.createElement('div');
  body.className = 'notif-body';
  body.textContent = message;

  const actions = document.createElement('div');
  actions.className = 'confirm-actions';

  const btnYes = document.createElement('button');
  btnYes.className = 'notif-yes';
  btnYes.textContent = confirmText;

  const btnNo = document.createElement('button');
  btnNo.className = 'notif-no';
  btnNo.textContent = cancelText;

  actions.appendChild(btnYes);
  actions.appendChild(btnNo);

  el.appendChild(body);
  el.appendChild(actions);
  container.appendChild(el);

  return new Promise((resolve) => {
    function cleanUp() {
      el.style.animation = 'notif-out 200ms forwards';
      el.addEventListener('animationend', () => { try { el.remove(); } catch (e) {} }, { once: true });
      btnYes.removeEventListener('click', onYes);
      btnNo.removeEventListener('click', onNo);
    }
    function onYes() { cleanUp(); resolve(true); }
    function onNo() { cleanUp(); resolve(false); }
    btnYes.addEventListener('click', onYes);
    btnNo.addEventListener('click', onNo);
    // keyboard support
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { onNo(); }
    });
    // focus the yes button for quick keyboard action
    btnYes.focus();
  });
}
