/**
 * SearchHub - Main Application JavaScript
 * Integrates Tavily search with favorites and history features
 */

// API Endpoints
const API = {
    search: '/api/search',
    status: '/api/search/status',
    content: '/api/content',
    savedItems: '/api/saved-items',
    history: '/api/history'
};

// State
let currentResults = [];
let savedUrls = new Set();

// DOM Elements
const elements = {
    searchForm: document.getElementById('searchForm'),
    searchQuery: document.getElementById('searchQuery'),
    searchType: document.getElementById('searchType'),
    loadingState: document.getElementById('loadingState'),
    resultsSection: document.getElementById('resultsSection'),
    resultsGrid: document.getElementById('resultsGrid'),
    resultsTitle: document.getElementById('resultsTitle'),
    resultsCount: document.getElementById('resultsCount'),
    emptyState: document.getElementById('emptyState'),
    clearResults: document.getElementById('clearResults'),
    apiStatus: document.getElementById('apiStatus'),
    contentModal: document.getElementById('contentModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalMeta: document.getElementById('modalMeta'),
    modalBody: document.getElementById('modalBody'),
    closeModal: document.getElementById('closeModal'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalSaveBtn: document.getElementById('modalSaveBtn'),
    toastContainer: document.getElementById('toastContainer')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    // Check API status
    checkApiStatus();
    
    // Load saved URLs for quick checking
    await loadSavedUrls();
    
    // Setup event listeners
    setupEventListeners();
    
    // Check for URL parameters (for re-running searches from history)
    checkUrlParams();
}

function setupEventListeners() {
    // Search form submission
    elements.searchForm.addEventListener('submit', handleSearch);
    
    // Quick tags
    document.querySelectorAll('.quick-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            elements.searchQuery.value = tag.dataset.query;
            elements.searchForm.dispatchEvent(new Event('submit'));
        });
    });
    
    // Clear results
    elements.clearResults.addEventListener('click', clearResults);
    
    // Modal close buttons
    elements.closeModal.addEventListener('click', closeContentModal);
    elements.modalCloseBtn.addEventListener('click', closeContentModal);
    elements.contentModal.querySelector('.modal-backdrop').addEventListener('click', closeContentModal);
    
    // Modal save button
    elements.modalSaveBtn.addEventListener('click', saveCurrentContent);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeContentModal();
        if (e.key === '/' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            elements.searchQuery.focus();
        }
    });
}

function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    const type = params.get('type');
    
    if (query) {
        elements.searchQuery.value = query;
        if (type) elements.searchType.value = type;
        handleSearch(new Event('submit'));
    }
}

// ============================================
// API Status
// ============================================

async function checkApiStatus() {
    const statusDot = elements.apiStatus.querySelector('.status-dot');
    const statusText = elements.apiStatus.querySelector('.status-text');
    
    try {
        const response = await fetch(API.status);
        const data = await response.json();
        
        if (data.healthy) {
            statusDot.className = 'status-dot online';
            statusText.textContent = 'API Online';
        } else {
            statusDot.className = 'status-dot offline';
            statusText.textContent = 'API Issues';
        }
    } catch (error) {
        statusDot.className = 'status-dot offline';
        statusText.textContent = 'API Offline';
    }
}

// ============================================
// Search Functionality
// ============================================

async function handleSearch(e) {
    e.preventDefault();
    
    const query = elements.searchQuery.value.trim();
    const searchType = elements.searchType.value;
    
    if (!query) {
        showToast('Please enter a search query', 'error');
        return;
    }
    
    // Show loading state
    showLoading();
    
    try {
        const response = await fetch(API.search, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, searchType })
        });
        
        if (!response.ok) {
            throw new Error('Search failed');
        }
        
        const data = await response.json();
        currentResults = data.results || [];
        
        // Save to history
        await saveToHistory(query, searchType, currentResults.length);
        
        // Display results
        displayResults(data);
        
    } catch (error) {
        console.error('Search error:', error);
        showToast('Search failed. Please try again.', 'error');
        hideLoading();
    }
}

function displayResults(data) {
    hideLoading();
    
    if (!data.results || data.results.length === 0) {
        elements.resultsSection.classList.add('hidden');
        elements.emptyState.classList.remove('hidden');
        showToast('No results found', 'info');
        return;
    }
    
    elements.emptyState.classList.add('hidden');
    elements.resultsSection.classList.remove('hidden');
    
    // Update header
    elements.resultsTitle.textContent = `Results for "${data.query}"`;
    const cacheInfo = data.fromCache ? ' (cached)' : '';
    elements.resultsCount.textContent = `${data.resultCount} results found${cacheInfo}`;
    
    // Render result cards
    elements.resultsGrid.innerHTML = data.results.map((result, index) => 
        createResultCard(result, index)
    ).join('');
    
    // Add event listeners to cards
    setupResultCardListeners();
}

function createResultCard(result, index) {
    const isSaved = savedUrls.has(result.url);
    const domain = extractDomain(result.url);
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    // Use content as fallback for summary (Tavily API returns content field)
    const summaryText = result.summary || result.content || 'No description available';
    
    return `
        <article class="result-card" data-index="${index}">
            <div class="result-card__header">
                <div class="result-card__favicon">
                    <img src="${faviconUrl}" alt="" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌐</text></svg>'">
                </div>
                <h3 class="result-card__title">${escapeHtml(result.title || 'Untitled')}</h3>
            </div>
            <a href="${result.url}" target="_blank" class="result-card__url" onclick="event.stopPropagation()">
                ${escapeHtml(result.url)}
            </a>
            <p class="result-card__summary">${escapeHtml(summaryText)}</p>
            <div class="result-card__actions">
                <button class="result-card__btn result-card__btn--view" data-index="${index}">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="result-card__btn result-card__btn--save ${isSaved ? 'result-card__btn--saved' : ''}" 
                        data-index="${index}" ${isSaved ? 'disabled' : ''}>
                    <i class="fas fa-bookmark"></i> ${isSaved ? 'Saved' : 'Save'}
                </button>
            </div>
        </article>
    `;
}

function setupResultCardListeners() {
    // View buttons
    document.querySelectorAll('.result-card__btn--view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            openContentModal(currentResults[index]);
        });
    });
    
    // Save buttons
    document.querySelectorAll('.result-card__btn--save:not([disabled])').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            saveResult(currentResults[index], btn);
        });
    });
    
    // Card click (opens URL)
    document.querySelectorAll('.result-card').forEach(card => {
        card.addEventListener('click', () => {
            const index = parseInt(card.dataset.index);
            window.open(currentResults[index].url, '_blank');
        });
    });
}

function clearResults() {
    currentResults = [];
    elements.resultsSection.classList.add('hidden');
    elements.emptyState.classList.remove('hidden');
    elements.searchQuery.value = '';
    elements.searchQuery.focus();
}

// ============================================
// Content Modal
// ============================================

let currentModalContent = null;

async function openContentModal(result) {
    currentModalContent = result;
    
    elements.modalTitle.textContent = result.title || 'Loading...';
    elements.modalMeta.innerHTML = `
        <span><i class="fas fa-link"></i> ${extractDomain(result.url)}</span>
    `;
    elements.modalBody.innerHTML = `
        <div class="modal-loading">
            <div class="spinner-ring"></div>
            <p>Loading content...</p>
        </div>
    `;
    
    // Update save button state
    const isSaved = savedUrls.has(result.url);
    elements.modalSaveBtn.disabled = isSaved;
    elements.modalSaveBtn.innerHTML = isSaved 
        ? '<i class="fas fa-check"></i> Saved' 
        : '<i class="fas fa-bookmark"></i> Save to Favorites';
    
    elements.contentModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Fetch full content
    try {
        const response = await fetch(`${API.content}?url=${encodeURIComponent(result.url)}`);
        const data = await response.json();
        
        elements.modalTitle.textContent = data.title || result.title;
        elements.modalMeta.innerHTML = `
            <span><i class="fas fa-link"></i> ${extractDomain(result.url)}</span>
            <span><i class="fas fa-file-word"></i> ${data.wordCount || 0} words</span>
            ${data.cached ? '<span><i class="fas fa-database"></i> Cached</span>' : ''}
        `;
        
        // Display content with proper formatting
        const content = data.body || result.summary || 'No content available';
        elements.modalBody.innerHTML = `<div class="content-text">${formatContent(content)}</div>`;
        
    } catch (error) {
        console.error('Error loading content:', error);
        elements.modalBody.innerHTML = `
            <div class="content-text">
                <p>${result.summary || 'Unable to load full content.'}</p>
                <p><a href="${result.url}" target="_blank">Open in new tab →</a></p>
            </div>
        `;
    }
}

function closeContentModal() {
    elements.contentModal.classList.add('hidden');
    document.body.style.overflow = '';
    currentModalContent = null;
}

async function saveCurrentContent() {
    if (!currentModalContent) return;
    
    const btn = elements.modalSaveBtn;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    
    try {
        await saveResult(currentModalContent);
        btn.innerHTML = '<i class="fas fa-check"></i> Saved';
    } catch (error) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-bookmark"></i> Save to Favorites';
    }
}

function formatContent(text) {
    // Split into paragraphs and format
    return text.split(/\n\n+/).map(p => `<p>${escapeHtml(p.trim())}</p>`).join('');
}

// ============================================
// Save Functionality
// ============================================

async function loadSavedUrls() {
    try {
        const response = await fetch(API.savedItems);
        const items = await response.json();
        savedUrls = new Set(items.map(item => item.url));
    } catch (error) {
        console.error('Error loading saved items:', error);
    }
}

async function saveResult(result, buttonElement = null) {
    try {
        // Use content as fallback for summary (Tavily API returns content field)
        const summaryText = result.summary || result.content || '';
        
        console.log('Saving item:', { title: result.title, url: result.url, summary: summaryText });
        
        const response = await fetch(API.savedItems, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: result.title,
                url: result.url,
                summary: summaryText
            })
        });
        
        console.log('Save response status:', response.status);
        
        if (response.ok) {
            savedUrls.add(result.url);
            showToast('Saved to favorites!', 'success');
            
            // Update button if provided
            if (buttonElement) {
                buttonElement.classList.add('result-card__btn--saved');
                buttonElement.disabled = true;
                buttonElement.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
            }
        } else {
            const error = await response.json();
            console.error('Save error response:', error);
            throw new Error(error.error || 'Failed to save');
        }
    } catch (error) {
        console.error('Error saving item:', error);
        showToast(error.message || 'Failed to save item', 'error');
        throw error;
    }
}

// ============================================
// History Functionality
// ============================================

async function saveToHistory(query, searchType, resultsCount) {
    try {
        console.log('Saving to history:', { query, searchType, resultsCount });
        
        const response = await fetch(API.history, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, searchType, resultsCount })
        });
        
        console.log('History save response status:', response.status);
        
        if (!response.ok) {
            const error = await response.json();
            console.error('History save error:', error);
        }
    } catch (error) {
        console.error('Error saving to history:', error);
    }
}


// ============================================
// Utility Functions
// ============================================

function showLoading() {
    elements.loadingState.classList.remove('hidden');
    elements.resultsSection.classList.add('hidden');
    elements.emptyState.classList.add('hidden');
}

function hideLoading() {
    elements.loadingState.classList.add('hidden');
}

function showToast(message, type = 'info') {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span class="toast-message">${escapeHtml(message)}</span>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function extractDomain(url) {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return url;
    }
}
