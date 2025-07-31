/**
 * Main Application Controller for Taube Med QMS
 * Handles global state, routing, and initialization
 */

// Global Application State
let currentUser = null;
let currentPage = 'dashboard';
let userRole = 'qmr'; // Default role for demo
let appInitialized = false;

// User Roles and Permissions Configuration
const USER_ROLES = {
  qmr: {
    name: 'Quality Management Representative',
    permissions: ['all'],
    navigation: [
      'dashboard', 
      'products', 
      'improvements', 
      'training', 
      'documents', 
      'organization', 
      'reports', 
      'user-management'
    ],
    color: 'var(--danger)'
  },
  manager: {
    name: 'Department Manager',
    permissions: ['view_all', 'manage_department', 'assign_tasks'],
    navigation: [
      'dashboard', 
      'products', 
      'improvements', 
      'training', 
      'documents', 
      'reports'
    ],
    color: 'var(--warning)'
  },
  employee: {
    name: 'Employee',
    permissions: ['view_assigned', 'complete_tasks', 'view_training'],
    navigation: [
      'dashboard', 
      'my-tasks', 
      'training', 
      'documents'
    ],
    color: 'var(--info)'
  },
  trainee: {
    name: 'Trainee',
    permissions: ['view_basic', 'complete_training'],
    navigation: [
      'dashboard', 
      'training', 
      'basic-documents'
    ],
    color: 'var(--success)'
  }
};

// Navigation Configuration
const NAV_ITEMS = {
  'dashboard': { icon: 'fa-tachometer-alt', label: 'Dashboard' },
  'products': { icon: 'fa-cube', label: 'Products', badge: '3' },
  'improvements': { icon: 'fa-lightbulb', label: 'Improvements', badge: '12' },
  'training': { icon: 'fa-graduation-cap', label: 'Training' },
  'documents': { icon: 'fa-folder-open', label: 'Documents' },
  'organization': { icon: 'fa-sitemap', label: 'Organization' },
  'reports': { icon: 'fa-chart-line', label: 'Reports' },
  'user-management': { icon: 'fa-users-cog', label: 'User Management' },
  'my-tasks': { icon: 'fa-tasks', label: 'My Tasks', badge: '5' },
  'basic-documents': { icon: 'fa-file-alt', label: 'Basic Documents' }
};

/**
 * Initialize the application
 */
function initializeApp() {
  if (appInitialized) return;
  
  console.log('Initializing Taube Med QMS...');
  
  // Load user preferences
  loadUserPreferences();
  
  // Initialize theme system
  initializeThemeSystem();
  
  // Setup global event listeners
  setupGlobalEventListeners();
  
  // Setup search functionality
  setupGlobalSearch();
  
  // Mark as initialized
  appInitialized = true;
  
  console.log('Application initialized successfully');
}

/**
 * Set current user and update UI
 */
function setCurrentUser(role, name, initials, email = null) {
  currentUser = {
    role: role,
    name: name,
    initials: initials,
    email: email || `${name.toLowerCase().replace(' ', '.')}@taubemed.com`,
    permissions: USER_ROLES[role].permissions,
    navigation: USER_ROLES[role].navigation,
    loginTime: new Date()
  };
  
  userRole = role;
  
  // Update UI elements
  updateUserInterface();
  
  // Initialize navigation based on role
  initializeNavigation();
  
  console.log(`User set: ${name} (${USER_ROLES[role].name})`);
}

/**
 * Update user interface elements
 */
function updateUserInterface() {
  if (!currentUser) return;
  
  const userAvatar = document.getElementById('userAvatar');
  const userName = document.getElementById('userName');
  const userRole = document.getElementById('userRole');
  
  if (userAvatar) userAvatar.textContent = currentUser.initials;
  if (userName) userName.textContent = currentUser.name;
  if (userRole) userRole.textContent = USER_ROLES[currentUser.role].name;
}

/**
 * Initialize navigation based on user role
 */
function initializeNavigation() {
  const nav = document.getElementById('mainNavigation');
  if (!nav || !currentUser) return;
  
  const userNav = currentUser.navigation;
  
  nav.innerHTML = userNav.map(item => {
    const navItem = NAV_ITEMS[item];
    return `
      <div class="nav-item ${item === 'dashboard' ? 'active' : ''}" data-page="${item}">
        <i class="fas ${navItem.icon}"></i>
        ${navItem.label}
        ${navItem.badge ? `<span class="nav-badge">${navItem.badge}</span>` : ''}
      </div>
    `;
  }).join('');
  
  // Add click handlers
  nav.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
      const page = this.getAttribute('data-page');
      navigateToPage(page);
    });
  });
}

/**
 * Navigate to a specific page
 */
function navigateToPage(page) {
  // Check permissions
  if (!hasPermission('view_' + page) && !hasPermission('all')) {
    showNotification('Access denied. Insufficient permissions.', 'error');
    return;
  }
  
  // Update navigation state
  updateNavigationState(page);
  
  // Load page content
  loadPageContent(page);
  
  // Update current page
  currentPage = page;
  
  // Close any open dropdowns
  closeAllDropdowns();
  
  console.log(`Navigated to: ${page}`);
}

/**
 * Update navigation visual state
 */
function updateNavigationState(page) {
  // Remove active from all nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Add active to current page
  const activeNav = document.querySelector(`[data-page="${page}"]`);
  if (activeNav) {
    activeNav.classList.add('active');
  }
}

/**
 * Load page content dynamically
 */
async function loadPageContent(page) {
  const content = document.getElementById('mainContent');
  if (!content) return;
  
  // Show loading state
  content.innerHTML = `
    <div class="loading">
      <i class="fas fa-spinner"></i>
      Loading ${page.charAt(0).toUpperCase() + page.slice(1)}...
    </div>
  `;
  
  try {
    // Call page-specific initialization function
    const initFunctionName = `initialize${page.charAt(0).toUpperCase() + page.slice(1).replace('-', '')}`;
    
    if (typeof window[initFunctionName] === 'function') {
      await window[initFunctionName]();
    } else {
      // Fallback for pages without specific initialization
      content.innerHTML = `
        <div class="page active">
          <div class="page-header">
            <h1 class="page-title">
              <i class="fas ${NAV_ITEMS[page]?.icon || 'fa-cog'}"></i>
              ${NAV_ITEMS[page]?.label || page.charAt(0).toUpperCase() + page.slice(1)}
            </h1>
          </div>
          <div class="card">
            <p>This ${page} module is under development.</p>
            <p><strong>Current User Role:</strong> ${USER_ROLES[userRole].name}</p>
            <p><strong>Permissions:</strong> ${currentUser.permissions.join(', ')}</p>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error(`Error loading page ${page}:`, error);
    content.innerHTML = `
      <div class="page active">
        <div class="card">
          <div class="notification error">
            <i class="fas fa-exclamation-triangle"></i>
            <div>
              <strong>Error Loading Page</strong>
              <p>There was an error loading the ${page} module. Please try again.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

/**
 * Check if current user has specific permission
 */
function hasPermission(permission) {
  if (!currentUser) return false;
  return currentUser.permissions.includes('all') || currentUser.permissions.includes(permission);
}

/**
 * Setup global event listeners
 */
function setupGlobalEventListeners() {
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.theme-switcher') && !e.target.closest('.user-menu')) {
      closeAllDropdowns();
    }
  });
  
  // Handle escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAllDropdowns();
      closeAllModals();
    }
  });
  
  // Handle modal clicks
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
      closeAllModals();
    }
  });
}

/**
 * Setup global search functionality
 */
function setupGlobalSearch() {
  const searchInput = document.getElementById('globalSearch');
  if (!searchInput) return;
  
  searchInput.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
      performGlobalSearch(this.value);
    }
  });
  
  // Add search suggestions (future enhancement)
  searchInput.addEventListener('input', function() {
    const query = this.value;
    if (query.length > 2) {
      // Implement search suggestions
    }
  });
}

/**
 * Perform global search across all modules
 */
function performGlobalSearch(query) {
  if (!query.trim()) return;
  
  console.log(`Performing global search: ${query}`);
  showNotification(`Searching for: "${query}"`, 'info');
  
  // Future implementation: search across all modules
  // This would call search functions from each loaded module
}

/**
 * Close all open dropdowns
 */
function closeAllDropdowns() {
  document.querySelectorAll('.theme-dropdown, .user-dropdown, .export-menu').forEach(dropdown => {
    dropdown.classList.remove('show');
  });
}

/**
 * Close all open modals
 */
function closeAllModals() {
  document.querySelectorAll('.modal.show').forEach(modal => {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
  });
}

/**
 * Load user preferences from localStorage
 */
function loadUserPreferences() {
  try {
    const savedTheme = localStorage.getItem('taube-theme') || 'default';
    const savedUser = localStorage.getItem('taube-user');
    
    // Apply saved theme
    setTheme(savedTheme);
    
    // Restore user session if available
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // Only restore if login was recent (within 24 hours)
      const loginTime = new Date(userData.loginTime);
      const now = new Date();
      const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        setCurrentUser(userData.role, userData.name, userData.initials, userData.email);
      }
    }
  } catch (error) {
    console.warn('Error loading user preferences:', error);
  }
}

/**
 * Save user preferences to localStorage
 */
function saveUserPreferences() {
  try {
    if (currentUser) {
      localStorage.setItem('taube-user', JSON.stringify(currentUser));
    }
  } catch (error) {
    console.warn('Error saving user preferences:', error);
  }
}

/**
 * Initialize theme system
 */
function initializeThemeSystem() {
  // Theme system is handled in utils.js
  console.log('Theme system initialized');
}

/**
 * Utility function to format dates consistently
 */
function formatDate(dateString, format = 'short') {
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

/**
 * Utility function to animate counters
 */
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000;
    const start = performance.now();
    
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * target);
      
      counter.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    requestAnimationFrame(updateCounter);
  });
}

/**
 * Utility function to animate progress bars
 */
function animateProgressBars() {
  const bars = document.querySelectorAll('[data-width]');
  
  bars.forEach((bar, index) => {
    setTimeout(() => {
      const width = bar.getAttribute('data-width');
      bar.style.width = width;
    }, index * 200);
  });
}

/**
 * Utility function to animate progress circles
 */
function animateProgressCircles() {
  const circles = document.querySelectorAll('.progress-fill[data-progress]');
  
  circles.forEach((circle, index) => {
    setTimeout(() => {
      const progress = parseInt(circle.getAttribute('data-progress'));
      const circumference = 2 * Math.PI * 45; // radius = 45
      const offset = circumference - (progress / 100) * circumference;
      
      circle.style.strokeDasharray = circumference;
      circle.style.strokeDashoffset = offset;
    }, index * 300);
  });
}

/**
 * Export global functions for use by other modules
 */
window.TaubeMedQMS = {
  // Core functions
  initializeApp,
  setCurrentUser,
  navigateToPage,
  hasPermission,
  closeAllDropdowns,
  closeAllModals,
  
  // Utility functions
  formatDate,
  animateCounters,
  animateProgressBars,
  animateProgressCircles,
  
  // State access
  getCurrentUser: () => currentUser,
  getCurrentPage: () => currentPage,
  getUserRole: () => userRole,
  getUserRoles: () => USER_ROLES,
  
  // Preferences
  saveUserPreferences,
  loadUserPreferences
};

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}