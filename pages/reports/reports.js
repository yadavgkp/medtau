/**
 * Reports Module for Taube Med QMS
 * Handles generation and display of system reports.
 */

// We will use a third-party charting library like Chart.js
// Make sure to include it in your main HTML file:
// <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

let currentChart = null;


/**
 * Initialize Reports module
 */
async function initializeReports(preloadMode = false) {
    console.log('Initializing Reports module...');
    if (preloadMode) return;
    renderReportsPage();
    console.log('Reports module initialized successfully');
}


/**
 * Render the main reports page
 */
function renderReportsPage() {
    const content = document.getElementById('mainContent');
    if (!content) return;

    content.innerHTML = `
    <div class="page active">
        <div class="reports-header">
            <h1>Report Center</h1>
            <p>Generate and view insightful reports from QMS data.</p>
        </div>

        <div class="page-header">
            <h2 class="page-title"><i class="fas fa-chart-pie"></i> Report Generator</h2>
        </div>

        <div class="report-generator-container">
            <div class="report-form-grid">
                <div class="form-group">
                    <label class="form-label">Report Type</label>
                    <select class="form-input" id="reportType">
                        <option value="capa_status">CAPA Status Overview</option>
                        <option value="training_compliance">Training Compliance</option>
                        <option value="document_status">Document Status by Folder</option>
                    </select>
                </div>
                 <div class="form-group">
                    <label class="form-label">Date Range</label>
                    <input type="date" class="form-input" id="reportStartDate">
                    <input type="date" class="form-input" id="reportEndDate" style="margin-top: 0.5rem;">
                </div>
                <div class="form-group">
                    <label class="form-label">Output Format</label>
                    <select class="form-input" id="reportFormat">
                        <option value="chart">On-screen Chart</option>
                        <option value="pdf">PDF</option>
                        <option value="csv">CSV</option>
                    </select>
                </div>
            </div>
             <div style="text-align: right; margin-top: 1.5rem;">
                <button class="btn btn-primary" onclick="generateReport()">
                    <i class="fas fa-play-circle"></i> Generate Report
                </button>
            </div>
        </div>

        <div class="report-display-area" id="reportDisplayArea">
            <h3 class="report-title" id="reportTitle"></h3>
            <div class="chart-container">
                 <canvas id="reportChart"></canvas>
            </div>
        </div>
    </div>
    `;
}


/**
 * Generate a report based on form selections
 */
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const format = document.getElementById('reportFormat').value;

    if (format !== 'chart') {
        showNotification(`Generating ${format.toUpperCase()} report... This is a demo.`, 'success');
        return;
    }

    const displayArea = document.getElementById('reportDisplayArea');
    const reportTitleEl = document.getElementById('reportTitle');
    displayArea.style.display = 'block';

    let reportData;
    let chartType = 'bar'; // default

    switch (reportType) {
        case 'capa_status':
            reportTitleEl.innerText = 'CAPA Status Overview';
            reportData = getCapaStatusData();
            chartType = 'pie';
            break;
        case 'training_compliance':
            reportTitleEl.innerText = 'Training Compliance by Department';
            reportData = getTrainingComplianceData();
            chartType = 'bar';
            break;
        case 'document_status':
            reportTitleEl.innerText = 'Document Status by Folder';
            reportData = getDocumentStatusData();
            chartType = 'doughnut';
            break;
    }

    renderChart(reportData, chartType);
     displayArea.scrollIntoView({ behavior: 'smooth' });
}


/**
 * Render a chart using Chart.js
 */
function renderChart(data, chartType) {
    const ctx = document.getElementById('reportChart').getContext('2d');

    if (currentChart) {
        currentChart.destroy();
    }

    currentChart = new Chart(ctx, {
        type: chartType,
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: document.getElementById('reportTitle').innerText
                }
            }
        }
    });
}


/**
 * Mock data generation functions
 */

function getCapaStatusData() {
    return {
        labels: ['Planned', 'In Progress', 'Completed', 'Overdue'],
        datasets: [{
            label: 'CAPA Status',
            data: [5, 12, 35, 3], // Sample data
            backgroundColor: [
                'rgba(108, 117, 125, 0.7)',
                'rgba(255, 193, 7, 0.7)',
                'rgba(40, 167, 69, 0.7)',
                'rgba(220, 53, 69, 0.7)'
            ],
            borderColor: '#fff',
            borderWidth: 1
        }]
    };
}


function getTrainingComplianceData() {
    return {
        labels: ['Quality Assurance', 'R&D', 'Production', 'Regulatory'],
        datasets: [{
            label: 'Compliance %',
            data: [95, 88, 92, 98], // Sample data
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };
}

function getDocumentStatusData() {
    return {
        labels: ['Approved', 'In Review', 'Draft'],
        datasets: [{
            label: 'Document Status',
            data: [150, 25, 10], // Sample data
            backgroundColor: [
                'rgba(40, 167, 69, 0.7)',
                'rgba(255, 193, 7, 0.7)',
                'rgba(108, 117, 125, 0.7)'
            ],
            hoverOffset: 4
        }]
    };
}