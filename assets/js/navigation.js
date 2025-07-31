/**
 * Navigation Module for Taube Med QMS
 * Handles page routing, breadcrumbs, and navigation state
 */

// Navigation state
let navigationHistory = [];
let currentBreadcrumbs = [];

/**
 * Enhanced navigation with history tracking
 */
function navigateToPageWithHistory(page, addToHistory = true) {
  // Check permissions first using the global function
  if (!window.TaubeMedQMS.hasPermission('view_' + page) && !window.TaubeMedQMS.hasPermission('all')) {
    showNotification('Access denied. Insufficient permissions.', 'error');
    return;
  }
  
  const currentPage = window.TaubeMedQMS.getCurrentPage();
  
  // Add to history if requested
  if (addToHistory && currentPage !== page) {
    navigationHistory.push({
      page: currentPage,
      timestamp: new Date(),
      user: window.TaubeMedQMS.getCurrentUser()?.name
    });
    
    // Limit history size
    if (navigationHistory.length > 50) {
      navigationHistory = navigationHistory.slice(-25);
    }
  }
  
  // Use the global navigateToPage function
  window.TaubeMedQMS.navigateToPage(page);
}

/**
 * Go back to previous page
 */
function goBack() {
  if (navigationHistory.length > 0) {
    const previousPage = navigationHistory.pop();
    navigateToPageWithHistory(previousPage.page, false);
    showNotification(`Returned to ${previousPage.page}`, 'info');
  } else {
    showNotification('No previous page in history', 'warning');
  }
}

/**
 * Update breadcrumbs for current page
 */
function updateBreadcrumbs(page) {
  const breadcrumbsContainer = document.getElementById('breadcrumbs');
  if (!breadcrumbsContainer) return;
  
  const breadcrumbs = getBreadcrumbsForPage(page);
  currentBreadcrumbs = breadcrumbs;
  
  breadcrumbsContainer.innerHTML = breadcrumbs.map((crumb, index) => {
    const isLast = index === breadcrumbs.length - 1;
    return `
      <span class="breadcrumb-item ${isLast ? 'active' : ''}" 
            ${!isLast ? `onclick="navigateToPageWithHistory('${crumb.page}')"` : ''}>
        <i class="fas ${crumb.icon}"></i>
        ${crumb.label}
      </span>
      ${!isLast ? '<i class="fas fa-chevron-right breadcrumb-separator"></i>' : ''}
    `;
  }).join('');
}

/**
 * Get breadcrumbs for specific page
 */
function getBreadcrumbsForPage(page) {
    const pageLabel = NAV_ITEMS[page]?.label || page.charAt(0).toUpperCase() + page.slice(1);
    const pageIcon = NAV_ITEMS[page]?.icon || 'fa-cog';

    if (page === 'dashboard') {
        return [{ page: 'dashboard', label: 'Dashboard', icon: 'fa-home' }];
    }
    
    return [
        { page: 'dashboard', label: 'Home', icon: 'fa-home' },
        { page: page, label: pageLabel, icon: pageIcon }
    ];
}


/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    // Only handle shortcuts if not in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }
    
    // Alt + B for back
    if (e.altKey && e.key === 'b') {
        e.preventDefault();
        goBack();
    }
    
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('globalSearch')?.focus();
    }
  });
}

/**
 * Setup navigation tooltips with shortcuts
 */
function setupNavigationTooltips() {
  document.querySelectorAll('.nav-item').forEach(item => {
    const page = item.getAttribute('data-page');
    const navItem = NAV_ITEMS[page];
    if (navItem) {
      item.title = navItem.label;
    }
  });
}


/**
 * Initialize navigation system
 */
function initializeNavigationSystem() {
  console.log('Initializing navigation system...');
  
  setupKeyboardShortcuts();
  
  // Listen for page changes to update breadcrumbs
  window.addEventListener('navigation-changed', (e) => {
      updateBreadcrumbs(e.detail.page);
  });
  
  // Set initial breadcrumbs
  updateBreadcrumbs('dashboard');
  
  console.log('Navigation system initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeNavigationSystem);
} else {
  initializeNavigationSystem();
}