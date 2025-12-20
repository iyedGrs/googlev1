/**
 * Saved Items Page Logic
 * Handles loading, displaying, and managing saved items
 */

const SAVED_ITEMS_API = '/api/saved-items';

/**
 * Initialize saved items page on load
 */
document.addEventListener('DOMContentLoaded', async () => {
    await loadSavedItems();
});

/**
 * Load saved items from API
 */
async function loadSavedItems() {
    try {
        const response = await fetch(SAVED_ITEMS_API);
        if (!response.ok) {
            throw new Error(`Failed to load saved items: ${response.status}`);
        }

        const items = await response.json();
        renderSavedItems(items);
    } catch (error) {
        console.error('Error loading saved items:', error);
        showErrorState('Failed to load saved items. Please try again.');
    }
}

/**
 * Render saved items in the UI
 */
function renderSavedItems(items) {
    const container = document.getElementById('items-container');
    const emptyState = document.getElementById('empty-state');
    const countBadge = document.getElementById('count-badge');

    if (!items || items.length === 0) {
        // Show empty state
        if (container) container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        if (countBadge) countBadge.textContent = '0 items';
        return;
    }

    // Hide empty state
    if (emptyState) emptyState.style.display = 'none';
    if (countBadge) countBadge.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;

    // Build items HTML
    let html = '';
    items.forEach(item => {
        const date = new Date(item.savedDate);
        const formattedDate = formatDate(date);

        html += `
            <article class="saved-item" data-id="${item.id}">
                <div class="saved-item-content">
                    <h3 class="saved-item-title">
                        <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">
                            ${escapeHtml(item.title)}
                        </a>
                    </h3>
                    <p class="saved-item-url">${escapeHtml(item.url)}</p>
                    <p class="saved-item-summary">${escapeHtml(item.summary || 'No description')}</p>
                    
                    ${item.notes ? `
                        <div class="saved-item-notes">
                            <strong>Notes:</strong> ${escapeHtml(item.notes)}
                        </div>
                    ` : ''}
                    
                    <div class="saved-item-meta">
                        <span class="saved-date">
                            <i class="fas fa-bookmark"></i> Saved ${formattedDate}
                        </span>
                    </div>
                </div>
                
                <div class="saved-item-actions">
                    <button class="btn-edit-notes" onclick="editNotes(${item.id}, '${escapeForAttribute(item.notes || '')}')" title="Edit notes">
                        <i class="fas fa-edit"></i> ${item.notes ? 'Edit Notes' : 'Add Notes'}
                    </button>
                    <button class="btn-delete-saved" onclick="deleteSavedItem(${item.id})" title="Delete">
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
 * Edit or add notes to a saved item
 */
function editNotes(id, currentNotes) {
    const newNotes = prompt('Enter your notes:', currentNotes || '');

    if (newNotes !== null) {
        updateNotes(id, newNotes);
    }
}

/**
 * Update notes for a saved item
 */
async function updateNotes(id, notes) {
    try {
        const response = await fetch(`${SAVED_ITEMS_API}/${id}/notes`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ notes: notes })
        });

        if (!response.ok) {
            throw new Error('Failed to update notes');
        }

        showToast('Notes updated successfully', 'success');
        await loadSavedItems();
    } catch (error) {
        console.error('Error updating notes:', error);
        showToast('Failed to update notes', 'error');
    }
}

/**
 * Delete a saved item
 */
async function deleteSavedItem(id) {
    if (!confirm('Remove this item from your saved collection?')) {
        return;
    }

    try {
        const response = await fetch(`${SAVED_ITEMS_API}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete item');
        }

        showToast('Item removed from saved collection', 'success');
        await loadSavedItems();
    } catch (error) {
        console.error('Error deleting item:', error);
        showToast('Failed to delete item', 'error');
    }
}

/**
 * Show error state
 */
function showErrorState(message) {
    const container = document.getElementById('items-container');
    if (container) {
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
                <button class="btn-retry" onclick="loadSavedItems()">Try Again</button>
            </div>
        `;
    }
}

/**
 * Format date to readable string
 */
function formatDate(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
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

/**
 * Escape text for use in HTML attributes
 */
function escapeForAttribute(text) {
    if (!text) return '';
    return text.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
}

// Export functions to global scope
window.editNotes = editNotes;
window.deleteSavedItem = deleteSavedItem;
window.loadSavedItems = loadSavedItems;
