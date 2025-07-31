/**
 * Authentication Module for Taube Med QMS
 * Handles login, logout, and session management
 */

// Authentication state
let isAuthenticated = false;
let authAttempts = 0;
const MAX_AUTH_ATTEMPTS = 5;

// Demo user database
const DEMO_USERS = {
  'admin@taubemed.com': {
    password: 'admin123',
    role: 'qmr',
    name: 'Quality Manager',
    initials: 'QM'
  },
  'manager@taubemed.com': {
    password: 'manager123',
    role: 'manager',
    name: 'Department Manager',
    initials: 'DM'
  },
  'employee@taubemed.com': {
    password: 'employee123',
    role: 'employee',
    name: 'John Doe',
    initials: 'JD'
  },
  'trainee@taubemed.com': {
    password: 'trainee123',
    role: 'trainee',
    name: 'New Employee',
    initials: 'NE'
  }
};

/**
 * Handle login form submission
 */
function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  // Basic validation
  if (!email || !password) {
    showNotification('Please enter both email and password', 'error');
    return;
  }
  
  // Check rate limiting
  if (authAttempts >= MAX_AUTH_ATTEMPTS) {
    showNotification('Too many login attempts. Please try again later.', 'error');
    return;
  }
  
  // Show loading state
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
  submitBtn.disabled = true;
  
  // Simulate authentication delay
  setTimeout(() => {
    authenticateUser(email, password, submitBtn, originalText);
  }, 1000);
}

/**
 * Authenticate user credentials
 */
function authenticateUser(email, password, submitBtn, originalText) {
  let authSuccess = false;
  let userData = null;
  
  // Check demo users first
  if (DEMO_USERS[email] && DEMO_USERS[email].password === password) {
    authSuccess = true;
    userData = DEMO_USERS[email];
  } else if (email && password) {
    // For demo purposes, allow any email/password combination
    authSuccess = true;
    userData = {
      role: 'employee',
      name: email.split('@')[0].replace('.', ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      initials: email.substring(0, 2).toUpperCase()
    };
  }
  
  if (authSuccess) {
    // Reset auth attempts
    authAttempts = 0;
    
    // Set user in global state
    setCurrentUser(userData.role, userData.name, userData.initials, email);
    
    // Mark as authenticated
    isAuthenticated = true;
    
    // Save login state
    saveAuthState();
    
    // Show main application
    showMainApplication();
    
    // Show success notification
    showNotification(`Welcome back, ${userData.name}!`, 'success');
    
    // Log successful login
    console.log('Login successful:', {
      email: email,
      role: userData.role,
      timestamp: new Date()
    });
    
  } else {
    // Increment failed attempts
    authAttempts++;
    
    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    
    // Show error
    showNotification('Invalid email or password', 'error');
    
    // Clear password field
    document.getElementById('loginPassword').value = '';
    
    // Log failed attempt
    console.warn('Login failed:', {
      email: email,
      attempts: authAttempts,
      timestamp: new Date()
    });
  }
}

/**
 * Quick login for demo purposes
 */
function quickLogin(role) {
  const roleUsers = {
    'qmr': { email: 'admin@taubemed.com', password: 'admin123' },
    'manager': { email: 'manager@taubemed.com', password: 'manager123' },
    'employee': { email: 'employee@taubemed.com', password: 'employee123' },
    'trainee': { email: 'trainee@taubemed.com', password: 'trainee123' }
  };
  
  const user = roleUsers[role];
  if (user) {
    document.getElementById('loginEmail').value = user.email;
    document.getElementById('loginPassword').value = user.password;
    
    // Trigger login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.dispatchEvent(new Event('submit'));
    }
  }
}

/**
 * Show main application and hide login page
 */
function showMainApplication() {
  const loginPage = document.getElementById('loginPage');
  const mainApp = document.getElementById('mainApp');
  
  if (loginPage && mainApp) {
    // Smooth transition
    loginPage.style.opacity = '0';
    
    setTimeout(() => {
      loginPage.classList.add('hidden');
      mainApp.classList.remove('hidden');
      
      // Initialize app if not already done
      if (typeof initializeApp === 'function') {
        initializeApp();
      }
      
      // Load initial dashboard
      if (typeof navigateToPage === 'function') {
        navigateToPage('dashboard');
      }
      
    }, 300);
  }
}

/**
 * Handle logout
 */
function logout() {
  // Show confirmation dialog
  if (!confirm('Are you sure you want to logout?')) {
    return;
  }
  
  try {
    // Clear authentication state
    isAuthenticated = false;
    authAttempts = 0;
    
    // Clear global user state
    currentUser = null;
    userRole = null;
    
    // Clear saved auth state
    clearAuthState();
    
    // Show login page
    showLoginPage();
    
    // Show logout notification
    showNotification('You have been logged out successfully.', 'info');
    
    // Log logout
    console.log('User logged out:', {
      timestamp: new Date()
    });
    
  } catch (error) {
    console.error('Error during logout:', error);
    showNotification('An error occurred during logout', 'error');
  }
  
  // Close any open dropdowns
  if (typeof closeAllDropdowns === 'function') {
    closeAllDropdowns();
  }
}

/**
 * Show login page and hide main application
 */
function showLoginPage() {
  const loginPage = document.getElementById('loginPage');
  const mainApp = document.getElementById('mainApp');
  
  if (loginPage && mainApp) {
    mainApp.classList.add('hidden');
    loginPage.classList.remove('hidden');
    loginPage.style.opacity = '1';
    
    // Reset login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.reset();
    }
    
    // Focus on email field
    const emailField = document.getElementById('loginEmail');
    if (emailField) {
      setTimeout(() => emailField.focus(), 300);
    }
  }
}

/**
 * Save authentication state to localStorage
 */
function saveAuthState() {
  try {
    const authData = {
      isAuthenticated: true,
      loginTime: new Date().toISOString(),
      userEmail: currentUser?.email
    };
    
    localStorage.setItem('taube-auth', JSON.stringify(authData));
    
    // Also save user preferences
    if (typeof saveUserPreferences === 'function') {
      saveUserPreferences();
    }
    
  } catch (error) {
    console.warn('Could not save auth state:', error);
  }
}

/**
 * Clear authentication state from localStorage
 */
function clearAuthState() {
  try {
    localStorage.removeItem('taube-auth');
    localStorage.removeItem('taube-user');
    localStorage.removeItem('taube-theme'); // Optional: keep theme preference
  } catch (error) {
    console.warn('Could not clear auth state:', error);
  }
}

/**
 * Check if user has valid session
 */
function checkAuthState() {
  try {
    const authData = localStorage.getItem('taube-auth');
    if (!authData) return false;
    
    const { isAuthenticated, loginTime, userEmail } = JSON.parse(authData);
    
    // Check if login is recent (within 24 hours)
    const loginDate = new Date(loginTime);
    const now = new Date();
    const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
    
    if (isAuthenticated && hoursDiff < 24) {
      // Try to restore user session
      const savedUser = localStorage.getItem('taube-user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setCurrentUser(userData.role, userData.name, userData.initials, userData.email);
        return true;
      }
    }
    
    // Clear expired session
    clearAuthState();
    return false;
    
  } catch (error) {
    console.warn('Error checking auth state:', error);
    clearAuthState();
    return false;
  }
}

/**
 * Auto-login if valid session exists
 */
function autoLogin() {
  if (checkAuthState()) {
    isAuthenticated = true;
    showMainApplication();
    showNotification('Welcome back! Session restored.', 'success');
    return true;
  }
  return false;
}

/**
 * Session timeout handler
 */
function handleSessionTimeout() {
  if (isAuthenticated) {
    showNotification('Your session has expired. Please login again.', 'warning');
    logout();
  }
}

/**
 * User profile management
 */
function viewProfile() {
  if (!currentUser) return;
  
  showNotification('Opening user profile...', 'info');
  
  // Future implementation: show user profile modal
  console.log('User profile:', currentUser);
}

/**
 * User settings management
 */
function userSettings() {
  showNotification('Opening user settings...', 'info');
  
  // Future implementation: show settings modal
}

/**
 * View user activity log
 */
function viewActivity() {
  showNotification('Loading activity log...', 'info');
  
  // Future implementation: show activity log
}

/**
 * Open help center
 */
function helpCenter() {
  showNotification('Opening help center...', 'info');
  
  // Future implementation: open help system
  window.open('https://help.taubemed.com', '_blank');
}

/**
 * Password reset functionality
 */
function resetPassword(email) {
  if (!email) {
    showNotification('Please enter your email address', 'error');
    return;
  }
  
  showNotification('Password reset instructions sent to your email', 'success');
  
  // Future implementation: actual password reset
  console.log('Password reset requested for:', email);
}

/**
 * Initialize authentication system
 */
function initializeAuth() {
  // Try auto-login first
  if (!autoLogin()) {
    // Show login page if no valid session
    showLoginPage();
  }
  
  // Setup session timeout (24 hours)
  setTimeout(handleSessionTimeout, 24 * 60 * 60 * 1000);
  
  // Setup periodic session check (every hour)
  setInterval(() => {
    if (!checkAuthState() && isAuthenticated) {
      handleSessionTimeout();
    }
  }, 60 * 60 * 1000);
  
  console.log('Authentication system initialized');
}

// Export functions for global access
window.authModule = {
  handleLogin,
  quickLogin,
  logout,
  viewProfile,
  userSettings,
  viewActivity,
  helpCenter,
  resetPassword,
  checkAuthState,
  isAuthenticated: () => isAuthenticated
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAuth);
} else {
  initializeAuth();
}