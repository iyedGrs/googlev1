/**
 * Search History Page Logic
 * Handles loading, displaying, and managing search history
 */

const HISTORY_API = '/api/history';

/**
 * Initialize history page on load
 */
document.addEventListener('DOMContentLoaded', async () => {
    await loadHistory();
    setupEventListeners();
});

/**
 * Setup event listeners
 */
function setupEventListeners() {
    const clearAllBtn = document.getElementById('clearAllBtn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', confirmAndClearAll);
    }
}

/**
 * Load search history from API
 */
async function loadHistory() {
    try {
        const response = await fetch(HISTORY_API);
        if (!response.ok) {
            throw new Error(`Failed to load history: ${response.status}`);
        }

        const history = await response.json();
        renderHistory(history);
    } catch (error) {
        console.error('Error loading history:', error);
        showErrorState('Failed to load search history. Please try again.');
    }
}

/**
 * Render history items in the UI
 */
function renderHistory(historyItems) {
    const container = document.getElementById('historyContainer');
    const emptyState = document.getElementById('emptyState');
    const countBadge = document.getElementById('historyCount');
    const clearAllBtn = document.getElementById('clearAllBtn');

    if (!historyItems || historyItems.length === 0) {
        // Show empty state
        if (container) container.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        if (countBadge) countBadge.textContent = '0 searches';
        if (clearAllBtn) clearAllBtn.style.display = 'none';
        return;
    }

    // Hide empty state
    if (emptyState) emptyState.classList.add('hidden');
    if (countBadge) countBadge.textContent = `${historyItems.length} search${historyItems.length !== 1 ? 'es' : ''}`;
    if (clearAllBtn) clearAllBtn.style.display = 'inline-flex';

    // Build history HTML
    let html = '';
    historyItems.forEach(item => {
        const date = new Date(item.searchDate);
        const formattedDate = formatDate(date);
        const timeAgo = getTimeAgo(date);

        html += `
            <article class="history-item" data-id="${item.id}">
                <div class="history-content">
                    <div class="history-header">
                        <h3 class="history-query">${escapeHtml(item.query)}</h3>
                        <span class="history-type-badge badge-${item.searchType}">${item.searchType}</span>
                    </div>
                    <div class="history-meta">
                        <span class="history-date" title="${formattedDate}">
                            <i class="fas fa-clock"></i> ${timeAgo}
                        </span>
                        <span class="history-results">
                            <i class="fas fa-list"></i> ${item.resultsCount || 0} results
                        </span>
                    </div>
                </div>
                <div class="history-actions">
                    <button class="btn-rerun" onclick="rerunSearch('${escapeHtml(item.query)}', '${item.searchType}')" title="Re-run this search">
                        <i class="fas fa-redo"></i> Re-run
                    </button>
                    <button class="btn-delete" onclick="deleteHistoryItem(${item.id})" title="Delete from history">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </article>
        `;
    });

    if (container) {
        container.innerHTML = html;
    }
}

/**
 * Re-run a search from history
 */
function rerunSearch(query, searchType) {
    // Redirect to search page with query parameters
    const params = new URLSearchParams({
        q: query,
        type: searchType || 'general'
    });
    window.location.href = `/?${params.toString()}`;
}

/**
 * Delete a specific history item
 */
async function deleteHistoryItem(id) {
    if (!confirm('Delete this search from history?')) {
        return;
    }

    try {
        const response = await fetch(`${HISTORY_API}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete history item');
        }

        showToast('History item deleted', 'success');

        // Reload history
        await loadHistory();
    } catch (error) {
        console.error('Error deleting history item:', error);
        showToast('Failed to delete item', 'error');
    }
}

/**
 * Confirm and clear all history
 */
function confirmAndClearAll() {
    if (confirm('Are you sure you want to clear all search history? This cannot be undone.')) {
        clearAllHistory();
    }
}

/**
 * Clear all search history
 */
async function clearAllHistory() {
    try {
        const response = await fetch(HISTORY_API, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to clear history');
        }

        showToast('All history cleared', 'success');

        // Reload history
        await loadHistory();
    } catch (error) {
        console.error('Error clearing history:', error);
        showToast('Failed to clear history', 'error');
    }
}

/**
 * Show error state
 */
function showErrorState(message) {
    const container = document.getElementById('historyContainer');
    if (container) {
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
                <button class="btn-retry" onclick="loadHistory()">Try Again</button>
            </div>
        `;
    }
}

/**
 * Format date to readable string
 */
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

/**
 * Get time ago string (e.g., "2 hours ago")
 */
function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

    return formatDate(date).split(' at')[0];
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export functions to global scope
window.rerunSearch = rerunSearch;
window.deleteHistoryItem = deleteHistoryItem;
window.loadHistory = loadHistory;
