/**
 * Dashboard Module for Taube Med QMS
 * Handles role-based dashboard views and functionality
 */

// Dashboard state
let dashboardData = {};
let dashboardWidgets = [];
let refreshInterval = null;

// Sample data for demonstration
const SAMPLE_DASHBOARD_DATA = {
  qmr: {
    stats: {
      totalUsers: 47,
      activeProducts: 12,
      openImprovements: 24,
      systemCompliance: 96
    },
    departments: [
      {
        name: 'Quality Assurance',
        icon: 'fa-shield-alt',
        members: 8,
        activeTasks: 12,
        completion: 85
      },
      {
        name: 'R&D Department',
        icon: 'fa-flask',
        members: 12,
        activeTasks: 18,
        completion: 72
      },
      {
        name: 'Production',
        icon: 'fa-cog',
        members: 15,
        activeTasks: 9,
        completion: 91
      },
      {
        name: 'Regulatory Affairs',
        icon: 'fa-chart-line',
        members: 5,
        activeTasks: 7,
        completion: 68
      }
    ],
    recentTasks: [
      {
        id: 'TASK-001',
        title: 'Update ISO 13485 procedures',
        department: 'Quality',
        priority: 'critical',
        assignee: 'John Doe',
        dueDate: 'Tomorrow'
      },
      {
        id: 'TASK-002',
        title: 'Product risk assessment review',
        department: 'R&D',
        priority: 'high',
        assignee: 'Jane Smith',
        dueDate: 'March 15'
      },
      {
        id: 'TASK-003',
        title: 'Training material update',
        department: 'All',
        priority: 'medium',
        assignee: 'Mike Johnson',
        dueDate: 'March 20'
      }
    ],
    attentionItems: [
      {
        type: 'critical',
        icon: 'fa-exclamation-circle',
        title: '5 Overdue Improvements',
        description: 'Multiple improvements are past their due dates and require immediate attention.',
        action: 'Review Now',
        handler: 'viewOverdueImprovements'
      },
      {
        type: 'warning',
        icon: 'fa-clock',
        title: 'Training Completion Delays',
        description: '12 employees have pending mandatory training requirements.',
        action: 'Check Training',
        handler: 'viewTrainingStatus'
      },
      {
        type: 'info',
        icon: 'fa-file-alt',
        title: 'Document Review Pending',
        description: '8 critical documents are awaiting your final approval.',
        action: 'Review Documents',
        handler: 'reviewDocuments'
      }
    ]
  },
  manager: {
    stats: {
      teamMembers: 12,
      activeTasks: 18,
      completionRate: 85,
      overdueItems: 3
    },
    recentTasks: [
      {
        id: 'TASK-004',
        title: 'Department quality review',
        priority: 'high',
        assignee: 'Team Lead',
        dueDate: 'Today'
      },
      {
        id: 'TASK-005',
        title: 'Process improvement meeting',
        priority: 'medium',
        assignee: 'Department Head',
        dueDate: 'Tomorrow'
      }
    ]
  },
  employee: {
    stats: {
      assignedTasks: 5,
      trainingProgress: 87,
      weeklyTasks: 3,
      overdueItems: 1
    },
    myTasks: [
      {
        id: 'TASK-006',
        title: 'Complete safety training module',
        priority: 'high',
        dueDate: 'Today',
        progress: 75
      },
      {
        id: 'TASK-007',
        title: 'Update process documentation',
        priority: 'medium',
        dueDate: 'Friday',
        progress: 40
      }
    ]
  },
  trainee: {
    stats: {
      coursesEnrolled: 6,
      completedCourses: 4,
      trainingHours: 24,
      weeklyHours: 8
    },
    courses: [
      {
        name: 'ISO 13485 Fundamentals',
        progress: 85,
        dueDate: 'Next Week'
      },
      {
        name: 'Quality Management Basics',
        progress: 100,
        completed: true
      }
    ]
  }
};

/**
 * Initialize Dashboard module
 */
async function initializeDashboard(preloadMode = false) {
  console.log('Initializing Dashboard...');
  
  if (preloadMode) {
    // Return data for preloading without rendering
    return SAMPLE_DASHBOARD_DATA;
  }
  
  // Load dashboard data
  await loadDashboardData();
  
  // Render appropriate dashboard based on user role
  renderDashboard();
  
  // Setup auto-refresh
  setupDashboardRefresh();
  
  // Initialize widgets
  initializeWidgets();
  
  console.log('Dashboard initialized successfully');
}

/**
 * Load dashboard data based on user role
 */
async function loadDashboardData() {
  try {
    const userRole = window.TaubeMedQMS?.getUserRole() || 'employee';
    dashboardData = SAMPLE_DASHBOARD_DATA[userRole] || SAMPLE_DASHBOARD_DATA.employee;
    
    // In a real application, this would fetch from an API
    // const response = await APIUtils.get(`/api/dashboard/${userRole}`);
    // dashboardData = response.data;
    
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showNotification('Error loading dashboard data', 'error');
    dashboardData = SAMPLE_DASHBOARD_DATA.employee; // Fallback
  }
}

/**
 * Render dashboard based on user role
 */
function renderDashboard() {
  const content = document.getElementById('mainContent');
  if (!content) return;
  
  const userRole = window.TaubeMedQMS?.getUserRole() || 'employee';
  
  switch (userRole) {
    case 'qmr':
      renderQMRDashboard(content);
      break;
    case 'manager':
      renderManagerDashboard(content);
      break;
    case 'employee':
      renderEmployeeDashboard(content);
      break;
    case 'trainee':
      renderTraineeDashboard(content);
      break;
    default:
      renderEmployeeDashboard(content);
  }
  
  // Animate elements after render
  setTimeout(() => {
    animateDashboardElements();
  }, 100);
}

/**
 * Render QMR Dashboard
 */
function renderQMRDashboard(container) {
  container.innerHTML = `
    <div class="page active qmr-view">
      <div class="dashboard-overview">
        <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">
          <i class="fas fa-crown"></i>
          QMR System Overview
        </h1>
        <p style="font-size: 1.1rem; opacity: 0.9;">
          Complete oversight of quality management system performance and compliance
        </p>
      </div>

      <div class="page-header">
        <h2 class="page-title">
          <i class="fas fa-tachometer-alt"></i>
          System Dashboard
        </h2>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="generateSystemReport()">
            <i class="fas fa-chart-line"></i>
            System Report
          </button>
          <button class="btn btn-secondary" onclick="refreshDashboard()">
            <i class="fas fa-sync-alt"></i>
            Refresh
          </button>
        </div>
      </div>

      <!-- System Statistics -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon">
              <i class="fas fa-users"></i>
            </div>
          </div>
          <div class="stat-value" data-count="${dashboardData.stats?.totalUsers || 0}">0</div>
          <div class="stat-label">Total Users</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            3 new this month
          </div>
          <div class="stat-progress">
            <div class="stat-progress-fill" style="width: 0%" data-width="85%"></div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon" style="background: var(--success);">
              <i class="fas fa-cube"></i>
            </div>
          </div>
          <div class="stat-value" data-count="${dashboardData.stats?.activeProducts || 0}">0</div>
          <div class="stat-label">Active Products</div>
          <div class="stat-change positive">
            <i class="fas fa-plus"></i>
            2 in development
          </div>
          <div class="stat-progress">
            <div class="stat-progress-fill" style="width: 0%" data-width="75%"></div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon" style="background: var(--warning);">
              <i class="fas fa-lightbulb"></i>
            </div>
          </div>
          <div class="stat-value" data-count="${dashboardData.stats?.openImprovements || 0}">0</div>
          <div class="stat-label">Open Improvements</div>
          <div class="stat-change negative">
            <i class="fas fa-exclamation-triangle"></i>
            5 overdue
          </div>
          <div class="stat-progress">
            <div class="stat-progress-fill" style="width: 0%" data-width="60%"></div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon" style="background: var(--info);">
              <i class="fas fa-shield-alt"></i>
            </div>
          </div>
          <div class="stat-value" data-count="${dashboardData.stats?.systemCompliance || 0}">0</div>
          <div class="stat-label">System Compliance (%)</div>
          <div class="stat-change positive">
            <i class="fas fa-chart-line"></i>
            +2% this quarter
          </div>
          <div class="stat-progress">
            <div class="stat-progress-fill" style="width: 0%" data-width="96%"></div>
          </div>
        </div>
      </div>

      <!-- Department Overview -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">
            <i class="fas fa-building"></i>
            Department Overview
          </h2>
          <button class="btn btn-secondary" onclick="manageOrganization()">
            <i class="fas fa-cog"></i>
            Manage
          </button>
        </div>
        <div class="department-grid">
          ${renderDepartments()}
        </div>
      </div>

      <!-- Task Assignment and Monitoring -->
      <div class="dashboard-grid">
        <div class="task-overview">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-tasks"></i>
              Recent Task Assignments
            </h3>
            <button class="btn btn-primary" onclick="assignNewTask()">
              <i class="fas fa-plus"></i>
              Assign Task
            </button>
          </div>
          <div class="task-list">
            ${renderRecentTasks()}
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-exclamation-triangle"></i>
              Urgent Attention Required
            </h3>
          </div>
          <div>
            ${renderAttentionItems()}
          </div>
        </div>
      </div>

      <!-- QMR Quick Actions -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">
            <i class="fas fa-bolt"></i>
            QMR Quick Actions
          </h2>
        </div>
        <div class="quick-actions">
          ${renderQMRQuickActions()}
        </div>
      </div>
    </div>
  `;
}

/**
 * Render Manager Dashboard
 */
function renderManagerDashboard(container) {
  container.innerHTML = `
    <div class="page active manager-view">
      <div class="page-header">
        <h1 class="page-title">
          <i class="fas fa-user-tie"></i>
          Department Manager Dashboard
        </h1>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="viewTeamTasks()">
            <i class="fas fa-tasks"></i>
            Team Tasks
          </button>
          <button class="btn btn-secondary" onclick="refreshDashboard()">
            <i class="fas fa-sync-alt"></i>
            Refresh
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon">
              <i class="fas fa-users"></i>
            </div>
          </div>
          <div class="stat-value" data-count="${dashboardData.stats?.teamMembers || 0}">0</div>
          <div class="stat-label">Team Members</div>
          <div class="stat-change positive">
            <i class="fas fa-user-plus"></i>
            1 new member
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon" style="background: var(--warning);">
              <i class="fas fa-tasks"></i>
            </div>
          </div>
          <div class="stat-value" data-count="${dashboardData.stats?.activeTasks || 0}">0</div>
          <div class="stat-label">Active Tasks</div>
          <div class="stat-change ${dashboardData.stats?.overdueItems > 0 ? 'negative' : 'positive'}">
            <i class="fas fa-clock"></i>
            ${dashboardData.stats?.overdueItems || 0} overdue
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon" style="background: var(--success);">
              <i class="fas fa-check-circle"></i>
            </div>
          </div>
          <div class="stat-value" data-count="${dashboardData.stats?.completionRate || 0}">0</div>
          <div class="stat-label">Completion Rate (%)</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            +5% this month
          </div>
        </div>
      </div>

      <div class="widget-grid">
        <div class="widget">
          <div class="widget-header">
            <h3 class="widget-title">
              <i class="fas fa-clipboard-list"></i>
              Team Tasks
            </h3>
            <a href="#" class="widget-action" onclick="viewAllTeamTasks()">View All</a>
          </div>
          <div class="task-list">
            ${renderManagerTasks()}
          </div>
        </div>

        <div class="widget">
          <div class="widget-header">
            <h3 class="widget-title">
              <i class="fas fa-chart-bar"></i>
              Department Performance
            </h3>
          </div>
          <div class="performance-metrics">
            <div class="performance-metric">
              <div class="metric-value">85%</div>
              <div class="metric-label">Task Completion</div>
              <div class="metric-trend positive">+5%</div>
            </div>
            <div class="performance-metric">
              <div class="metric-value">92%</div>
              <div class="metric-label">Quality Score</div>
              <div class="metric-trend positive">+2%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render Employee Dashboard
 */
function renderEmployeeDashboard(container) {
  container.innerHTML = `
    <div class="page active employee-view">
      <div class="page-header">
        <h1 class="page-title">
          <i class="fas fa-user"></i>
          My Dashboard
        </h1>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="viewMyTasks()">
            <i class="fas fa-list"></i>
            My Tasks
          </button>
          <button class="btn btn-secondary" onclick="viewTraining()">
            <i class="fas fa-graduation-cap"></i>
            Training
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon">
              <i class="fas fa-tasks"></i>
            </div>
          </div>
          <div class="stat-value" data-count="${dashboardData.stats?.assignedTasks || 0}">0</div>
          <div class="stat-label">Assigned Tasks</div>
          <div class="stat-change ${dashboardData.stats?.overdueItems > 0 ? 'negative' : 'positive'}">
            <i class="fas fa-exclamation-triangle"></i>
            ${dashboardData.stats?.overdueItems || 0} overdue
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon" style="background: var(--success);">
              <i class="fas fa-graduation-cap"></i>
            </div>
          </div>
          <div class="stat-value" data-count="${dashboardData.stats?.trainingProgress || 0}">0</div>
          <div class="stat-label">Training Progress (%)</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            Course completed
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon" style="background: var(--info);">
              <i class="fas fa-calendar"></i>
            </div>
          </div>
          <div class="stat-value" data-count="${dashboardData.stats?.weeklyTasks || 0}">0</div>
          <div class="stat-label">This Week's Tasks</div>
          <div class="stat-change positive">
            <i class="fas fa-check"></i>
            On track
          </div>
        </div>
      </div>

      <div class="widget-grid">
        <div class="widget">
          <div class="widget-header">
            <h3 class="widget-title">
              <i class="fas fa-clipboard-list"></i>
              My Tasks
            </h3>
          </div>
          <div class="task-list">
            ${renderEmployeeTasks()}
          </div>
        </div>

        <div class="widget">
          <div class="widget-header">
            <h3 class="widget-title">
              <i class="fas fa-book"></i>
              Training Progress
            </h3>
          </div>
          <div style="text-align: center; padding: 2rem;">
            <div class="progress-circle">
              <svg>
                <circle class="progress-bg" cx="60" cy="60" r="45"></circle>
                <circle class="progress-fill" cx="60" cy="60" r="45" data-progress="${dashboardData.stats?.trainingProgress || 0}"></circle>
              </svg>
              <div class="progress-text">${dashboardData.stats?.trainingProgress || 0}%</div>
            </div>
            <p style="color: var(--gray); margin-top: 1rem;">Overall training completion</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render Trainee Dashboard
 */
function renderTraineeDashboard(container) {
  container.innerHTML = `
    <div class="page active trainee-view">
      <div class="page-header">
        <h1 class="page-title">
          <i class="fas fa-seedling"></i>
          Trainee Dashboard
        </h1>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="continueTraining()">
            <i class="fas fa-play"></i>
            Continue Training
          </button>
          <button class="btn btn-secondary" onclick="viewProgress()">
            <i class="fas fa-chart-line"></i>
            View Progress
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon">
              <i class="fas fa-book"></i>
            </div>
          </div>
          <div class="stat-value" data-count="${dashboardData.stats?.coursesEnrolled || 0}">0</div>
          <div class="stat-label">Courses Enrolled</div>
          <div class="stat-change positive">
            <i class="fas fa-plus"></i>
            2 new courses
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon" style="background: var(--success);">
              <i class="fas fa-trophy"></i>
            </div>
          </div>
          <div class="stat-value" data-count="${dashboardData.stats?.completedCourses || 0}">0</div>
          <div class="stat-label">Completed Courses</div>
          <div class="stat-change positive">
            <i class="fas fa-check"></i>
            1 this week
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon" style="background: var(--warning);">
              <i class="fas fa-clock"></i>
            </div>
          </div>
          <div class="stat-value" data-count="${dashboardData.stats?.trainingHours || 0}">0</div>
          <div class="stat-label">Hours Trained</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            ${dashboardData.stats?.weeklyHours || 0}h this week
          </div>
        </div>
      </div>

      <div class="widget-grid">
        <div class="widget">
          <div class="widget-header">
            <h3 class="widget-title">
              <i class="fas fa-graduation-cap"></i>
              Current Courses
            </h3>
          </div>
          <div>
            ${renderTraineeCourses()}
          </div>
        </div>

        <div class="widget">
          <div class="widget-header">
            <h3 class="widget-title">
              <i class="fas fa-chart-line"></i>
              Learning Progress
            </h3>
          </div>
          <div class="chart-placeholder">
            <i class="fas fa-chart-line"></i>
            <p>Training progress chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Helper function to render departments
 */
function renderDepartments() {
  if (!dashboardData.departments) return '';
  
  return dashboardData.departments.map(dept => `
    <div class="department-card role-manager">
      <div class="department-header">
        <div class="department-icon">
          <i class="fas ${dept.icon}"></i>
        </div>
        <div class="department-info">
          <h3>${dept.name}</h3>
          <div class="department-meta">${dept.members} members • ${dept.activeTasks} active tasks</div>
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: 0%" data-width="${dept.completion}%"></div>
      </div>
      <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--gray);">${dept.completion}% task completion</div>
    </div>
  `).join('');
}

/**
 * Helper function to render recent tasks
 */
function renderRecentTasks() {
  if (!dashboardData.recentTasks) return '<p style="text-align: center; color: var(--gray);">No recent tasks</p>';
  
  return dashboardData.recentTasks.map(task => `
    <div class="task-item">
      <div class="task-priority priority-${task.priority}"></div>
      <div class="task-content">
        <div class="task-title">${task.title}</div>
        <div class="task-meta">Due: ${task.dueDate} • ${task.department} Department</div>
      </div>
      <div class="task-assignee">
        <div class="assignee-avatar">${window.utils?.StringUtils.extractInitials(task.assignee) || 'TM'}</div>
        <span style="font-size: 0.8rem;">${task.assignee}</span>
      </div>
    </div>
  `).join('');
}

/**
 * Helper function to render attention items
 */
function renderAttentionItems() {
  if (!dashboardData.attentionItems) return '';
  
  return dashboardData.attentionItems.map(item => `
    <div class="attention-card ${item.type}">
      <div class="attention-card-icon">
        <i class="fas ${item.icon}"></i>
      </div>
      <div class="attention-card-content">
        <div class="attention-card-title">${item.title}</div>
        <div class="attention-card-description">${item.description}</div>
        <button class="btn btn-${item.type === 'critical' ? 'danger' : item.type}" onclick="${item.handler}()">
          <i class="fas fa-eye"></i>
          ${item.action}
        </button>
      </div>
    </div>
  `).join('');
}

/**
 * Helper function to render QMR quick actions
 */
function renderQMRQuickActions() {
  return `
    <button class="quick-action" onclick="assignNewTask()">
      <i class="fas fa-user-plus quick-action-icon"></i>
      <span class="quick-action-text">Assign Task</span>
    </button>
    <button class="quick-action" onclick="createImprovement()" style="background: var(--success);">
      <i class="fas fa-lightbulb quick-action-icon"></i>
      <span class="quick-action-text">New Improvement</span>
    </button>
    <button class="quick-action" onclick="manageUsers()" style="background: var(--warning);">
      <i class="fas fa-users-cog quick-action-icon"></i>
      <span class="quick-action-text">Manage Users</span>
    </button>
    <button class="quick-action" onclick="systemSettings()" style="background: var(--info);">
      <i class="fas fa-cog quick-action-icon"></i>
      <span class="quick-action-text">System Settings</span>
    </button>
    <button class="quick-action" onclick="auditTrail()" style="background: var(--secondary);">
      <i class="fas fa-history quick-action-icon"></i>
      <span class="quick-action-text">Audit Trail</span>
    </button>
    <button class="quick-action" onclick="generateReports()" style="background: var(--accent);">
      <i class="fas fa-chart-bar quick-action-icon"></i>
      <span class="quick-action-text">Generate Reports</span>
    </button>
  `;
}

/**
 * Helper function to render manager tasks
 */
function renderManagerTasks() {
  if (!dashboardData.recentTasks) return '<p style="text-align: center; color: var(--gray);">No tasks assigned</p>';
  
  return dashboardData.recentTasks.map(task => `
    <div class="task-item">
      <div class="task-priority priority-${task.priority}"></div>
      <div class="task-content">
        <div class="task-title">${task.title}</div>
        <div class="task-meta">Due: ${task.dueDate} • Assigned to: ${task.assignee}</div>
      </div>
    </div>
  `).join('');
}

/**
 * Helper function to render employee tasks
 */
function renderEmployeeTasks() {
  if (!dashboardData.myTasks) return '<p style="text-align: center; color: var(--gray);">No tasks assigned</p>';
  
  return dashboardData.myTasks.map(task => `
    <div class="task-item">
      <div class="task-priority priority-${task.priority}"></div>
      <div class="task-content">
        <div class="task-title">${task.title}</div>
        <div class="task-meta">Due: ${task.dueDate}</div>
        <div class="progress-bar" style="margin-top: 0.5rem;">
          <div class="progress-fill" style="width: ${task.progress}%"></div>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Helper function to render trainee courses
 */
function renderTraineeCourses() {
  if (!dashboardData.courses) return '<p style="text-align: center; color: var(--gray);">No courses enrolled</p>';
  
  return dashboardData.courses.map(course => `
    <div style="padding: 1rem; background: var(--warm); border-radius: 10px; margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h4 style="color: var(--primary); margin-bottom: 0.5rem;">${course.name}</h4>
          ${course.completed ? 
            '<p style="color: var(--success);"><i class="fas fa-check-circle"></i> Completed</p>' :
            `<div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${course.progress}%"></div>
              </div>
              <p style="color: var(--gray); font-size: 0.8rem; margin-top: 0.5rem;">${course.progress}% Complete • Due: ${course.dueDate}</p>
            </div>`
          }
        </div>
        <button class="btn ${course.completed ? 'btn-secondary' : 'btn-primary'}">
          ${course.completed ? 'View Certificate' : 'Continue'}
        </button>
      </div>
    </div>
  `).join('');
}

/**
 * Animate dashboard elements
 */
function animateDashboardElements() {
  // Animate counters
  if (window.TaubeMedQMS?.animateCounters) {
    window.TaubeMedQMS.animateCounters();
  }
  
  // Animate progress bars
  if (window.TaubeMedQMS?.animateProgressBars) {
    window.TaubeMedQMS.animateProgressBars();
  }
  
  // Animate progress circles
  if (window.TaubeMedQMS?.animateProgressCircles) {
    window.TaubeMedQMS.animateProgressCircles();
  }
}

/**
 * Setup dashboard auto-refresh
 */
function setupDashboardRefresh() {
  // Refresh dashboard data every 5 minutes
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  
  refreshInterval = setInterval(async () => {
    console.log('Auto-refreshing dashboard data...');
    await loadDashboardData();
    // Don't re-render, just update data silently
  }, 5 * 60 * 1000);
}

/**
 * Initialize dashboard widgets
 */
function initializeWidgets() {
  // Initialize any interactive widgets
  dashboardWidgets = [];
  
  // Add chart widgets, interactive elements, etc.
  console.log('Dashboard widgets initialized');
}

/**
 * Refresh dashboard manually
 */
async function refreshDashboard() {
  showNotification('Refreshing dashboard...', 'info');
  
  try {
    await loadDashboardData();
    renderDashboard();
    
    showNotification('Dashboard refreshed successfully!', 'success');
  } catch (error) {
    console.error('Error refreshing dashboard:', error);
    showNotification('Error refreshing dashboard', 'error');
  }
}

// Action handlers for dashboard buttons
function generateSystemReport() {
  showNotification('Generating comprehensive system report...', 'info');
  setTimeout(() => {
    showNotification('System report generated successfully!', 'success');
  }, 2000);
}

function manageOrganization() {
  if (window.TaubeMedQMS?.navigateToPage) {
    window.TaubeMedQMS.navigateToPage('organization');
  }
}

function assignNewTask() {
  showNotification('Opening task assignment form...', 'info');
}

function createImprovement() {
  if (window.TaubeMedQMS?.navigateToPage) {
    window.TaubeMedQMS.navigateToPage('improvements');
  }
}

function manageUsers() {
  if (window.TaubeMedQMS?.navigateToPage) {
    window.TaubeMedQMS.navigateToPage('user-management');
  }
}

function systemSettings() {
  showNotification('Opening system settings...', 'info');
}

function auditTrail() {
  showNotification('Loading audit trail...', 'info');
}

function generateReports() {
  if (window.TaubeMedQMS?.navigateToPage) {
    window.TaubeMedQMS.navigateToPage('reports');
  }
}

function viewOverdueImprovements() {
  showNotification('Loading overdue improvements...', 'warning');
}

function viewTrainingStatus() {
  showNotification('Loading training status report...', 'warning');
}

function reviewDocuments() {
  showNotification('Opening document review queue...', 'info');
}

function viewTeamTasks() {
  showNotification('Loading team tasks overview...', 'info');
}

function viewAllTeamTasks() {
  showNotification('Loading all team tasks...', 'info');
}

function viewMyTasks() {
  if (window.TaubeMedQMS?.navigateToPage) {
    window.TaubeMedQMS.navigateToPage('my-tasks');
  }
}

function viewTraining() {
  if (window.TaubeMedQMS?.navigateToPage) {
    window.TaubeMedQMS.navigateToPage('training');
  }
}

function continueTraining() {
  showNotification('Resuming training course...', 'info');
}

function viewProgress() {
  showNotification('Loading training progress report...', 'info');
}

// Export dashboard module
window.dashboardModule = {
  initializeDashboard,
  loadDashboardData,
  renderDashboard,
  refreshDashboard,
  animateDashboardElements
};

console.log('Dashboard module loaded');