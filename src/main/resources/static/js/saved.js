/**
 * SearchHub - Saved Items JavaScript
 * Manages saved/bookmarked search results with beautiful confirmation modals
 */

const API_BASE = '/api/saved-items';

// DOM Elements
const elements = {
    savedSection: document.getElementById('savedSection'),
    savedGrid: document.getElementById('savedGrid'),
    emptyState: document.getElementById('emptyState'),
    itemCount: document.getElementById('itemCount'),
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
let pendingDeleteId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSavedItems();
    setupModalListeners();
});

// Setup modal event listeners
function setupModalListeners() {
    // Cancel button
    elements.confirmCancel.addEventListener('click', closeConfirmModal);
    
    // Backdrop click
    elements.confirmModal.querySelector('.confirm-modal__backdrop').addEventListener('click', closeConfirmModal);
    
    // Confirm action
    elements.confirmAction.addEventListener('click', () => {
        if (pendingDeleteId !== null) {
            performDelete(pendingDeleteId);
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

// Show confirmation modal
function showConfirmModal(itemId, itemTitle) {
    pendingDeleteId = itemId;
    
    // Update modal content
    elements.confirmTitle.textContent = 'Remove Item?';
    elements.confirmMessage.innerHTML = `
        Are you sure you want to remove <strong>"${escapeHtml(itemTitle)}"</strong> from your saved items?
        <br><br>
        <span style="color: var(--text-muted); font-size: 0.875rem;">This action cannot be undone.</span>
    `;
    
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
    elements.confirmModal.classList.remove('active');
    document.body.style.overflow = '';
    pendingDeleteId = null;
}

// Load all saved items
async function loadSavedItems() {
    try {
        console.log('Loading saved items from:', API_BASE);
        const response = await fetch(API_BASE);
        console.log('Saved items response status:', response.status);
        
        if (!response.ok) throw new Error('Failed to load');
        
        const items = await response.json();
        console.log('Loaded saved items:', items);
        displayItems(items);
    } catch (error) {
        console.error('Error loading saved items:', error);
        showToast('Failed to load saved items', 'error');
    }
}

// Display items in grid
function displayItems(items) {
    // Update count
    elements.itemCount.querySelector('span').textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;
    
    if (items.length === 0) {
        elements.savedSection.classList.add('hidden');
        elements.emptyState.classList.remove('hidden');
        return;
    }
    
    elements.emptyState.classList.add('hidden');
    elements.savedSection.classList.remove('hidden');
    
    elements.savedGrid.innerHTML = items.map(item => createItemCard(item)).join('');
    
    // Add event listeners
    setupCardListeners();
}

// Create card HTML
function createItemCard(item) {
    const date = new Date(item.savedDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
    const domain = extractDomain(item.url);
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    
    return `
        <article class="result-card saved-card" data-id="${item.id}" data-title="${escapeHtml(item.title)}">
            <div class="result-card__header">
                <div class="result-card__favicon">
                    <img src="${faviconUrl}" alt="" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌐</text></svg>'">
                </div>
                <h3 class="result-card__title">${escapeHtml(item.title)}</h3>
            </div>
            <a href="${item.url}" target="_blank" class="result-card__url" onclick="event.stopPropagation()">
                ${escapeHtml(item.url)}
            </a>
            <p class="result-card__summary">${escapeHtml(item.summary || 'No description available')}</p>
            <div class="result-card__meta">
                <span><i class="fas fa-calendar"></i> ${date}</span>
            </div>
            <div class="result-card__actions">
                <a href="${item.url}" target="_blank" class="result-card__btn result-card__btn--view" onclick="event.stopPropagation()">
                    <i class="fas fa-external-link-alt"></i> Open
                </a>
                <button class="result-card__btn result-card__btn--delete" data-id="${item.id}" data-title="${escapeHtml(item.title)}">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </article>
    `;
}

// Setup card event listeners
function setupCardListeners() {
    document.querySelectorAll('.result-card__btn--delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const title = btn.dataset.title || 'this item';
            showConfirmModal(id, title);
        });
    });
    
    document.querySelectorAll('.saved-card').forEach(card => {
        card.addEventListener('click', () => {
            const url = card.querySelector('.result-card__url').href;
            window.open(url, '_blank');
        });
    });
}

// Perform the actual delete
async function performDelete(id) {
    try {
        const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        
        if (response.ok) {
            showToast('Item removed successfully', 'success');
            
            // Animate card removal
            const card = document.querySelector(`[data-id="${id}"]`);
            if (card) {
                card.style.transform = 'scale(0.8)';
                card.style.opacity = '0';
                setTimeout(() => loadSavedItems(), 300);
            } else {
                loadSavedItems();
            }
        } else {
            throw new Error('Failed to delete');
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        showToast('Failed to remove item', 'error');
    }
}

// Legacy function for compatibility
function deleteItem(id) {
    const card = document.querySelector(`[data-id="${id}"]`);
    const title = card ? card.dataset.title : 'this item';
    showConfirmModal(id, title);
}

// Utility functions
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
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Expose for other pages
window.savedApi = { loadSavedItems, deleteItem };
