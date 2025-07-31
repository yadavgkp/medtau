/**
 * Navigation Module for Taube Med QMS
 * Handles page routing, breadcrumbs, and navigation state
 */

// Navigation state
let navigationHistory = [];
let currentBreadcrumbs = [];

// Page loading cache
const pageCache = new Map();

/**
 * Enhanced navigation with history tracking
 */
function navigateToPageWithHistory(page, addToHistory = true) {
  // Check permissions first
  if (!hasPermission('view_' + page) && !hasPermission('all')) {
    showNotification('Access denied. Insufficient permissions.', 'error');
    return;
  }
  
  // Add to history if requested
  if (addToHistory && currentPage !== page) {
    navigationHistory.push({
      page: currentPage,
      timestamp: new Date(),
      user: currentUser?.name
    });
    
    // Limit history size
    if (navigationHistory.length > 50) {
      navigationHistory = navigationHistory.slice(-25);
    }
  }
  
  // Update navigation
  navigateToPage(page);
  
  // Update breadcrumbs
  updateBreadcrumbs(page);
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
        ${!isLast ? '<i class="fas fa-chevron-right breadcrumb-separator"></i>' : ''}
      </span>
    `;
  }).join('');
}

/**
 * Get breadcrumbs for specific page
 */
function getBreadcrumbsForPage(page) {
  const breadcrumbMap = {
    'dashboard': [
      { page: 'dashboard', label: 'Dashboard', icon: 'fa-home' }
    ],
    'products': [
      { page: 'dashboard', label: 'Dashboard', icon: 'fa-home' },
      { page: 'products', label: 'Products', icon: 'fa-cube' }
    ],
    'improvements': [
      { page: 'dashboard', label: 'Dashboard', icon: 'fa-home' },
      { page: 'improvements', label: 'Improvements', icon: 'fa-lightbulb' }
    ],
    'training': [
      { page: 'dashboard', label: 'Dashboard', icon: 'fa-home' },
      { page: 'training', label: 'Training', icon: 'fa-graduation-cap' }
    ],
    'documents': [
      { page: 'dashboard', label: 'Dashboard', icon: 'fa-home' },
      { page: 'documents', label: 'Documents', icon: 'fa-folder-open' }
    ],
    'organization': [
      { page: 'dashboard', label: 'Dashboard', icon: 'fa-home' },
      { page: 'organization', label: 'Organization', icon: 'fa-sitemap' }
    ],
    'reports': [
      { page: 'dashboard', label: 'Dashboard', icon: 'fa-home' },
      { page: 'reports', label: 'Reports', icon: 'fa-chart-line' }
    ],
    'user-management': [
      { page: 'dashboard', label: 'Dashboard', icon: 'fa-home' },
      { page: 'user-management', label: 'User Management', icon: 'fa-users-cog' }
    ],
    'my-tasks': [
      { page: 'dashboard', label: 'Dashboard', icon: 'fa-home' },
      { page: 'my-tasks', label: 'My Tasks', icon: 'fa-tasks' }
    ]
  };
  
  return breadcrumbMap[page] || [
    { page: 'dashboard', label: 'Dashboard', icon: 'fa-home' },
    { page: page, label: page.charAt(0).toUpperCase() + page.slice(1), icon: 'fa-cog' }
  ];
}

/**
 * Quick navigation shortcuts
 */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    // Only handle shortcuts if not in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }
    
    // Alt + key combinations for navigation
    if (e.altKey) {
      switch(e.key) {
        case '1':
          e.preventDefault();
          navigateToPageWithHistory('dashboard');
          break;
        case '2':
          e.preventDefault();
          navigateToPageWithHistory('products');
          break;
        case '3':
          e.preventDefault();
          navigateToPageWithHistory('improvements');
          break;
        case '4':
          e.preventDefault();
          navigateToPageWithHistory('training');
          break;
        case '5':
          e.preventDefault();
          navigateToPageWithHistory('documents');
          break;
        case 'b':
          e.preventDefault();
          goBack();
          break;
      }
    }
    
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      focusGlobalSearch();
    }
  });
}

/**
 * Focus global search input
 */
function focusGlobalSearch() {
  const searchInput = document.getElementById('globalSearch');
  if (searchInput) {
    searchInput.focus();
    searchInput.select();
  }
}

/**
 * Setup navigation tooltips with shortcuts
 */
function setupNavigationTooltips() {
  const tooltipMap = {
    'dashboard': 'Dashboard (Alt+1)',
    'products': 'Products (Alt+2)',
    'improvements': 'Improvements (Alt+3)',
    'training': 'Training (Alt+4)',
    'documents': 'Documents (Alt+5)'
  };
  
  document.querySelectorAll('.nav-item').forEach(item => {
    const page = item.getAttribute('data-page');
    if (tooltipMap[page]) {
      item.title = tooltipMap[page];
    }
  });
}

/**
 * Mobile navigation handler
 */
function setupMobileNavigation() {
  let touchStartX = 0;
  let touchStartY = 0;
  
  document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });
  
  document.addEventListener('touchend', function(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Horizontal swipe (navigation)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 100) {
      if (deltaX > 0) {
        // Swipe right - go back
        goBack();
      } else {
        // Swipe left - could implement forward navigation
      }
    }
  });
}

/**
 * Update navigation badge counts
 */
function updateNavigationBadges(badgeData) {
  Object.entries(badgeData).forEach(([page, count]) => {
    const navItem = document.querySelector(`[data-page="${page}"]`);
    if (navItem) {
      let badge = navItem.querySelector('.nav-badge');
      
      if (count > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'nav-badge';
          navItem.appendChild(badge);
        }
        badge.textContent = count;
      } else if (badge) {
        badge.remove();
      }
    }
  });
}

/**
 * Get navigation analytics
 */
function getNavigationAnalytics() {
  const analytics = {
    totalNavigations: navigationHistory.length,
    mostVisitedPages: {},
    averageSessionTime: 0,
    userNavigationPattern: []
  };
  
  // Count page visits
  navigationHistory.forEach(entry => {
    analytics.mostVisitedPages[entry.page] = 
      (analytics.mostVisitedPages[entry.page] || 0) + 1;
  });
  
  // Sort by most visited
  analytics.mostVisitedPages = Object.entries(analytics.mostVisitedPages)
    .sort(([,a], [,b]) => b - a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
  
  return analytics;
}

/**
 * Preload page content for better performance
 */
async function preloadPageContent(page) {
  if (pageCache.has(page)) {
    return pageCache.get(page);
  }
  
  try {
    // Check if page module exists
    const initFunctionName = `initialize${page.charAt(0).toUpperCase() + page.slice(1).replace('-', '')}`;
    
    if (typeof window[initFunctionName] === 'function') {
      // Preload page data without rendering
      const pageData = await window[initFunctionName](true); // Pass true for preload mode
      pageCache.set(page, pageData);
      return pageData;
    }
  } catch (error) {
    console.warn(`Could not preload page ${page}:`, error);
  }
  
  return null;
}

/**
 * Clear page cache
 */
function clearPageCache() {
  pageCache.clear();
  console.log('Page cache cleared');
}

/**
 * Setup navigation persistence
 */
function setupNavigationPersistence() {
  // Save current page on navigation
  window.addEventListener('beforeunload', function() {
    try {
      localStorage.setItem('taube-current-page', currentPage);
    } catch (error) {
      console.warn('Could not save current page:', error);
    }
  });
  
  // Restore page on load
  try {
    const savedPage = localStorage.getItem('taube-current-page');
    if (savedPage && savedPage !== 'dashboard') {
      setTimeout(() => {
        navigateToPageWithHistory(savedPage);
      }, 1000);
    }
  } catch (error) {
    console.warn('Could not restore saved page:', error);
  }
}

/**
 * Handle deep linking (future enhancement)
 */
function handleDeepLinking() {
  // Parse URL hash for deep linking
  const hash = window.location.hash.slice(1);
  if (hash) {
    const [page, ...params] = hash.split('/');
    if (page && NAV_ITEMS[page]) {
      setTimeout(() => {
        navigateToPageWithHistory(page);
      }, 1000);
    }
  }
  
  // Update URL hash on navigation
  window.addEventListener('navigation-changed', function(e) {
    window.location.hash = e.detail.page;
  });
}

/**
 * Initialize navigation system
 */
function initializeNavigation() {
  console.log('Initializing navigation system...');
  
  // Setup keyboard shortcuts
  setupKeyboardShortcuts();
  
  // Setup mobile navigation
  setupMobileNavigation();
  
  // Setup navigation tooltips
  setupNavigationTooltips();
  
  // Setup navigation persistence
  setupNavigationPersistence();
  
  // Handle deep linking
  handleDeepLinking();
  
  // Preload common pages
  ['dashboard', 'products', 'improvements'].forEach(page => {
    setTimeout(() => preloadPageContent(page), 2000);
  });
  
  console.log('Navigation system initialized');
}

// Export navigation functions
window.navigationModule = {
  navigateToPageWithHistory,
  goBack,
  updateBreadcrumbs,
  updateNavigationBadges,
  getNavigationAnalytics,
  preloadPageContent,
  clearPageCache,
  focusGlobalSearch
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeNavigation);
} else {
  initializeNavigation();
}