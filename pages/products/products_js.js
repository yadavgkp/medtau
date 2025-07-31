/**
 * Products Module for Taube Med QMS
 * Handles product-centric management including documents, training, SOPs, and progress tracking
 */

// Products state
let products = [];
let currentProduct = null;
let currentTab = 'overview';

// Sample products data
const SAMPLE_PRODUCTS = [
  {
    id: 'TM-001',
    name: 'CardioMonitor Pro',
    code: 'CMP-2024',
    status: 'active',
    icon: 'fa-heartbeat',
    description: 'Advanced cardiac monitoring device with real-time analytics and cloud connectivity for healthcare facilities.',
    progress: 100,
    documents: 45,
    training: 12,
    sops: 8,
    teamMembers: 15,
    lastUpdate: '2024-02-28',
    riskLevel: 'Medium',
    regulatoryStatus: 'CE Marked',
    launchDate: '2023-06-15',
    documents_list: [
      {
        id: 'DOC-001',
        name: 'Design History File',
        type: 'Technical File',
        version: '3.2',
        status: 'approved',
        lastUpdate: '2024-02-15',
        owner: 'R&D Team',
        icon: 'fa-file-alt'
      },
      {
        id: 'DOC-002',
        name: 'Risk Management File',
        type: 'Risk Analysis',
        version: '2.1',
        status: 'approved',
        lastUpdate: '2024-02-10',
        owner: 'Quality Team',
        icon: 'fa-exclamation-triangle'
      },
      {
        id: 'DOC-003',
        name: 'Clinical Evaluation Report',
        type: 'Clinical Data',
        version: '1.5',
        status: 'in-review',
        lastUpdate: '2024-02-20',
        owner: 'Clinical Affairs',
        icon: 'fa-clipboard-check'
      },
      {
        id: 'DOC-004',
        name: 'User Manual',
        type: 'User Documentation',
        version: '4.0',
        status: 'approved',
        lastUpdate: '2024-02-25',
        owner: 'Technical Writing',
        icon: 'fa-book'
      },
      {
        id: 'DOC-005',
        name: 'Installation Guide',
        type: 'User Documentation',
        version: '2.8',
        status: 'approved',
        lastUpdate: '2024-02-22',
        owner: 'Technical Writing',
        icon: 'fa-wrench'
      }
    ],
    training_list: [
      {
        id: 'TRN-001',
        title: 'Product Overview Training',
        assignees: ['All Staff'],
        status: 'completed',
        completion: 95,
        type: 'General',
        duration: '2 hours'
      },
      {
        id: 'TRN-002',
        title: 'Technical Specifications',
        assignees: ['R&D Team', 'Quality Team'],
        status: 'completed',
        completion: 100,
        type: 'Technical',
        duration: '4 hours'
      },
      {
        id: 'TRN-003',
        title: 'Regulatory Requirements',
        assignees: ['Regulatory Affairs'],
        status: 'progress',
        completion: 75,
        type: 'Regulatory',
        duration: '3 hours'
      },
      {
        id: 'TRN-004',
        title: 'Manufacturing Process',
        assignees: ['Production Team'],
        status: 'completed',
        completion: 90,
        type: 'Manufacturing',
        duration: '6 hours'
      }
    ],
    sops_list: [
      {
        id: 'SOP-CMP-001',
        title: 'Manufacturing Process',
        version: '2.3',
        lastUpdate: '2024-02-01',
        status: 'approved',
        category: 'Manufacturing'
      },
      {
        id: 'SOP-CMP-002',
        title: 'Quality Control Testing',
        version: '1.8',
        lastUpdate: '2024-01-28',
        status: 'approved',
        category: 'Quality'
      },
      {
        id: 'SOP-CMP-003',
        title: 'Packaging and Labeling',
        version: '3.1',
        lastUpdate: '2024-02-05',
        status: 'approved',
        category: 'Manufacturing'
      },
      {
        id: 'SOP-CMP-004',
        title: 'Post-Market Surveillance',
        version: '1.2',
        lastUpdate: '2024-01-15',
        status: 'in-review',
        category: 'Quality'
      }
    ],
    timeline: [
      {
        date: '2024-02-28',
        title: 'Manufacturing Batch #2024-Q1 Completed',
        description: '500 units successfully manufactured and tested',
        type: 'milestone'
      },
      {
        date: '2024-02-15',
        title: 'Design History File Updated',
        description: 'Version 3.2 approved with latest design changes',
        type: 'document'
      },
      {
        date: '2024-02-01',
        title: 'Regulatory Submission',
        description: 'Annual surveillance report submitted to notified body',
        type: 'regulatory'
      }
    ],
    milestones: [
      {
        title: 'Design Phase',
        status: 'completed',
        date: '2023-03-15',
        description: 'Product design and specifications finalized'
      },
      {
        title: 'Prototype Testing',
        status: 'completed',
        date: '2023-05-20',
        description: 'Functional prototypes tested and validated'
      },
      {
        title: 'Regulatory Approval',
        status: 'completed',
        date: '2023-06-10',
        description: 'CE marking obtained for European market'
      },
      {
        title: 'Market Launch',
        status: 'completed',
        date: '2023-06-15',
        description: 'Product successfully launched to market'
      }
    ]
  },
  {
    id: 'TM-002',
    name: 'DiagnosticPro X1',
    code: 'DPX-2024',
    status: 'development',
    icon: 'fa-microscope',
    description: 'Portable diagnostic platform with AI-powered analysis for point-of-care testing and rapid results.',
    progress: 75,
    documents: 32,
    training: 8,
    sops: 5,
    teamMembers: 22,
    lastUpdate: '2024-03-01',
    riskLevel: 'High',
    regulatoryStatus: 'In Development',
    expectedLaunch: '2024-12-01',
    documents_list: [
      {
        id: 'DOC-006',
        name: 'Product Requirements Document',
        type: 'Requirements',
        version: '2.0',
        status: 'approved',
        lastUpdate: '2024-02-28',
        owner: 'Product Management',
        icon: 'fa-clipboard-list'
      },
      {
        id: 'DOC-007',
        name: 'Design Specification',
        type: 'Technical Specification',
        version: '1.3',
        status: 'in-review',
        lastUpdate: '2024-03-01',
        owner: 'R&D Team',
        icon: 'fa-drafting-compass'
      }
    ],
    training_list: [
      {
        id: 'TRN-005',
        title: 'AI Algorithm Training',
        assignees: ['R&D Team', 'Software Team'],
        status: 'progress',
        completion: 60,
        type: 'Technical',
        duration: '8 hours'
      },
      {
        id: 'TRN-006',
        title: 'Regulatory Pathway',
        assignees: ['Regulatory Affairs'],
        status: 'progress',
        completion: 40,
        type: 'Regulatory',
        duration: '4 hours'
      }
    ],
    sops_list: [
      {
        id: 'SOP-DPX-001',
        title: 'Software Development Process',
        version: '1.0',
        lastUpdate: '2024-02-20',
        status: 'draft',
        category: 'Development'
      }
    ],
    timeline: [
      {
        date: '2024-03-01',
        title: 'Algorithm Milestone Achieved',
        description: '85% accuracy reached in clinical validation',
        type: 'milestone'
      },
      {
        date: '2024-02-20',
        title: 'Prototype Testing Started',
        description: 'First functional prototype in clinical environment',
        type: 'testing'
      }
    ],
    milestones: [
      {
        title: 'Concept Development',
        status: 'completed',
        date: '2023-09-15',
        description: 'AI diagnostic concept validated'
      },
      {
        title: 'Algorithm Development',
        status: 'in-progress',
        date: '2024-06-30',
        description: 'AI algorithms in development and testing'
      },
      {
        title: 'Clinical Validation',
        status: 'pending',
        date: '2024-09-30',
        description: 'Clinical trials and validation studies'
      },
      {
        title: 'Regulatory Submission',
        status: 'pending',
        date: '2024-11-15',
        description: 'Submit for regulatory approval'
      }
    ]
  },
  {
    id: 'TM-003',
    name: 'VitalSense Monitor',
    code: 'VSM-2024',
    status: 'testing',
    icon: 'fa-chart-line',
    description: 'Multi-parameter vital signs monitoring system with predictive analytics and emergency alerting capabilities.',
    progress: 45,
    documents: 28,
    training: 6,
    sops: 4,
    teamMembers: 18,
    lastUpdate: '2024-02-25',
    riskLevel: 'Medium',
    regulatoryStatus: 'Pre-Submission',
    expectedLaunch: '2025-03-01',
    documents_list: [
      {
        id: 'DOC-008',
        name: 'Risk Management Plan',
        type: 'Risk Analysis',
        version: '1.0',
        status: 'draft',
        lastUpdate: '2024-02-25',
        owner: 'Quality Team',
        icon: 'fa-shield-alt'
      }
    ],
    training_list: [
      {
        id: 'TRN-007',
        title: 'System Architecture',
        assignees: ['R&D Team'],
        status: 'progress',
        completion: 30,
        type: 'Technical',
        duration: '6 hours'
      }
    ],
    sops_list: [
      {
        id: 'SOP-VSM-001',
        title: 'Testing Protocol',
        version: '0.9',
        lastUpdate: '2024-02-22',
        status: 'draft',
        category: 'Testing'
      }
    ],
    timeline: [
      {
        date: '2024-02-25',
        title: 'Testing Phase Initiated',
        description: 'Comprehensive testing protocol started',
        type: 'testing'
      }
    ],
    milestones: [
      {
        title: 'Design Specification',
        status: 'completed',
        date: '2024-01-15',
        description: 'Technical specifications completed'
      },
      {
        title: 'Prototype Development',
        status: 'in-progress',
        date: '2024-05-30',
        description: 'Hardware and software prototype development'
      },
      {
        title: 'Integration Testing',
        status: 'pending',
        date: '2024-08-30',
        description: 'System integration and testing phase'
      },
      {
        title: 'Clinical Validation',
        status: 'pending',
        date: '2024-12-30',
        description: 'Clinical validation and regulatory preparation'
      }
    ]
  }
];

/**
 * Initialize Products module
 */
async function initializeProducts(preloadMode = false) {
  console.log('Initializing Products module...');
  
  if (preloadMode) {
    return SAMPLE_PRODUCTS;
  }
  
  // Load products data
  await loadProductsData();
  
  // Render products overview
  renderProductsOverview();
  
  console.log('Products module initialized successfully');
}

/**
 * Load products data
 */
async function loadProductsData() {
  try {
    // In a real application, this would fetch from an API
    products = SAMPLE_PRODUCTS;
    
    // Simulate API call
    // const response = await APIUtils.get('/api/products');
    // products = response.data;
    
  } catch (error) {
    console.error('Error loading products data:', error);
    showNotification('Error loading products data', 'error');
    products = SAMPLE_PRODUCTS; // Fallback
  }
}

/**
 * Render products overview page
 */
function renderProductsOverview() {
  const content = document.getElementById('mainContent');
  if (!content) return;
  
  content.innerHTML = `
    <div class="page active">
      <div class="products-overview">
        <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">
          <i class="fas fa-cube"></i>
          Product Portfolio
        </h1>
        <p style="font-size: 1.1rem; opacity: 0.9;">
          Manage your medical devices with comprehensive documentation, training, and quality oversight
        </p>
      </div>

      <div class="page-header">
        <h2 class="page-title">
          <i class="fas fa-th-large"></i>
          All Products
        </h2>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="addNewProduct()">
            <i class="fas fa-plus"></i>
            Add Product
          </button>
          <button class="btn btn-secondary" onclick="exportProductData()">
            <i class="fas fa-download"></i>
            Export Data
          </button>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="products-grid" id="productsGrid">
        ${renderProductsGrid()}
      </div>

      <!-- Product Pipeline Overview -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">
            <i class="fas fa-chart-line"></i>
            Product Development Pipeline
          </h2>
        </div>
        <div class="pipeline-overview">
          <div class="pipeline-stages">
            <div class="pipeline-stage">
              <div class="stage-icon">
                <i class="fas fa-lightbulb"></i>
              </div>
              <h4 class="stage-title">Concept</h4>
              <p class="stage-count">3 Products</p>
              <p class="stage-description">Research & validation phase</p>
            </div>
            <div class="pipeline-stage">
              <div class="stage-icon" style="background: var(--secondary);">
                <i class="fas fa-drafting-compass"></i>
              </div>
              <h4 class="stage-title">Design</h4>
              <p class="stage-count">2 Products</p>
              <p class="stage-description">Development & prototyping</p>
            </div>
            <div class="pipeline-stage">
              <div class="stage-icon" style="background: var(--accent);">
                <i class="fas fa-flask"></i>
              </div>
              <h4 class="stage-title">Testing</h4>
              <p class="stage-count">1 Product</p>
              <p class="stage-description">Validation & verification</p>
            </div>
            <div class="pipeline-stage">
              <div class="stage-icon" style="background: var(--success);">
                <i class="fas fa-rocket"></i>
              </div>
              <h4 class="stage-title">Launch</h4>
              <p class="stage-count">1 Product</p>
              <p class="stage-description">Market introduction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Animate progress bars
  setTimeout(() => {
    animateProductProgress();
  }, 100);
}

/**
 * Render products grid
 */
function renderProductsGrid() {
  return products.map(product => `
    <div class="product-card" onclick="viewProductDetail('${product.id}')">
      <div class="product-header">
        <div class="product-icon">
          <i class="fas ${product.icon}"></i>
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="product-code">${product.code}</div>
        </div>
      </div>
      
      <div class="product-description">${product.description}</div>
      
      <div class="product-status status-${product.status}">
        ${getStatusText(product.status)}
      </div>
      
      <div class="product-metrics">
        <div class="metric">
          <div class="metric-value">${product.documents}</div>
          <div class="metric-label">Documents</div>
        </div>
        <div class="metric">
          <div class="metric-value">${product.training}</div>
          <div class="metric-label">Training</div>
        </div>
        <div class="metric">
          <div class="metric-value">${product.sops}</div>
          <div class="metric-label">SOPs</div>
        </div>
      </div>
      
      <div class="product-progress">
        <div class="progress-label">
          <span>QMS Completion</span>
          <span>${product.progress}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 0%" data-width="${product.progress}%"></div>
        </div>
      </div>
      
      <div class="product-actions">
        <a href="#" class="product-action" onclick="event.stopPropagation(); viewDocuments('${product.id}')">
          <i class="fas fa-folder"></i> Docs
        </a>
        <a href="#" class="product-action" onclick="event.stopPropagation(); viewTraining('${product.id}')">
          <i class="fas fa-graduation-cap"></i> Training
        </a>
        <a href="#" class="product-action" onclick="event.stopPropagation(); viewSOPs('${product.id}')">
          <i class="fas fa-file-alt"></i> SOPs
        </a>
        <a href="#" class="product-action" onclick="event.stopPropagation(); viewProgress('${product.id}')">
          <i class="fas fa-chart-line"></i> Progress
        </a>
      </div>
    </div>
  `).join('');
}

/**
 * View product detail
 */
function viewProductDetail(productId) {
  currentProduct = products.find(p => p.id === productId);
  if (!currentProduct) {
    showNotification('Product not found', 'error');
    return;
  }
  
  renderProductDetail();
}

/**
 * Render product detail view
 */
function renderProductDetail() {
  const content = document.getElementById('mainContent');
  if (!content || !currentProduct) return;
  
  content.innerHTML = `
    <div class="page active product-detail">
      <!-- Product Header -->
      <div class="product-detail-header">
        <div class="product-detail-info">
          <div class="product-detail-icon">
            <i class="fas ${currentProduct.icon}"></i>
          </div>
          <div class="product-detail-text">
            <h1>${currentProduct.name}</h1>
            <div class="product-detail-meta">
              <span><i class="fas fa-barcode"></i> ${currentProduct.code}</span>
              <span><i class="fas fa-shield-alt"></i> ${currentProduct.regulatoryStatus}</span>
              <span><i class="fas fa-exclamation-triangle"></i> ${currentProduct.riskLevel} Risk</span>
              <span><i class="fas fa-users"></i> ${currentProduct.teamMembers} Team Members</span>
            </div>
          </div>
        </div>
        <div class="btn-group">
          <button class="btn btn-secondary" onclick="showProductsOverview()">
            <i class="fas fa-arrow-left"></i>
            Back to Products
          </button>
          <button class="btn btn-primary" onclick="editProduct('${currentProduct.id}')">
            <i class="fas fa-edit"></i>
            Edit Product
          </button>
        </div>
      </div>

      <!-- Product Tabs -->
      <div class="product-tabs">
        <button class="product-tab active" onclick="switchProductTab('overview')">
          <i class="fas fa-chart-pie"></i>
          Overview
        </button>
        <button class="product-tab" onclick="switchProductTab('documents')">
          <i class="fas fa-folder-open"></i>
          Documents (${currentProduct.documents_list?.length || 0})
        </button>
        <button class="product-tab" onclick="switchProductTab('training')">
          <i class="fas fa-graduation-cap"></i>
          Training (${currentProduct.training_list?.length || 0})
        </button>
        <button class="product-tab" onclick="switchProductTab('sops')">
          <i class="fas fa-file-alt"></i>
          SOPs (${currentProduct.sops_list?.length || 0})
        </button>
        <button class="product-tab" onclick="switchProductTab('progress')">
          <i class="fas fa-chart-line"></i>
          Progress & Timeline
        </button>
      </div>

      <!-- Tab Contents -->
      <div id="overviewTab" class="tab-content active">
        ${renderOverviewTab()}
      </div>

      <div id="documentsTab" class="tab-content">
        ${renderDocumentsTab()}
      </div>

      <div id="trainingTab" class="tab-content">
        ${renderTrainingTab()}
      </div>

      <div id="sopsTab" class="tab-content">
        ${renderSOPsTab()}
      </div>

      <div id="progressTab" class="tab-content">
        ${renderProgressTab()}
      </div>
    </div>
  `;
  
  currentTab = 'overview';
  
  // Animate elements
  setTimeout(() => {
    animateProductProgress();
  }, 100);
}

/**
 * Render overview tab
 */
function renderOverviewTab() {
  return `
    <div class="dashboard-grid">
      <!-- Progress Overview -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <i class="fas fa-chart-pie"></i>
            QMS Progress
          </h3>
        </div>
        <div class="progress-overview">
          <div class="progress-circle-large">
            <svg style="width: 100%; height: 100%;">
              <circle class="progress-bg" cx="75" cy="75" r="60" stroke-width="12"></circle>
              <circle class="progress-fill" cx="75" cy="75" r="60" stroke-width="12" data-progress="${currentProduct.progress}"></circle>
            </svg>
            <div class="progress-text" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.5rem; font-weight: 700;">${currentProduct.progress}%</div>
          </div>
          <p style="color: var(--gray); margin-top: 1rem; text-align: center;">
            Quality Management System implementation progress for ${currentProduct.name}
          </p>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <i class="fas fa-history"></i>
            Recent Activity
          </h3>
        </div>
        <div class="timeline">
          ${renderTimeline()}
        </div>
      </div>
    </div>

    <!-- Product Statistics -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon">
            <i class="fas fa-file-alt"></i>
          </div>
        </div>
        <div class="stat-value">${currentProduct.documents}</div>
        <div class="stat-label">Total Documents</div>
        <div class="stat-change positive">
          <i class="fas fa-plus"></i>
          3 added this month
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon" style="background: var(--success);">
            <i class="fas fa-graduation-cap"></i>
          </div>
        </div>
        <div class="stat-value">${currentProduct.training}</div>
        <div class="stat-label">Training Modules</div>
        <div class="stat-change positive">
          <i class="fas fa-check"></i>
          2 completed
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon" style="background: var(--warning);">
            <i class="fas fa-clipboard-list"></i>
          </div>
        </div>
        <div class="stat-value">${currentProduct.sops}</div>
        <div class="stat-label">Standard Operating Procedures</div>
        <div class="stat-change positive">
          <i class="fas fa-arrow-up"></i>
          1 updated
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon" style="background: var(--info);">
            <i class="fas fa-users"></i>
          </div>
        </div>
        <div class="stat-value">${currentProduct.teamMembers}</div>
        <div class="stat-label">Team Members</div>
        <div class="stat-change positive">
          <i class="fas fa-user-plus"></i>
          Active team
        </div>
      </div>
    </div>
  `;
}

/**
 * Render documents tab
 */
function renderDocumentsTab() {
  return `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-folder-open"></i>
          Product Documents
        </h3>
        <button class="btn btn-primary" onclick="addNewDocument('${currentProduct.id}')">
          <i class="fas fa-plus"></i>
          Add Document
        </button>
      </div>
      <div class="documents-grid">
        ${renderDocumentsList()}
      </div>
    </div>
  `;
}

/**
 * Render training tab
 */
function renderTrainingTab() {
  return `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-graduation-cap"></i>
          Product Training
        </h3>
        <button class="btn btn-primary" onclick="addNewTraining('${currentProduct.id}')">
          <i class="fas fa-plus"></i>
          Add Training
        </button>
      </div>
      <div class="training-sections">
        ${renderTrainingList()}
      </div>
    </div>
  `;
}

/**
 * Render SOPs tab
 */
function renderSOPsTab() {
  return `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-file-alt"></i>
          Standard Operating Procedures
        </h3>
        <button class="btn btn-primary" onclick="addNewSOP('${currentProduct.id}')">
          <i class="fas fa-plus"></i>
          Add SOP
        </button>
      </div>
      <div class="sops-grid">
        ${renderSOPsList()}
      </div>
    </div>
  `;
}

/**
 * Render progress tab
 */
function renderProgressTab() {
  return `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-chart-line"></i>
          Development Progress & Milestones
        </h3>
      </div>
      <div class="progress-milestones">
        ${renderMilestones()}
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-timeline"></i>
          Development Timeline
        </h3>
      </div>
      <div class="timeline">
        ${renderTimeline()}
      </div>
    </div>
  `;
}

/**
 * Helper rendering functions
 */
function renderDocumentsList() {
  if (!currentProduct.documents_list || currentProduct.documents_list.length === 0) {
    return '<p style="text-align: center; color: var(--gray); padding: 2rem;">No documents found</p>';
  }
  
  return currentProduct.documents_list.map(doc => `
    <div class="document-card">
      <div class="document-header">
        <div class="document-icon">
          <i class="fas ${doc.icon}"></i>
        </div>
        <div class="document-info">
          <h4>${doc.name}</h4>
          <div class="document-meta">
            ${doc.type} • Version ${doc.version} • ${doc.owner}
          </div>
          <div class="document-meta">
            Updated: ${window.utils?.DateUtils.formatDate(doc.lastUpdate, 'short') || doc.lastUpdate}
          </div>
        </div>
      </div>
      <div style="margin-top: 1rem;">
        <span class="status-badge status-${doc.status}">${getStatusText(doc.status)}</span>
      </div>
      <div class="document-actions">
        <button class="btn btn-secondary" onclick="viewDocument('${doc.id}')">
          <i class="fas fa-eye"></i>
          View
        </button>
        <button class="btn btn-secondary" onclick="editDocument('${doc.id}')">
          <i class="fas fa-edit"></i>
          Edit
        </button>
        <button class="btn btn-secondary" onclick="downloadDocument('${doc.id}')">
          <i class="fas fa-download"></i>
          Download
        </button>
      </div>
    </div>
  `).join('');
}

function renderTrainingList() {
  if (!currentProduct.training_list || currentProduct.training_list.length === 0) {
    return '<p style="text-align: center; color: var(--gray); padding: 2rem;">No training modules found</p>';
  }
  
  return `
    <div class="training-section">
      <div class="card-header">
        <h4 class="card-title">Training Modules</h4>
      </div>
      ${currentProduct.training_list.map(training => `
        <div class="training-item">
          <div class="training-status training-${training.status}"></div>
          <div class="training-content">
            <div class="training-title">${training.title}</div>
            <div class="training-assignee">
              ${training.assignees.join(', ')} • ${training.type} • ${training.duration}
            </div>
            <div class="progress-bar" style="margin-top: 0.5rem;">
              <div class="progress-fill" style="width: ${training.completion}%"></div>
            </div>
            <div style="font-size: 0.8rem; color: var(--gray); margin-top: 0.25rem;">
              ${training.completion}% Complete
            </div>
          </div>
          <button class="btn btn-secondary" onclick="viewTrainingDetails('${training.id}')">
            <i class="fas fa-eye"></i>
            View
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

function renderSOPsList() {
  if (!currentProduct.sops_list || currentProduct.sops_list.length === 0) {
    return '<p style="text-align: center; color: var(--gray); padding: 2rem;">No SOPs found</p>';
  }
  
  return currentProduct.sops_list.map(sop => `
    <div class="sop-card">
      <div class="sop-header">
        <div class="sop-title">${sop.title}</div>
        <div class="sop-version">v${sop.version}</div>
      </div>
      <div style="margin: 1rem 0;">
        <span class="status-badge status-${sop.status}">${getStatusText(sop.status)}</span>
        <span style="margin-left: 1rem; font-size: 0.8rem; color: var(--gray);">${sop.category}</span>
      </div>
      <div class="sop-meta">
        <div class="sop-last-update">
          Updated: ${window.utils?.DateUtils.formatDate(sop.lastUpdate, 'short') || sop.lastUpdate}
        </div>
        <div class="btn-group">
          <button class="btn btn-secondary" onclick="viewSOP('${sop.id}')">
            <i class="fas fa-eye"></i>
            View
          </button>
          <button class="btn btn-secondary" onclick="editSOP('${sop.id}')">
            <i class="fas fa-edit"></i>
            Edit
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderTimeline() {
  if (!currentProduct.timeline || currentProduct.timeline.length === 0) {
    return '<p style="text-align: center; color: var(--gray);">No recent activity</p>';
  }
  
  return currentProduct.timeline.map(item => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <div class="timeline-title">${item.title}</div>
        <div style="color: var(--gray); font-size: 0.9rem; margin: 0.5rem 0;">${item.description}</div>
        <div class="timeline-time">${window.utils?.DateUtils.formatDate(item.date, 'short') || item.date}</div>
      </div>
    </div>
  `).join('');
}

function renderMilestones() {
  if (!currentProduct.milestones || currentProduct.milestones.length === 0) {
    return '<p style="text-align: center; color: var(--gray);">No milestones defined</p>';
  }
  
  return currentProduct.milestones.map(milestone => `
    <div class="milestone-card ${milestone.status}">
      <div class="milestone-title">${milestone.title}</div>
      <div class="milestone-date">${window.utils?.DateUtils.formatDate(milestone.date, 'short') || milestone.date}</div>
      <div class="milestone-description" style="color: var(--gray); font-size: 0.9rem; margin-bottom: 1rem;">
        ${milestone.description}
      </div>
      <div class="milestone-status ${milestone.status}">
        <i class="fas ${milestone.status === 'completed' ? 'fa-check-circle' : milestone.status === 'in-progress' ? 'fa-clock' : 'fa-circle'}"></i>
        ${milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1).replace('-', ' ')}
      </div>
    </div>
  `).join('');
}

/**
 * Switch product tabs
 */
function switchProductTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.product-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Activate selected tab
  event.target.classList.add('active');
  document.getElementById(tabName + 'Tab').classList.add('active');
  
  currentTab = tabName;
  
  // Animate elements if needed
  if (tabName === 'overview' || tabName === 'progress') {
    setTimeout(() => {
      animateProductProgress();
    }, 100);
  }
}

/**
 * Utility functions
 */
function getStatusText(status) {
  const statusMap = {
    'active': 'Active',
    'development': 'In Development',
    'testing': 'Testing',
    'planning': 'Planning',
    'approved': 'Approved',
    'in-review': 'Under Review',
    'draft': 'Draft',
    'completed': 'Completed',
    'progress': 'In Progress',
    'pending': 'Pending'
  };
  return statusMap[status] || status;
}

function animateProductProgress() {
  if (window.TaubeMedQMS?.animateProgressBars) {
    window.TaubeMedQMS.animateProgressBars();
  }
  
  if (window.TaubeMedQMS?.animateProgressCircles) {
    window.TaubeMedQMS.animateProgressCircles();
  }
}

function showProductsOverview() {
  renderProductsOverview();
}

// Action handlers
function addNewProduct() {
  showNotification('Opening new product form...', 'info');
}

function exportProductData() {
  showNotification('Exporting product data...', 'info');
  setTimeout(() => {
    showNotification('Product data exported successfully!', 'success');
  }, 2000);
}

function editProduct(productId) {
  showNotification(`Opening editor for product: ${productId}`, 'info');
}

function viewDocuments(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    viewProductDetail(productId);
    setTimeout(() => switchProductTab('documents'), 100);
  }
}

function viewTraining(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    viewProductDetail(productId);
    setTimeout(() => switchProductTab('training'), 100);
  }
}

function viewSOPs(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    viewProductDetail(productId);
    setTimeout(() => switchProductTab('sops'), 100);
  }
}

function viewProgress(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    viewProductDetail(productId);
    setTimeout(() => switchProductTab('progress'), 100);
  }
}

function addNewDocument(productId) {
  showNotification('Opening new document form...', 'info');
}

function addNewTraining(productId) {
  showNotification('Opening new training form...', 'info');
}

function addNewSOP(productId) {
  showNotification('Opening new SOP form...', 'info');
}

function viewDocument(docId) {
  showNotification(`Viewing document: ${docId}`, 'info');
}

function editDocument(docId) {
  showNotification(`Editing document: ${docId}`, 'info');
}

function downloadDocument(docId) {
  showNotification(`Downloading document: ${docId}`, 'success');
}

function viewTrainingDetails(trainingId) {
  showNotification(`Viewing training: ${trainingId}`, 'info');
}

function viewSOP(sopId) {
  showNotification(`Viewing SOP: ${sopId}`, 'info');
}

function editSOP(sopId) {
  showNotification(`Editing SOP: ${sopId}`, 'info');
}

// Export products module
window.productsModule = {
  initializeProducts,
  loadProductsData,
  renderProductsOverview,
  viewProductDetail,
  switchProductTab
};

console.log('Products module loaded');