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
    permissions: [
        'manage_department', 
        'assign_tasks',
        'view_dashboard',
        'view_products',
        'view_improvements',
        'view_training',
        'view_documents',
        'view_reports'
    ],
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
    permissions: [
        'complete_tasks',
        'view_dashboard',
        'view_my-tasks',
        'view_training',
        'view_documents'
    ],
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
    permissions: [
        'complete_training',
        'view_dashboard',
        'view_training',
        'view_basic-documents'
    ],
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
  const userRoleEl = document.getElementById('userRole');
  
  if (userAvatar) userAvatar.textContent = currentUser.initials;
  if (userName) userName.textContent = currentUser.name;
  if (userRoleEl) userRoleEl.textContent = USER_ROLES[currentUser.role].name;
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
      <div class="nav-item ${item === 'dashboard' ? 'active' : ''}" data-page="${item}" onclick="TaubeMedQMS.navigateToPage('${item}')">
        <i class="fas ${navItem.icon}"></i>
        <span class="nav-label">${navItem.label}</span>
        ${navItem.badge ? `<span class="nav-badge">${navItem.badge}</span>` : ''}
      </div>
    `;
  }).join('');
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

  // Dispatch navigation event for other modules to listen to
  window.dispatchEvent(new CustomEvent('navigation-changed', { detail: { page } }));
  
  console.log(`Mapsd to: ${page}`);
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
      <i class="fas fa-spinner fa-spin"></i>
      Loading ${page.charAt(0).toUpperCase() + page.slice(1)}...
    </div>
  `;
  
  try {
    // Dynamically create function name from page id (e.g., 'user-management' -> 'UserManagement')
    const initFunctionName = `initialize${page.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}`;
    
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
}

/**
 * Perform global search across all modules
 */
function performGlobalSearch(query) {
  if (!query.trim()) return;
  
  console.log(`Performing global search: ${query}`);
  showNotification(`Searching for: "${query}"`, 'info');
}

/**
 * Close all open dropdowns
 */
function closeAllDropdowns() {
  document.querySelectorAll('.theme-dropdown.show, .user-dropdown.show').forEach(dropdown => {
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
    
    // Apply saved theme
    window.utils.ThemeManager.setTheme(savedTheme);
    
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
 * Utility function to animate progress bars
 */
function animateProgressBars() {
  const bars = document.querySelectorAll('.progress-fill[data-width]');
  
  bars.forEach((bar, index) => {
    setTimeout(() => {
      const width = bar.getAttribute('data-width');
      bar.style.width = width;
    }, index * 50); // Reduced delay for faster feedback
  });
}

/**
 * Utility function to animate progress circles
 */
function animateProgressCircles() {
    const circles = document.querySelectorAll('.progress-fill[data-progress]');
    circles.forEach(circle => {
        const progress = circle.dataset.progress;
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (progress / 100) * circumference;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
        // Trigger reflow to apply initial styles before transition
        circle.getBoundingClientRect(); 
        
        // Apply transition and final state
        circle.style.transition = 'stroke-dashoffset 1.5s ease-out';
        circle.style.strokeDashoffset = offset;
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
  animateProgressBars,
  animateProgressCircles,
  
  // State access
  getCurrentUser: () => currentUser,
  getCurrentPage: () => currentPage,
  getUserRole: () => userRole,
  
  // Preferences
  saveUserPreferences,
  loadUserPreferences,

  // Direct access for simple toggles
  toggleUserDropdown: () => {
    document.getElementById('userDropdown')?.classList.toggle('show');
  },
};

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}