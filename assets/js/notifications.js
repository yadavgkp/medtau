/**
 * Notification System for Taube Med QMS
 * Handles toast notifications.
 */

// Notification state
let notificationId = 0;

/**
 * Main notification function
 */
function showNotification(message, type = 'info', options = {}) {
  const id = ++notificationId;
  const duration = options.duration || 4000;
  
  // Create notification element
  const element = document.createElement('div');
  element.className = `notification ${type}`;
  element.setAttribute('data-notification-id', id);
  
  const iconMap = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    info: 'fa-info-circle',
    warning: 'fa-exclamation-triangle'
  };
  
  element.innerHTML = `
    <div class="notification-icon">
      <i class="fas ${iconMap[type]}"></i>
    </div>
    <div class="notification-content">
      <div class="notification-title">${options.title || StringUtils.capitalize(type)}</div>
      <div class="notification-message">${message}</div>
    </div>
    <button class="notification-close" onclick="removeNotification(${id})">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Add to DOM
  document.body.appendChild(element);
  
  // Animate in
  setTimeout(() => element.classList.add('show'), 10);

  // Auto-remove if not persistent
  if (!options.persistent) {
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }
  
  return id;
}

/**
 * Remove notification
 */
function removeNotification(id) {
  const element = document.querySelector(`[data-notification-id="${id}"]`);
  if (element) {
    element.classList.remove('show');
    setTimeout(() => element.remove(), 300);
  }
}


/**
 * Initialize notification system by adding CSS styles
 */
function initializeNotifications() {
  if (document.getElementById('notification-styles')) return;

  const styles = document.createElement('style');
  styles.id = 'notification-styles';
  styles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 2000;
        min-width: 300px;
        max-width: 400px;
        background: white;
        border-radius: 12px;
        box-shadow: var(--shadow-lg);
        display: flex;
        padding: 1rem;
        border-left: 5px solid var(--info);
        opacity: 0;
        transform: translateX(100%);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .notification.show {
        opacity: 1;
        transform: translateX(0);
    }
    .notification.success { border-left-color: var(--success); }
    .notification.warning { border-left-color: var(--warning); }
    .notification.error { border-left-color: var(--danger); }
    .notification.info { border-left-color: var(--info); }
    .notification-icon {
        font-size: 1.5rem;
        margin-right: 1rem;
    }
    .notification.success .notification-icon { color: var(--success); }
    .notification.warning .notification-icon { color: var(--warning); }
    .notification.error .notification-icon { color: var(--danger); }
    .notification.info .notification-icon { color: var(--info); }
    .notification-title {
        font-weight: 600;
    }
    .notification-message {
        color: var(--gray);
    }
    .notification-close {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        color: var(--gray);
        cursor: pointer;
        opacity: 0.7;
    }
    .notification-close:hover { opacity: 1; }
  `;
  document.head.appendChild(styles);
  console.log('Notification system initialized');
}

window.notificationModule = {
    showSystemAnnouncement: (title, message) => showNotification(message, 'info', { title })
};

// Initialize when the script loads
initializeNotifications();