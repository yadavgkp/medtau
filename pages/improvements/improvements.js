/**
 * Improvements Module for Taube Med QMS
 * Handles management of improvements, corrections, corrective and preventive actions.
 */

// Improvements state
let improvements = [];
let filteredImprovements = [];
let currentImprovement = null;

// Sample improvements data
const SAMPLE_IMPROVEMENTS = [
  {
    id: 'IMP-001',
    type: 'corrective-action',
    title: 'Address repeat audit finding on document control',
    source: 'internal-audit',
    priority: 'high',
    status: 'in-progress',
    assignee: 'John Doe',
    department: 'Quality Assurance',
    createdDate: '2024-02-15',
    dueDate: '2024-03-30',
    effectivenessCheck: 'pending',
    authorityNotification: 'not-required'
  },
  {
    id: 'IMP-002',
    type: 'improvement',
    title: 'Streamline the change control process',
    source: 'employee-suggestion',
    priority: 'medium',
    status: 'planned',
    assignee: 'Jane Smith',
    department: 'Regulatory Affairs',
    createdDate: '2024-02-20',
    dueDate: '2024-04-15',
    effectivenessCheck: 'n/a',
    authorityNotification: 'n/a'
  },
  {
    id: 'IMP-003',
    type: 'preventive-action',
    title: 'Mitigate potential supply chain disruption for critical components',
    source: 'supplier-evaluation',
    priority: 'critical',
    status: 'in-progress',
    assignee: 'Mike Johnson',
    department: 'Production',
    createdDate: '2024-02-25',
    dueDate: '2024-03-20',
    effectivenessCheck: 'pending',
    authorityNotification: 'not-required'
  },
    {
    id: 'IMP-004',
    type: 'correction',
    title: 'Correct mislabeled batch records from Lot B-123',
    source: 'customer-complaint',
    priority: 'high',
    status: 'completed',
    assignee: 'Peter Jones',
    department: 'Production',
    createdDate: '2024-01-10',
    dueDate: '2024-01-12',
    effectivenessCheck: 'completed',
    authorityNotification: 'required'
  }
];

/**
 * Initialize Improvements module
 */
async function initializeImprovements(preloadMode = false) {
  console.log('Initializing Improvements module...');

  if (preloadMode) {
    return SAMPLE_IMPROVEMENTS;
  }

  // Load improvements data
  await loadImprovementsData();

  // Render improvements overview
  renderImprovementsOverview();

  console.log('Improvements module initialized successfully');
}

/**
 * Load improvements data
 */
async function loadImprovementsData() {
  try {
    // In a real application, this would fetch from an API
    improvements = SAMPLE_IMPROVEMENTS;
    filteredImprovements = improvements;

  } catch (error) {
    console.error('Error loading improvements data:', error);
    showNotification('Error loading improvements data', 'error');
    improvements = SAMPLE_IMPROVEMENTS; // Fallback
  }
}

/**
 * Render improvements overview page
 */
function renderImprovementsOverview() {
  const content = document.getElementById('mainContent');
  if (!content) return;

  content.innerHTML = `
    <div class="page active">
      <div class="improvements-header">
        <h1>Continuous Improvement</h1>
        <p>Manage all quality improvements, corrections, and corrective/preventive actions (CAPA).</p>
      </div>

      <div class="page-header">
        <h2 class="page-title">
          <i class="fas fa-rocket"></i>
          Improvement Initiatives
        </h2>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="openNewImprovementModal()">
            <i class="fas fa-plus"></i>
            New Improvement
          </button>
          <button class="btn btn-secondary" onclick="toggleAdvancedFilters()">
            <i class="fas fa-filter"></i>
            Filter
          </button>
        </div>
      </div>

      <div class="filters-advanced" id="advancedFilters">
        ${renderAdvancedFilters()}
      </div>

      <div class="improvements-types">
        ${renderImprovementTypeCards()}
      </div>

      <div class="improvements-table">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Source</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assignee</th>
                <th>Due Date</th>
                <th>Effectiveness Check</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="improvementsTableBody">
              ${renderImprovementsTable()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Add event listeners for filters
  setupFilterEventListeners();
}

/**
 * Render advanced filters
 */
function renderAdvancedFilters() {
    return `
    <div class="filters-grid">
      <div class="filter-group">
        <label class="filter-label">Type</label>
        <select class="form-input" id="filterType">
          <option value="">All</option>
          <option value="improvement">Improvement</option>
          <option value="correction">Correction</option>
          <option value="corrective-action">Corrective Action</option>
          <option value="preventive-action">Preventive Action</option>
        </select>
      </div>
      <div class="filter-group">
        <label class="filter-label">Priority</label>
        <select class="form-input" id="filterPriority">
          <option value="">All</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div class="filter-group">
        <label class="filter-label">Status</label>
        <select class="form-input" id="filterStatus">
          <option value="">All</option>
          <option value="planned">Planned</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
      <div class="filter-group">
        <label class="filter-label">Assignee</label>
        <input type="text" class="form-input" id="filterAssignee" placeholder="Enter name">
      </div>
    </div>
    <div style="text-align: right; margin-top: 1rem;">
        <button class="btn btn-secondary" onclick="resetFilters()">Reset</button>
        <button class="btn btn-primary" onclick="applyFilters()">Apply</button>
    </div>
  `;
}

/**
 * Render improvement type cards
 */
function renderImprovementTypeCards() {
    const types = {
        'improvement': { icon: 'fa-lightbulb', title: 'Improvement', description: 'Proactive changes to enhance processes.' },
        'correction': { icon: 'fa-wrench', title: 'Correction', description: 'Immediate fix for a non-conformity.' },
        'corrective-action': { icon: 'fa-tasks', title: 'Corrective Action', description: 'Actions to eliminate the cause of a detected non-conformity.' },
        'preventive-action': { icon: 'fa-shield-alt', title: 'Preventive Action', description: 'Actions to prevent the occurrence of a potential non-conformity.' }
    };

    return Object.keys(types).map(type => {
        const count = improvements.filter(imp => imp.type === type).length;
        return `
      <div class="type-card ${type}" onclick="filterByType('${type}')">
        <div class="type-icon"><i class="fas ${types[type].icon}"></i></div>
        <div class="type-title">${types[type].title}</div>
        <div class="type-description">${types[type].description}</div>
        <div class="type-count">${count} Open</div>
      </div>
    `;
    }).join('');
}


/**
 * Render improvements table
 */
function renderImprovementsTable() {
    if (filteredImprovements.length === 0) {
        return `<tr><td colspan="10" style="text-align: center; padding: 2rem;">No improvements found.</td></tr>`;
    }
  return filteredImprovements.map(imp => `
    <tr>
      <td>${imp.id}</td>
      <td class="cell-content expandable" onmouseover="showTooltip(this, '${imp.title}')" onmouseout="hideTooltip(this)">${imp.title}</td>
      <td><span class="status-badge status-${imp.type}">${getImprovementTypeText(imp.type)}</span></td>
      <td><span class="source-badge source-${imp.source.toLowerCase().replace(/\s+/g, '-')}">${getImprovementSourceText(imp.source)}</span></td>
      <td><span class="priority-indicator priority-${imp.priority}"></span>${getPriorityText(imp.priority)}</td>
      <td><div class="status-tracker"><span class="status-dot status-${imp.status}"></span>${getStatusText(imp.status)}</div></td>
      <td>${imp.assignee}</td>
      <td>${imp.dueDate}</td>
      <td><div class="effectiveness-check ${imp.effectivenessCheck}">${getEffectivenessText(imp.effectivenessCheck)}</div></td>
      <td class="action-buttons">
        <button class="action-btn action-view" title="View Details" onclick="viewImprovementDetail('${imp.id}')"><i class="fas fa-eye"></i></button>
        <button class="action-btn action-edit" title="Edit" onclick="openEditImprovementModal('${imp.id}')"><i class="fas fa-edit"></i></button>
        <button class="action-btn action-status" title="Update Status" onclick="openUpdateStatusModal('${imp.id}')"><i class="fas fa-check-circle"></i></button>
      </td>
    </tr>
  `).join('');
}

/**
 * Helper functions for text conversion
 */
function getImprovementTypeText(type) {
    const map = { 'improvement': 'Improvement', 'correction': 'Correction', 'corrective-action': 'Corrective Action', 'preventive-action': 'Preventive Action' };
    return map[type] || type;
}

function getImprovementSourceText(source) {
    const map = { 'internal-audit': 'Internal Audit', 'employee-suggestion': 'Employee Suggestion', 'supplier-evaluation': 'Supplier Evaluation', 'customer-complaint': 'Customer Complaint' };
    return map[source] || source;
}

function getPriorityText(priority) {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
}

function getStatusText(status) {
    return status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getEffectivenessText(status) {
    const map = { 'pending': 'Pending', 'completed': 'Completed', 'overdue': 'Overdue', 'n/a': 'N/A' };
    return map[status] || status;
}


/**
 * Event Listeners and Actions
 */

function setupFilterEventListeners() {
    document.getElementById('filterType').addEventListener('change', applyFilters);
    document.getElementById('filterPriority').addEventListener('change', applyFilters);
    document.getElementById('filterStatus').addEventListener('change', applyFilters);
}

function toggleAdvancedFilters() {
    document.getElementById('advancedFilters').classList.toggle('show');
}

function applyFilters() {
    const type = document.getElementById('filterType').value;
    const priority = document.getElementById('filterPriority').value;
    const status = document.getElementById('filterStatus').value;
    const assignee = document.getElementById('filterAssignee').value.toLowerCase();

    filteredImprovements = improvements.filter(imp => {
        return (type ? imp.type === type : true) &&
               (priority ? imp.priority === priority : true) &&
               (status ? imp.status === status : true) &&
               (assignee ? imp.assignee.toLowerCase().includes(assignee) : true);
    });

    document.getElementById('improvementsTableBody').innerHTML = renderImprovementsTable();
}

function resetFilters() {
    document.getElementById('filterType').value = '';
    document.getElementById('filterPriority').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterAssignee').value = '';
    applyFilters();
}

function filterByType(type) {
    document.getElementById('filterType').value = type;
    applyFilters();
    document.getElementById('advancedFilters').classList.add('show');
}

function openNewImprovementModal() {
    showNotification('Opening new improvement form...', 'info');
    // In a real app, a modal would be rendered here.
}
function viewImprovementDetail(id) {
    showNotification(`Viewing details for ${id}`, 'info');
    // In a real app, a detail view or modal would be shown.
}

function openEditImprovementModal(id) {
    showNotification(`Opening edit form for ${id}`, 'info');
}

function openUpdateStatusModal(id) {
    showNotification(`Opening status update form for ${id}`, 'info');
}


function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'cell-tooltip';
    tooltip.textContent = text;
    element.appendChild(tooltip);
    tooltip.style.display = 'block';
}

function hideTooltip(element) {
    const tooltip = element.querySelector('.cell-tooltip');
    if (tooltip) {
        element.removeChild(tooltip);
    }
}