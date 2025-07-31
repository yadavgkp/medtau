/**
 * Documents Module for Taube Med QMS
 * Handles document management, version control, and viewing.
 */

// State
let documents = [];
let folders = [];
let currentFolder = 'root';
let currentDocument = null;

// Sample Data
const SAMPLE_FOLDERS = [
    { id: 'root', name: 'Document Control', parent: null },
    { id: 'F01', name: 'Quality Manual', parent: 'root' },
    { id: 'F02', name: 'Procedures', parent: 'root' },
    { id: 'F03', name: 'Work Instructions', parent: 'root' },
    { id: 'F04', name: 'Forms and Templates', parent: 'root' },
];

const SAMPLE_DOCUMENTS = [
    { id: 'D001', folderId: 'F01', title: 'Quality Policy', version: '1.2', status: 'approved', lastModified: '2024-01-20', type: 'pdf' },
    { id: 'D002', folderId: 'F02', title: 'SOP-001: Document Control Procedure', version: '2.5', status: 'approved', lastModified: '2024-02-10', type: 'word' },
    { id: 'D003', folderId: 'F02', title: 'SOP-002: Change Control Procedure', version: '2.1', status: 'in-review', lastModified: '2024-03-01', type: 'word' },
    { id: 'D004', folderId: 'F03', title: 'WI-001: Equipment Calibration', version: '1.0', status: 'approved', lastModified: '2023-12-15', type: 'pdf' },
    { id: 'D005', folderId: 'F04', title: 'FRM-001: Change Request Form', version: '1.3', status: 'approved', lastModified: '2024-02-15', type: 'excel' },
];


/**
 * Initialize Documents module
 */
async function initializeDocuments(preloadMode = false) {
    console.log('Initializing Documents module...');

    if (preloadMode) {
        return { documents, folders };
    }

    await loadDocumentsData();
    renderDocumentsPage();

    console.log('Documents module initialized successfully');
}

/**
 * Load documents data
 */
async function loadDocumentsData() {
    try {
        // In a real application, this would fetch from an API
        documents = SAMPLE_DOCUMENTS;
        folders = SAMPLE_FOLDERS;
    } catch (error) {
        console.error('Error loading documents data:', error);
        showNotification('Error loading documents data', 'error');
    }
}


/**
 * Render the main documents page
 */
function renderDocumentsPage() {
    const content = document.getElementById('mainContent');
    if (!content) return;

    content.innerHTML = `
    <div class="page active">
        <div class="documents-header">
            <h1>Document Control Center</h1>
            <p>Securely manage all controlled documents and records.</p>
        </div>

        <div class="page-header">
            <h2 class="page-title"><i class="fas fa-folder-open"></i> Document Library</h2>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="uploadNewDocument()">
                    <i class="fas fa-upload"></i> Upload Document
                </button>
            </div>
        </div>

        <div class="document-library-container">
            <div class="folder-tree">
                ${renderFolderTree()}
            </div>

            <div class="document-list-container">
                <div class="document-card-list" id="documentList">
                   ${renderDocumentList(currentFolder)}
                </div>
                <div class="document-viewer" id="documentViewer">
                    </div>
            </div>
        </div>
    </div>
    `;

    setActiveFolder(currentFolder);
}


/**
 * Render the folder tree
 */
function renderFolderTree() {
    const rootFolders = folders.filter(f => f.parent === 'root');
    let treeHtml = '<ul>';
    rootFolders.forEach(folder => {
        treeHtml += `
            <li class="folder" id="folder-${folder.id}" onclick="selectFolder('${folder.id}')">
                <i class="fas fa-folder"></i> ${folder.name}
            </li>
        `;
    });
    treeHtml += '</ul>';
    return treeHtml;
}

/**
 * Render the list of documents for the current folder
 */
function renderDocumentList(folderId) {
    const docsInFolder = documents.filter(d => d.folderId === folderId);
    if(docsInFolder.length === 0) {
        return `<p style="text-align:center; color: var(--gray); padding: 2rem;">This folder is empty.</p>`;
    }

    return docsInFolder.map(doc => {
         const icon = getFileIcon(doc.type);
         return `
            <div class="document-item">
                <div class="document-icon-list"><i class="fas ${icon}"></i></div>
                <div class="document-info-list">
                    <h4>${doc.title}</h4>
                    <div class="document-meta-list">
                        Version: ${doc.version} | Status: <span class="status-badge status-${doc.status}">${getStatusText(doc.status)}</span> | Modified: ${doc.lastModified}
                    </div>
                </div>
                <div class="document-actions-list">
                    <button class="btn btn-secondary btn-sm" onclick="viewDocument('${doc.id}')"><i class="fas fa-eye"></i> View</button>
                    <button class="btn btn-secondary btn-sm" onclick="downloadDocument('${doc.id}')"><i class="fas fa-download"></i> Download</button>
                </div>
            </div>
         `;
    }).join('');
}

/**
 * Handle folder selection
 */
function selectFolder(folderId) {
    currentFolder = folderId;
    document.getElementById('documentList').innerHTML = renderDocumentList(folderId);
    setActiveFolder(folderId);
    // Hide viewer when changing folders
    document.getElementById('documentViewer').style.display = 'none';
}

/**
 * Set the active folder in the tree
 */
function setActiveFolder(folderId) {
    document.querySelectorAll('.folder-tree .folder').forEach(f => f.classList.remove('active'));
    document.getElementById(`folder-${folderId}`).classList.add('active');
}


/**
 * View a document
 */
function viewDocument(docId) {
    currentDocument = documents.find(d => d.id === docId);
    if (!currentDocument) return;

    const viewer = document.getElementById('documentViewer');
    viewer.innerHTML = `
        <div class="document-viewer-header">
            <h2>${currentDocument.title}</h2>
            <p>Version: ${currentDocument.version} | Status: ${currentDocument.status}</p>
        </div>
        <div class="document-viewer-content">
            <p>This is a placeholder for the document content viewer. In a real application, this area would render the PDF, Word, or other document format.</p>
            <br>
            <p><strong>Content for ${currentDocument.title} would be displayed here.</strong></p>
            <br>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue.</p>
        </div>
    `;
    viewer.style.display = 'block';
}


/**
 * Get file type icon
 */
function getFileIcon(type) {
    const iconMap = { 'pdf': 'fa-file-pdf', 'word': 'fa-file-word', 'excel': 'fa-file-excel', 'powerpoint': 'fa-file-powerpoint' };
    return iconMap[type] || 'fa-file-alt';
}


// Utility function
function getStatusText(status) {
    return status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}


// Placeholders for actions
function uploadNewDocument() {
    showNotification('Opening document upload form...', 'info');
}
function downloadDocument(docId) {
    showNotification(`Preparing download for document ${docId}...`, 'success');
}