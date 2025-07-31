/**
 * Notification System for Taube Med QMS
 * Handles toast notifications, alerts, and system messages
 */

// Notification state
let notificationQueue = [];
let activeNotifications = [];
let notificationId = 0;

// Notification configuration
const NOTIFICATION_CONFIG = {
  maxNotifications: 5,
  defaultDuration: 4000,
  durations: {
    success: 3000,
    info: 4000,
    warning: 5000,
    error: 6000
  },
  positions: {
    'top-right': { top: '20px', right: '20px' },
    'top-left': { top: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'top-center': { top: '20px', left: '50%', transform: 'translateX(-50%)' }
  },
  currentPosition: 'top-right'
};

/**
 * Main notification function
 */
function showNotification(message, type = 'info', options = {}) {
  const notification = createNotification(message, type, options);
  
  // Add to queue if too many notifications
  if (activeNotifications.length >= NOTIFICATION_CONFIG.maxNotifications) {
    notificationQueue.push(notification);
    return notification.id;
  }
  
  displayNotification(notification);
  return notification.id;
}

/**
 * Create notification object
 */
function createNotification(message, type, options) {
  const id = ++notificationId;
  const duration = options.duration || NOTIFICATION_CONFIG.durations[type] || NOTIFICATION_CONFIG.defaultDuration;
  
  return {
    id: id,
    message: message,
    type: type,
    title: options.title || getDefaultTitle(type),
    duration: duration,
    persistent: options.persistent || false,
    onClick: options.onClick || null,
    onClose: options.onClose || null,
    timestamp: new Date(),
    actions: options.actions || []
  };
}

/**
 * Display notification on screen
 */
function displayNotification(notification) {
  // Create notification element
  const element = createNotificationElement(notification);
  
  // Add to active notifications
  activeNotifications.push({ ...notification, element });
  
  // Add to DOM
  document.body.appendChild(element);
  
  // Position notification
  positionNotification(element);
  
  // Auto-remove if not persistent
  if (!notification.persistent) {
    setTimeout(() => {
      removeNotification(notification.id);
    }, notification.duration);
  }
  
  // Log notification
  logNotification(notification);
}

/**
 * Create notification DOM element
 */
function createNotificationElement(notification) {
  const element = document.createElement('div');
  element.className = `notification ${notification.type}`;
  element.setAttribute('data-notification-id', notification.id);
  
  const iconMap = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    info: 'fa-info-circle',
    warning: 'fa-exclamation-triangle'
  };
  
  element.innerHTML = `
    <div class="notification-icon">
      <i class="fas ${iconMap[notification.type]}"></i>
    </div>
    <div class="notification-content">
      <div class="notification-title">${notification.title}</div>
      <div class="notification-message">${notification.message}</div>
      ${notification.actions.length > 0 ? createNotificationActions(notification.actions) : ''}
    </div>
    <button class="notification-close" onclick="removeNotification(${notification.id})">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Add click handler if provided
  if (notification.onClick) {
    element.style.cursor = 'pointer';
    element.addEventListener('click', (e) => {
      if (!e.target.closest('.notification-close') && !e.target.closest('.notification-actions')) {
        notification.onClick(notification);
      }
    });
  }
  
  // Add hover effects
  element.addEventListener('mouseenter', () => pauseNotificationTimer(notification.id));
  element.addEventListener('mouseleave', () => resumeNotificationTimer(notification.id));
  
  return element;
}

/**
 * Create notification action buttons
 */
function createNotificationActions(actions) {
  return `
    <div class="notification-actions">
      ${actions.map(action => `
        <button class="notification-action ${action.type || 'secondary'}" 
                onclick="handleNotificationAction('${action.id}', ${action.handler})">
          ${action.icon ? `<i class="fas ${action.icon}"></i>` : ''}
          ${action.label}
        </button>
      `).join('')}
    </div>
  `;
}

/**
 * Position notification based on current configuration
 */
function positionNotification(element) {
  const position = NOTIFICATION_CONFIG.positions[NOTIFICATION_CONFIG.currentPosition];
  
  Object.entries(position).forEach(([property, value]) => {
    element.style[property] = value;
  });
  
  element.style.position = 'fixed';
  element.style.zIndex = '2000';
  
  // Calculate offset for multiple notifications
  const index = activeNotifications.length - 1;
  const offset = index * 80; // 80px spacing between notifications
  
  if (NOTIFICATION_CONFIG.currentPosition.includes('top')) {
    element.style.top = `${parseInt(position.top) + offset}px`;
  } else if (NOTIFICATION_CONFIG.currentPosition.includes('bottom')) {
    element.style.bottom = `${parseInt(position.bottom) + offset}px`;
  }
}

/**
 * Remove notification
 */
function removeNotification(id, animate = true) {
  const notificationIndex = activeNotifications.findIndex(n => n.id === id);
  if (notificationIndex === -1) return;
  
  const notification = activeNotifications[notificationIndex];
  
  // Call onClose callback if provided
  if (notification.onClose) {
    notification.onClose(notification);
  }
  
  if (animate) {
    // Animate out
    notification.element.style.opacity = '0';
    notification.element.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
      removeNotificationElement(notification);
    }, 300);
  } else {
    removeNotificationElement(notification);
  }
}

/**
 * Remove notification element from DOM and state
 */
function removeNotificationElement(notification) {
  // Remove from DOM
  if (notification.element && notification.element.parentNode) {
    notification.element.parentNode.removeChild(notification.element);
  }
  
  // Remove from active notifications
  const index = activeNotifications.findIndex(n => n.id === notification.id);
  if (index !== -1) {
    activeNotifications.splice(index, 1);
  }
  
  // Reposition remaining notifications
  repositionNotifications();
  
  // Show next notification from queue if any
  if (notificationQueue.length > 0) {
    const nextNotification = notificationQueue.shift();
    displayNotification(nextNotification);
  }
}

/**
 * Reposition all active notifications
 */
function repositionNotifications() {
  activeNotifications.forEach((notification, index) => {
    const position = NOTIFICATION_CONFIG.positions[NOTIFICATION_CONFIG.currentPosition];
    const offset = index * 80;
    
    if (NOTIFICATION_CONFIG.currentPosition.includes('top')) {
      notification.element.style.top = `${parseInt(position.top) + offset}px`;
    } else if (NOTIFICATION_CONFIG.currentPosition.includes('bottom')) {
      notification.element.style.bottom = `${parseInt(position.bottom) + offset}px`;
    }
  });
}

/**
 * Get default title for notification type
 */
function getDefaultTitle(type) {
  const titles = {
    success: 'Success',
    error: 'Error',
    info: 'Information',
    warning: 'Warning'
  };
  return titles[type] || 'Notification';
}

/**
 * Pause notification timer (on hover)
 */
function pauseNotificationTimer(id) {
  // Implementation for pausing auto-removal timer
  // This would be implemented with actual timer management
}

/**
 * Resume notification timer
 */
function resumeNotificationTimer(id) {
  // Implementation for resuming auto-removal timer
}

/**
 * Handle notification action button clicks
 */
function handleNotificationAction(actionId, handler) {
  if (typeof handler === 'function') {
    handler(actionId);
  }
}

/**
 * Clear all notifications
 */
function clearAllNotifications() {
  activeNotifications.forEach(notification => {
    removeNotification(notification.id, false);
  });
  notificationQueue = [];
  
  showNotification('All notifications cleared', 'info');
}

/**
 * Show specific notification types with shortcuts
 */
function showSuccessNotification(message, options = {}) {
  return showNotification(message, 'success', options);
}

function showErrorNotification(message, options = {}) {
  return showNotification(message, 'error', options);
}

function showWarningNotification(message, options = {}) {
  return showNotification(message, 'warning', options);
}

function showInfoNotification(message, options = {}) {
  return showNotification(message, 'info', options);
}

/**
 * Show progress notification
 */
function showProgressNotification(message, progress = 0) {
  const notification = {
    message: message,
    type: 'info',
    title: 'Processing...',
    persistent: true,
    progress: progress
  };
  
  const id = showNotification(message, 'info', notification);
  
  // Add progress bar to notification
  setTimeout(() => {
    const element = document.querySelector(`[data-notification-id="${id}"]`);
    if (element) {
      const progressBar = document.createElement('div');
      progressBar.className = 'notification-progress';
      progressBar.innerHTML = `
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <div class="progress-text">${progress}%</div>
      `;
      element.querySelector('.notification-content').appendChild(progressBar);
    }
  }, 100);
  
  return id;
}

/**
 * Update progress notification
 */
function updateProgressNotification(id, progress, message = null) {
  const notification = activeNotifications.find(n => n.id === id);
  if (!notification) return;
  
  const element = notification.element;
  const progressFill = element.querySelector('.progress-fill');
  const progressText = element.querySelector('.progress-text');
  const messageElement = element.querySelector('.notification-message');
  
  if (progressFill) progressFill.style.width = `${progress}%`;
  if (progressText) progressText.textContent = `${progress}%`;
  if (message && messageElement) messageElement.textContent = message;
  
  // Complete the notification if progress reaches 100%
  if (progress >= 100) {
    setTimeout(() => {
      removeNotification(id);
      showSuccessNotification('Process completed successfully!');
    }, 1000);
  }
}

/**
 * Show confirmation notification with actions
 */
function showConfirmationNotification(message, onConfirm, onCancel = null) {
  const actions = [
    {
      id: 'confirm',
      label: 'Confirm',
      type: 'primary',
      icon: 'fa-check',
      handler: () => {
        if (onConfirm) onConfirm();
        removeNotification(id);
      }
    },
    {
      id: 'cancel',
      label: 'Cancel',
      type: 'secondary',
      icon: 'fa-times',
      handler: () => {
        if (onCancel) onCancel();
        removeNotification(id);
      }
    }
  ];
  
  const id = showNotification(message, 'warning', {
    title: 'Confirmation Required',
    persistent: true,
    actions: actions
  });
  
  return id;
}

/**
 * Show system announcement
 */
function showSystemAnnouncement(title, message, type = 'info') {
  return showNotification(message, type, {
    title: title,
    duration: 8000,
    persistent: false
  });
}

/**
 * Log notification for debugging/analytics
 */
function logNotification(notification) {
  if (window.console && window.console.log) {
    console.log('Notification:', {
      id: notification.id,
      type: notification.type,
      message: notification.message,
      timestamp: notification.timestamp
    });
  }
  
  // Could also send to analytics service
}

/**
 * Set notification position
 */
function setNotificationPosition(position) {
  if (NOTIFICATION_CONFIG.positions[position]) {
    NOTIFICATION_CONFIG.currentPosition = position;
    
    // Reposition existing notifications
    repositionNotifications();
    
    // Save preference
    if (typeof StorageUtils !== 'undefined') {
      StorageUtils.set('notification-position', position);
    }
  }
}

/**
 * Get notification statistics
 */
function getNotificationStats() {
  return {
    active: activeNotifications.length,
    queued: notificationQueue.length,
    total: notificationId,
    position: NOTIFICATION_CONFIG.currentPosition
  };
}

/**
 * Initialize notification system
 */
function initializeNotifications() {
  // Load saved position preference
  if (typeof StorageUtils !== 'undefined') {
    const savedPosition = StorageUtils.get('notification-position');
    if (savedPosition) {
      NOTIFICATION_CONFIG.currentPosition = savedPosition;
    }
  }
  
  // Add CSS styles for notifications if not already present
  if (!document.getElementById('notification-styles')) {
    const styles = document.createElement('style');
    styles.id = 'notification-styles';
    styles.textContent = `
      .notification-progress {
        margin-top: 0.75rem;
        padding-top: 0.75rem;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
      }
      
      .notification-progress .progress-bar {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 0.5rem;
      }
      
      .notification-progress .progress-fill {
        height: 100%;
        background: white;
        transition: width 0.3s ease;
        border-radius: 2px;
      }
      
      .notification-progress .progress-text {
        font-size: 0.8rem;
        text-align: center;
        opacity: 0.9;
      }
      
      .notification-actions {
        margin-top: 0.75rem;
        display: flex;
        gap: 0.5rem;
      }
      
      .notification-action {
        padding: 0.25rem 0.75rem;
        border: none;
        border-radius: 6px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .notification-action.primary {
        background: white;
        color: var(--primary);
      }
      
      .notification-action.secondary {
        background: rgba(255, 255, 255, 0.2);
        color: white;
      }
      
      .notification-action:hover {
        transform: translateY(-1px);
      }
      
      .notification-close {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s;
      }
      
      .notification-close:hover {
        opacity: 1;
      }
    `;
    document.head.appendChild(styles);
  }
  
  console.log('Notification system initialized');
}

// Export notification functions for global access
window.notificationModule = {
  showNotification,
  showSuccessNotification,
  showErrorNotification,
  showWarningNotification,
  showInfoNotification,
  showProgressNotification,
  updateProgressNotification,
  showConfirmationNotification,
  showSystemAnnouncement,
  removeNotification,
  clearAllNotifications,
  setNotificationPosition,
  getNotificationStats
};

// Export main function globally
window.showNotification = showNotification;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeNotifications);
} else {
  initializeNotifications();
}