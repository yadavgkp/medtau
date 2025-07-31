/**
 * Utility Functions for Taube Med QMS
 * Common helper functions and utilities used across the application
 */

/**
 * Theme Management System
 */
const ThemeManager = {
  currentTheme: 'default',
  
  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('taube-theme', theme);
    
    // Update active theme option
    document.querySelectorAll('.theme-option').forEach(option => {
      option.classList.remove('active');
      if (option.getAttribute('data-theme') === theme) {
        option.classList.add('active');
      }
    });
    
    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
    
    showNotification(`Theme changed to ${this.getThemeDisplayName(theme)}`, 'success');
  },
  
  getThemeDisplayName(theme) {
    const names = {
      'default': 'Default',
      'warm': 'Warm Earth',
      'cool': 'Cool Blue',
      'professional': 'Professional'
    };
    return names[theme] || theme;
  },
  
  toggleThemeDropdown() {
    const dropdown = document.getElementById('themeDropdown');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }
};

/**
 * Date and Time Utilities
 */
const DateUtils = {
  formatDate(dateString, format = 'short') {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    
    switch (format) {
      case 'short':
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      case 'long':
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      case 'time':
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
      case 'relative':
        return this.getRelativeTime(date);
      default:
        return date.toLocaleDateString();
    }
  },
  
  getRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    if (diffDay < 30) return `${Math.floor(diffDay / 7)} week${Math.floor(diffDay / 7) > 1 ? 's' : ''} ago`;
    if (diffDay < 365) return `${Math.floor(diffDay / 30)} month${Math.floor(diffDay / 30) > 1 ? 's' : ''} ago`;
    
    return `${Math.floor(diffDay / 365)} year${Math.floor(diffDay / 365) > 1 ? 's' : ''} ago`;
  },
  
  isOverdue(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    return date < now;
  },
  
  getDaysUntil(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
};

/**
 * String Utilities
 */
const StringUtils = {
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  
  camelToTitle(str) {
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, str.charAt(0).toUpperCase());
  },
  
  slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  },
  
  truncate(str, length = 50, suffix = '...') {
    if (str.length <= length) return str;
    return str.substring(0, length) + suffix;
  },
  
  generateId(prefix = '') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
  },
  
  extractInitials(name, maxInitials = 2) {
    return name.split(' ')
      .filter(word => word.length > 0)
      .slice(0, maxInitials)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }
};

/**
 * Number and Data Utilities
 */
const DataUtils = {
  formatNumber(num, options = {}) {
    if (num === null || num === undefined) return '-';
    
    const defaults = {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    };
    
    return new Intl.NumberFormat('en-US', { ...defaults, ...options }).format(num);
  },
  
  formatCurrency(amount, currency = 'USD') {
    if (amount === null || amount === undefined) return '-';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },
  
  formatPercentage(value, decimals = 1) {
    if (value === null || value === undefined) return '-';
    
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value / 100);
  },
  
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  calculatePercentage(part, total) {
    if (total === 0) return 0;
    return Math.round((part / total) * 100);
  },
  
  generateChartData(data, labelKey, valueKey) {
    return data.map(item => ({
      label: item[labelKey],
      value: item[valueKey]
    }));
  }
};

/**
 * DOM Utilities
 */
const DOMUtils = {
  createElement(tag, className = '', content = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.innerHTML = content;
    return element;
  },
  
  findParent(element, selector) {
    while (element && element !== document.body) {
      if (element.matches && element.matches(selector)) {
        return element;
      }
      element = element.parentElement;
    }
    return null;
  },
  
  isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
  
  scrollToElement(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  },
  
  copyToClipboard(text) {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return Promise.resolve();
      } catch (err) {
        document.body.removeChild(textArea);
        return Promise.reject(err);
      }
    }
  }
};

/**
 * Local Storage Utilities
 */
const StorageUtils = {
  set(key, value, expiry = null) {
    try {
      const item = {
        value: value,
        timestamp: Date.now(),
        expiry: expiry
      };
      localStorage.setItem(`taube-${key}`, JSON.stringify(item));
      return true;
    } catch (error) {
      console.warn(`Could not save to localStorage: ${key}`, error);
      return false;
    }
  },
  
  get(key, defaultValue = null) {
    try {
      const itemStr = localStorage.getItem(`taube-${key}`);
      if (!itemStr) return defaultValue;
      
      const item = JSON.parse(itemStr);
      
      // Check expiry
      if (item.expiry && Date.now() > item.expiry) {
        this.remove(key);
        return defaultValue;
      }
      
      return item.value;
    } catch (error) {
      console.warn(`Could not read from localStorage: ${key}`, error);
      return defaultValue;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(`taube-${key}`);
      return true;
    } catch (error) {
      console.warn(`Could not remove from localStorage: ${key}`, error);
      return false;
    }
  },
  
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('taube-')) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.warn('Could not clear localStorage', error);
      return false;
    }
  }
};

/**
 * API Utilities (for future server integration)
 */
const APIUtils = {
  async request(url, options = {}) {
    const defaults = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const config = { ...defaults, ...options };
    
    // Add auth token if available
    const token = StorageUtils.get('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },
  
  async get(url) {
    return this.request(url);
  },
  
  async post(url, data) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  async put(url, data) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  async delete(url) {
    return this.request(url, {
      method: 'DELETE'
    });
  }
};

/**
 * Export/Import Utilities
 */
const ExportUtils = {
  exportToCSV(data, filename = 'export.csv') {
    if (!data || data.length === 0) {
      showNotification('No data to export', 'warning');
      return;
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(','))
    ].join('\n');
    
    this.downloadFile(csvContent, filename, 'text/csv');
  },
  
  exportToJSON(data, filename = 'export.json') {
    const jsonContent = JSON.stringify(data, null, 2);
    this.downloadFile(jsonContent, filename, 'application/json');
  },
  
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    showNotification(`File exported: ${filename}`, 'success');
  }
};

/**
 * Validation Utilities
 */
const ValidationUtils = {
  isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  isURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  
  isPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  },
  
  isRequired(value) {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },
  
  minLength(value, min) {
    return value && value.toString().length >= min;
  },
  
  maxLength(value, max) {
    return !value || value.toString().length <= max;
  },
  
  isNumeric(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
  },
  
  inRange(value, min, max) {
    const num = parseFloat(value);
    return num >= min && num <= max;
  }
};

/**
 * Animation Utilities
 */
const AnimationUtils = {
  animateCounter(element, target, duration = 2000) {
    const start = performance.now();
    const initialValue = parseInt(element.textContent) || 0;
    
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * (target - initialValue) + initialValue);
      
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };
    
    requestAnimationFrame(updateCounter);
  },
  
  animateProgressBar(element, targetWidth, duration = 1000) {
    element.style.width = '0%';
    
    setTimeout(() => {
      element.style.transition = `width ${duration}ms ease-out`;
      element.style.width = targetWidth;
    }, 100);
  },
  
  fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    
    setTimeout(() => {
      element.style.opacity = '1';
    }, 10);
  },
  
  slideDown(element, duration = 300) {
    element.style.height = '0px';
    element.style.overflow = 'hidden';
    element.style.transition = `height ${duration}ms ease-in-out`;
    
    const targetHeight = element.scrollHeight + 'px';
    
    setTimeout(() => {
      element.style.height = targetHeight;
      
      setTimeout(() => {
        element.style.height = '';
        element.style.overflow = '';
        element.style.transition = '';
      }, duration);
    }, 10);
  }
};

/**
 * Global utility functions
 */
function setTheme(theme) {
  ThemeManager.setTheme(theme);
}

function toggleThemeDropdown() {
  ThemeManager.toggleThemeDropdown();
}

function toggleUserDropdown() {
  const dropdown = document.getElementById('userDropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
}

function showNotifications() {
  showNotification('You have 3 new notifications', 'info');
  // Future implementation: show actual notifications panel
}

// Export all utilities
window.utils = {
  ThemeManager,
  DateUtils,
  StringUtils,
  DataUtils,
  DOMUtils,
  StorageUtils,
  APIUtils,
  ExportUtils,
  ValidationUtils,
  AnimationUtils
};

// Export individual utility functions for direct access
window.setTheme = setTheme;
window.toggleThemeDropdown = toggleThemeDropdown;
window.toggleUserDropdown = toggleUserDropdown;
window.showNotifications = showNotifications;

console.log('Utilities module loaded');