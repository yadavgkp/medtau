/**
 * User Management Module for Taube Med QMS
 * Handles user creation, role assignment, and profile management.
 */

// State
let users = [];

// Sample Data from auth.js and main_app.js can be used or extended here
const SAMPLE_USERS = [
    { id: 'U001', name: 'Quality Manager', email: 'admin@taubemed.com', role: 'qmr', lastLogin: '2024-03-10T10:00:00Z', status: 'active' },
    { id: 'U002', name: 'Department Manager', email: 'manager@taubemed.com', role: 'manager', lastLogin: '2024-03-10T11:30:00Z', status: 'active' },
    { id: 'U003', name: 'John Doe', email: 'employee@taubemed.com', role: 'employee', lastLogin: '2024-03-09T14:00:00Z', status: 'active' },
    { id: 'U004', name: 'New Employee', email: 'trainee@taubemed.com', role: 'trainee', lastLogin: '2024-03-08T09:00:00Z', status: 'inactive' },
];

/**
 * Initialize User Management module
 */
async function initializeUserManagement(preloadMode = false) {
    console.log('Initializing User Management module...');
    if (preloadMode) return;
    await loadUsersData();
    renderUserManagementPage();
    console.log('User Management module initialized successfully');
}


/**
 * Load users data
 */
async function loadUsersData() {
    try {
        // In a real application, this would fetch from an API
        users = SAMPLE_USERS;
    } catch (error) {
        console.error('Error loading users data:', error);
        showNotification('Error loading users data', 'error');
    }
}


/**
 * Render the main user management page
 */
function renderUserManagementPage() {
    const content = document.getElementById('mainContent');
    if (!content) return;

    content.innerHTML = `
    <div class="page active">
        <div class="user-management-header">
            <h1>User Management</h1>
            <p>Administer user accounts, roles, and permissions.</p>
        </div>

        <div class="page-header">
            <h2 class="page-title"><i class="fas fa-users-cog"></i> All Users</h2>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="addNewUser()">
                    <i class="fas fa-user-plus"></i> Add New User
                </button>
            </div>
        </div>

        <div class="user-table-container">
            <table class="user-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Role</th>
                        <th>Last Login</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${renderUserTable()}
                </tbody>
            </table>
        </div>
    </div>
    `;
}


/**
 * Render the user table rows
 */
function renderUserTable() {
    return users.map(user => {
        const initials = user.name.split(' ').map(n => n[0]).join('');
        return `
            <tr>
                <td>
                    <div class="user-profile">
                        <div class="user-avatar-table">${initials}</div>
                        <div class="user-info-table">
                            <div class="user-name-table">${user.name}</div>
                            <div class="user-email-table">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td><span class="role-badge role-${user.role}">${getRoleText(user.role)}</span></td>
                <td>${new Date(user.lastLogin).toLocaleString()}</td>
                <td><span class="status-badge status-${user.status}">${getStatusText(user.status)}</span></td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="editUser('${user.id}')"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deactivateUser('${user.id}')"><i class="fas fa-user-slash"></i> Deactivate</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Helper functions for display text
function getRoleText(role) {
    const roles = { qmr: 'QMR', manager: 'Manager', employee: 'Employee', trainee: 'Trainee' };
    return roles[role] || 'N/A';
}

function getStatusText(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

// Placeholder actions
function addNewUser() {
    showNotification('Opening form to add a new user...', 'info');
}

function editUser(userId) {
    showNotification(`Editing user ${userId}...`, 'info');
}

function deactivateUser(userId) {
    if (confirm('Are you sure you want to deactivate this user?')) {
        showNotification(`Deactivating user ${userId}...`, 'warning');
        // Logic to update user status would go here
    }
}