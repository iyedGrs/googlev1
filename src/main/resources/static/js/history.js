/**
 * SearchHub - Search History JavaScript
 * Manages search history tracking and display with beautiful confirmation modals
 */

const API_BASE = '/api/history';

// DOM Elements
const elements = {
    historySection: document.getElementById('historySection'),
    historyList: document.getElementById('historyList'),
    emptyState: document.getElementById('emptyState'),
    historyCount: document.getElementById('historyCount'),
    clearHistory: document.getElementById('clearHistory'),
    toastContainer: document.getElementById('toastContainer'),
    // Confirmation Modal
    confirmModal: document.getElementById('confirmModal'),
    confirmIcon: document.getElementById('confirmIcon'),
    confirmTitle: document.getElementById('confirmTitle'),
    confirmMessage: document.getElementById('confirmMessage'),
    confirmCancel: document.getElementById('confirmCancel'),
    confirmAction: document.getElementById('confirmAction')
};

// State for pending actions
let pendingAction = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    setupModalListeners();
    
    if (elements.clearHistory) {
        elements.clearHistory.addEventListener('click', () => showClearConfirmModal());
    }
});

// Setup modal event listeners
function setupModalListeners() {
    if (!elements.confirmModal) return;
    
    // Cancel button
    elements.confirmCancel.addEventListener('click', closeConfirmModal);
    
    // Backdrop click
    elements.confirmModal.querySelector('.confirm-modal__backdrop').addEventListener('click', closeConfirmModal);
    
    // Confirm action
    elements.confirmAction.addEventListener('click', () => {
        if (pendingAction === 'clearAll') {
            performClearHistory();
        }
        closeConfirmModal();
    });
    
    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.confirmModal.classList.contains('active')) {
            closeConfirmModal();
        }
    });
}

// Show clear all confirmation modal
function showClearConfirmModal() {
    pendingAction = 'clearAll';
    
    // Update modal content
    elements.confirmIcon.innerHTML = '<i class="fas fa-history"></i>';
    elements.confirmIcon.className = 'confirm-modal__icon confirm-modal__icon--warning';
    elements.confirmTitle.textContent = 'Clear All History?';
    elements.confirmMessage.innerHTML = `
        Are you sure you want to clear <strong>all your search history</strong>?
        <br><br>
        <span style="color: var(--text-muted); font-size: 0.875rem;">
            <i class="fas fa-exclamation-triangle"></i> This will permanently delete all your search records.
        </span>
    `;
    elements.confirmAction.innerHTML = '<i class="fas fa-trash-alt"></i> Clear All';
    elements.confirmAction.className = 'confirm-modal__btn confirm-modal__btn--confirm warning';
    
    // Show modal with animation
    elements.confirmModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add shake animation to icon
    setTimeout(() => {
        elements.confirmIcon.classList.add('shake');
        setTimeout(() => elements.confirmIcon.classList.remove('shake'), 500);
    }, 100);
}

// Close confirmation modal
function closeConfirmModal() {
    if (!elements.confirmModal) return;
    elements.confirmModal.classList.remove('active');
    document.body.style.overflow = '';
    pendingAction = null;
}

// Load history
async function loadHistory() {
    try {
        console.log('Loading history from:', API_BASE);
        const response = await fetch(API_BASE);
        console.log('History response status:', response.status);
        
        if (!response.ok) throw new Error('Failed to load');
        
        const items = await response.json();
        console.log('Loaded history items:', items);
        displayHistory(items);
    } catch (error) {
        console.error('Error loading history:', error);
        showToast('Failed to load history', 'error');
    }
}

// Display history items
function displayHistory(items) {
    // Update count
    if (elements.historyCount) {
        elements.historyCount.querySelector('span').textContent = `${items.length} search${items.length !== 1 ? 'es' : ''}`;
    }
    
    // Update clear button
    if (elements.clearHistory) {
        elements.clearHistory.disabled = items.length === 0;
    }
    
    if (items.length === 0) {
        if (elements.historySection) elements.historySection.classList.add('hidden');
        if (elements.emptyState) elements.emptyState.classList.remove('hidden');
        return;
    }
    
    if (elements.emptyState) elements.emptyState.classList.add('hidden');
    if (elements.historySection) elements.historySection.classList.remove('hidden');
    
    if (elements.historyList) {
        elements.historyList.innerHTML = items.map((item, index) => createHistoryItem(item, index)).join('');
        setupHistoryListeners();
    }
}

// Create history item HTML
function createHistoryItem(item, index) {
    const timeAgo = getTimeAgo(item.searchedAt);
    
    return `
        <div class="history-item" data-query="${escapeHtml(item.query)}" data-type="${item.searchType || 'general'}" style="animation-delay: ${index * 0.05}s">
            <div class="history-item__content">
                <div class="history-item__query">
                    <i class="fas fa-search"></i>
                    <span>${escapeHtml(item.query)}</span>
                </div>
                <div class="history-item__meta">
                    <span class="history-item__tag">
                        <i class="fas fa-tag"></i> ${item.searchType || 'general'}
                    </span>
                    <span class="history-item__results">
                        <i class="fas fa-list"></i> ${item.resultsCount ?? 0} results
                    </span>
                    <span class="history-item__time">
                        <i class="fas fa-clock"></i> ${timeAgo}
                    </span>
                </div>
            </div>
            <div class="history-item__actions">
                <button class="btn btn-sm btn-primary rerun-btn">
                    <i class="fas fa-redo"></i> Re-run
                </button>
            </div>
        </div>
    `;
}

// Setup event listeners
function setupHistoryListeners() {
    document.querySelectorAll('.rerun-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = e.target.closest('.history-item');
            const query = item.dataset.query;
            const type = item.dataset.type;
            
            const url = new URL(window.location.origin + '/');
            url.searchParams.set('q', query);
            if (type) url.searchParams.set('type', type);
            window.location.href = url.toString();
        });
    });
    
    document.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.rerun-btn')) {
                const query = item.dataset.query;
                const type = item.dataset.type;
                
                const url = new URL(window.location.origin + '/');
                url.searchParams.set('q', query);
                if (type) url.searchParams.set('type', type);
                window.location.href = url.toString();
            }
        });
    });
}

// Perform the actual clear
async function performClearHistory() {
    try {
        const response = await fetch(API_BASE, { method: 'DELETE' });
        if (response.ok) {
            showToast('History cleared successfully', 'success');
            
            // Animate items removal
            const items = document.querySelectorAll('.history-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.style.transform = 'translateX(-100%)';
                    item.style.opacity = '0';
                }, index * 50);
            });
            
            setTimeout(() => loadHistory(), items.length * 50 + 300);
        } else {
            throw new Error('Failed to clear');
        }
    } catch (error) {
        console.error('Error clearing history:', error);
        showToast('Failed to clear history', 'error');
    }
}

// Legacy function - now shows modal
async function clearHistory() {
    showClearConfirmModal();
}

// Save to history (called from search page)
async function saveToHistory(query, searchType = 'general', resultsCount = 0) {
    if (!query || query.trim() === '') return null;
    
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: query.trim(),
                searchType: searchType || 'general',
                resultsCount: resultsCount || 0
            })
        });
        
        if (!response.ok) throw new Error('Failed to save');
        return await response.json();
    } catch (error) {
        console.error('Error saving to history:', error);
        return null;
    }
}

// Utility functions
function getTimeAgo(isoString) {
    if (!isoString) return '';
    const then = new Date(isoString);
    const now = new Date();
    const diff = Math.floor((now - then) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return `${Math.floor(diff / 604800)}w ago`;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type = 'info') {
    if (!elements.toastContainer) return;
    
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
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Expose for other pages
window.historyApi = { loadHistory, saveToHistory, clearHistory };
