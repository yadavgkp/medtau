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
      default:
        return date.toLocaleDateString();
    }
  }
};

/**
 * String Utilities
 */
const StringUtils = {
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  
  extractInitials(name = '', maxInitials = 2) {
    return name.split(' ')
      .filter(word => word.length > 0)
      .slice(0, maxInitials)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }
};


// Export all utilities under a single global object
window.utils = {
  ThemeManager,
  DateUtils,
  StringUtils
};