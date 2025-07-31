/**
 * Organization Module for Taube Med QMS
 * Handles displaying the organizational chart and department information.
 */

// State
let departments = [];
let employeesOrg = [];
let orgStructure = {};

// Sample Data
const SAMPLE_DEPARTMENTS = [
    { id: 'CEO', name: 'Executive Office', description: 'Overall management and strategic direction.' },
    { id: 'QA', name: 'Quality Assurance', description: 'Ensures compliance with all quality standards and regulations.' },
    { id: 'RD', name: 'Research & Development', description: 'Designs and develops new products.' },
    { id: 'PROD', name: 'Production', description: 'Manufactures the medical devices.' },
];

const SAMPLE_EMPLOYEES_ORG = [
    { id: 'E101', name: 'Dr. Evelyn Reed', role: 'Chief Executive Officer', departmentId: 'CEO', managerId: null },
    { id: 'E102', name: 'Mark Chen', role: 'Head of Quality', departmentId: 'QA', managerId: 'E101' },
    { id: 'E103', name: 'Dr. Lena Petrova', role: 'Head of R&D', departmentId: 'RD', managerId: 'E101' },
    { id: 'E104', name: 'David Lee', role: 'Head of Production', departmentId: 'PROD', managerId: 'E101' },
    { id: 'E105', name: 'John Doe', role: 'Quality Engineer', departmentId: 'QA', managerId: 'E102' },
    { id: 'E106', name: 'Jane Smith', role: 'Production Supervisor', departmentId: 'PROD', managerId: 'E104' },
];


/**
 * Initialize Organization module
 */
async function initializeOrganization(preloadMode = false) {
    console.log('Initializing Organization module...');

    if (preloadMode) {
        return { departments, employeesOrg };
    }

    await loadOrganizationData();
    buildOrgStructure();
    renderOrganizationPage();

    console.log('Organization module initialized successfully');
}

/**
 * Load organization data from samples
 */
async function loadOrganizationData() {
    try {
        departments = SAMPLE_DEPARTMENTS;
        employeesOrg = SAMPLE_EMPLOYEES_ORG;
    } catch (error) {
        console.error('Error loading organization data:', error);
        showNotification('Error loading organization data', 'error');
    }
}

/**
 * Build the hierarchical organization structure
 */
function buildOrgStructure() {
    const employeeMap = new Map(employeesOrg.map(e => [e.id, { ...e, children: [] }]));
    let root = null;

    employeeMap.forEach(employee => {
        if (employee.managerId) {
            const manager = employeeMap.get(employee.managerId);
            if (manager) {
                manager.children.push(employee);
            }
        } else {
            root = employee; // Assumes single root (CEO)
        }
    });

    orgStructure = root;
}


/**
 * Render the main organization page
 */
function renderOrganizationPage() {
    const content = document.getElementById('mainContent');
    if (!content) return;

    content.innerHTML = `
    <div class="page active">
        <div class="organization-header">
            <h1>Company Organization</h1>
            <p>Visualize the company structure and key roles.</p>
        </div>

        <div class="page-header">
            <h2 class="page-title"><i class="fas fa-sitemap"></i> Organizational Chart</h2>
        </div>

        <div class="org-chart-container">
            <div class="org-chart">
                ${renderOrgChart(orgStructure)}
            </div>
        </div>

        <div class="department-info-container" id="departmentInfoContainer">
            ${renderDepartmentInfoCards()}
        </div>
    </div>
    `;
}

/**
 * Recursively render the org chart
 */
function renderOrgChart(node) {
    if (!node) return '';

    let childrenHtml = '';
    if (node.children && node.children.length > 0) {
        childrenHtml += '<ul>';
        node.children.forEach(child => {
            childrenHtml += renderOrgChart(child);
        });
        childrenHtml += '</ul>';
    }

    return `
        <li>
            <div class="node" onclick="showDepartmentInfo('${node.departmentId}')">
                <div class="role">${node.role}</div>
                <div class="name">${node.name}</div>
            </div>
            ${childrenHtml}
        </li>
    `;
}


/**
 * Render department info cards (initially hidden)
 */
function renderDepartmentInfoCards() {
    return departments.map(dept => `
        <div class="department-card-org" id="dept-card-${dept.id}">
            <h3><i class="fas fa-building"></i> ${dept.name}</h3>
            <p>${dept.description}</p>
            <h4>Team Members:</h4>
            <ul>
                ${employeesOrg.filter(e => e.departmentId === dept.id).map(e => `<li>${e.name} - ${e.role}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}


/**
 * Show information for a specific department
 */
function showDepartmentInfo(departmentId) {
    // Hide all cards first
    document.querySelectorAll('.department-card-org').forEach(card => card.classList.remove('active'));

    // Show the selected one
    const selectedCard = document.getElementById(`dept-card-${departmentId}`);
    if (selectedCard) {
        selectedCard.classList.add('active');
        selectedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showNotification(`Displaying information for the ${selectedCard.querySelector('h3').innerText.trim()} department.`, 'info');
    }
}