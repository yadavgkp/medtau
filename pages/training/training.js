/**
 * Training Module for Taube Med QMS
 * Handles training records, matrices, and compliance tracking.
 */

// Training state
let trainingRecords = [];
let employees = [];
let courses = [];

// Sample Data
const SAMPLE_EMPLOYEES = [
    { id: 'E001', name: 'John Doe', role: 'Quality Engineer' },
    { id: 'E002', name: 'Jane Smith', role: 'Production Manager' },
    { id: 'E003', name: 'Peter Jones', role: 'R&D Scientist' },
];

const SAMPLE_COURSES = [
    { id: 'C01', title: 'Good Manufacturing Practices (GMP)' },
    { id: 'C02', title: 'ISO 13485:2016 Standard' },
    { id: 'C03', title: 'Risk Management (ISO 14971)' },
];

const SAMPLE_TRAINING_RECORDS = [
    { employeeId: 'E001', courseId: 'C01', status: 'completed', completionDate: '2024-01-15', score: 95 },
    { employeeId: 'E001', courseId: 'C02', status: 'in-progress', progress: 50 },
    { employeeId: 'E002', courseId: 'C01', status: 'completed', completionDate: '2024-02-01', score: 98 },
    { employeeId: 'E002', courseId: 'C02', status: 'completed', completionDate: '2024-02-20', score: 92 },
    { employeeId: 'E003', courseId: 'C03', status: 'pending' },
];


/**
 * Initialize Training module
 */
async function initializeTraining(preloadMode = false) {
    console.log('Initializing Training module...');

    if (preloadMode) {
        return { trainingRecords, employees, courses };
    }

    await loadTrainingData();
    renderTrainingPage();

    console.log('Training module initialized successfully');
}

/**
 * Load training data
 */
async function loadTrainingData() {
    try {
        // In a real application, this would fetch from an API
        trainingRecords = SAMPLE_TRAINING_RECORDS;
        employees = SAMPLE_EMPLOYEES;
        courses = SAMPLE_COURSES;
    } catch (error) {
        console.error('Error loading training data:', error);
        showNotification('Error loading training data', 'error');
    }
}

/**
 * Render the main training page
 */
function renderTrainingPage() {
    const content = document.getElementById('mainContent');
    if (!content) return;

    const totalCompleted = trainingRecords.filter(r => r.status === 'completed').length;
    const overallCompliance = (totalCompleted / trainingRecords.length) * 100;


    content.innerHTML = `
    <div class="page active">
        <div class="training-header">
            <h1>Training Management</h1>
            <p>Track employee training, compliance, and certifications.</p>
        </div>

        <div class="page-header">
            <h2 class="page-title"><i class="fas fa-graduation-cap"></i> Training Overview</h2>
             <div class="btn-group">
                <button class="btn btn-primary" onclick="assignTraining()">
                    <i class="fas fa-plus"></i> Assign Training
                </button>
            </div>
        </div>

        <div class="training-stats">
            <div class="stat-card-training">
                <div class="stat-icon-training" style="background: var(--success);"><i class="fas fa-check-circle"></i></div>
                <div class="stat-info-training">
                    <h3>${totalCompleted}</h3>
                    <p>Completed Trainings</p>
                </div>
            </div>
            <div class="stat-card-training">
                <div class="stat-icon-training" style="background: var(--info);"><i class="fas fa-users"></i></div>
                <div class="stat-info-training">
                    <h3>${employees.length}</h3>
                    <p>Tracked Employees</p>
                </div>
            </div>
            <div class="stat-card-training">
                <div class="stat-icon-training" style="background: var(--accent);"><i class="fas fa-book"></i></div>
                <div class="stat-info-training">
                    <h3>${courses.length}</h3>
                    <p>Available Courses</p>
                </div>
            </div>
             <div class="stat-card-training">
                <div class="stat-icon-training" style="background: var(--warning);"><i class="fas fa-tachometer-alt"></i></div>
                <div class="stat-info-training">
                    <h3>${overallCompliance.toFixed(0)}%</h3>
                    <p>Overall Compliance</p>
                </div>
            </div>
        </div>

        <div class="training-table-container">
            <table class="training-table">
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Course</th>
                        <th>Status</th>
                        <th>Completion Progress</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${renderTrainingRecords()}
                </tbody>
            </table>
        </div>

        <div class="training-matrix-container">
             <h2><i class="fas fa-th"></i> Training Matrix</h2>
             <div class="table-responsive">
                <table class="training-matrix-table">
                   ${renderTrainingMatrix()}
                </table>
             </div>
        </div>
    </div>
    `;
}

/**
 * Render training records in the table
 */
function renderTrainingRecords() {
    return trainingRecords.map(record => {
        const employee = employees.find(e => e.id === record.employeeId);
        const course = courses.find(c => c.id === record.courseId);

        return `
        <tr>
            <td>${employee.name} (${employee.role})</td>
            <td>${course.title}</td>
            <td><span class="status-badge status-${record.status}">${getStatusText(record.status)}</span></td>
            <td>
                <div class="completion-status">
                    ${record.status === 'in-progress' ? `
                        <div class="progress-bar-training">
                            <div class="progress-fill-training" style="width: ${record.progress}%;"></div>
                        </div>
                        <span>${record.progress}%</span>
                    ` : (record.status === 'completed' ? '100%' : '0%')}
                </div>
            </td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="viewTrainingRecordDetails('${record.employeeId}', '${record.courseId}')">
                    <i class="fas fa-eye"></i> Details
                </button>
            </td>
        </tr>
        `;
    }).join('');
}


/**
 * Render the training matrix
 */
function renderTrainingMatrix() {
    // Header Row
    let headerHtml = '<thead><tr><th>Employee / Role</th>';
    courses.forEach(course => {
        headerHtml += `<th>${course.title}</th>`;
    });
    headerHtml += '</tr></thead>';

    // Body Rows
    let bodyHtml = '<tbody>';
    employees.forEach(employee => {
        bodyHtml += `<tr><td><b>${employee.name}</b><br><small>${employee.role}</small></td>`;
        courses.forEach(course => {
            const record = trainingRecords.find(r => r.employeeId === employee.id && r.courseId === course.id);
            let statusClass = 'matrix-pending';
            if (record) {
                 switch (record.status) {
                    case 'completed': statusClass = 'matrix-completed'; break;
                    case 'in-progress': statusClass = 'matrix-in-progress'; break;
                 }
            }

            bodyHtml += `<td><div class="matrix-status ${statusClass}" title="${record ? getStatusText(record.status) : 'Pending'}"></div></td>`;
        });
        bodyHtml += '</tr>';
    });
    bodyHtml += '</tbody>';

    return headerHtml + bodyHtml;
}


/**
 * Placeholder for assigning new training
 */
function assignTraining() {
    showNotification('Opening training assignment form...', 'info');
    // A modal or new view would be rendered here in a real app.
}

/**
 * Placeholder for viewing training record details
 */
function viewTrainingRecordDetails(employeeId, courseId) {
    const record = trainingRecords.find(r => r.employeeId === employeeId && r.courseId === courseId);
    showNotification(`Showing details for training record...`, 'info');
    // A modal with detailed information would appear here.
}

// Utility function to get display-friendly status text
function getStatusText(status) {
    return status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}