// API Configuration
const API_BASE = '/api/saved-items';

// Load saved items on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSavedItems();
});

// Load all saved items from backend
async function loadSavedItems() {
    try {
        const response = await fetch(API_BASE);
        if (!response.ok) {
            console.error('HTTP error:', response.status, response.statusText);
            showToast('Failed to load saved items', 'error');
            return;
        }
        const items = await response.json();
        
        displayItems(items);
    } catch (error) {
        console.error('Error loading saved items:', error);
        showToast('Failed to load saved items', 'error');
    }
}

// Display items in the UI
function displayItems(items) {
    const container = document.getElementById('items-container');
    const emptyState = document.getElementById('empty-state');
    const countText = document.getElementById('count-text');
    
    // Update count
    if (countText) {
        countText.textContent = items.length;
    }
    
    if (items.length === 0) {
        emptyState.style.display = 'block';
        container.classList.remove('active');
        return;
    }
    
    emptyState.style.display = 'none';
    container.classList.add('active');
    container.innerHTML = '';
    
    items.forEach(item => {
        const card = createCard(item);
        container.appendChild(card);
    });
}

// Create a card element for a saved item
function createCard(item) {
    const card = document.createElement('div');
    card.className = 'saved-card';
    card.dataset.id = item.id;
    
    const date = new Date(item.savedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const detailsId = `details-${item.id}`;
    const notesId = `notes-${item.id}`;
    
    card.innerHTML = `
        <div class="card-header">
            <div>
                <h3 class="card-title">${escapeHtml(item.title)}</h3>
                <a href="${escapeHtml(item.url)}" target="_blank" class="card-url">
                    <i class="fas fa-external-link-alt"></i> ${escapeHtml(item.url)}
                </a>
            </div>
            <button class="delete-btn" onclick="deleteItem(${item.id})">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
        
        <button class="expand-toggle" onclick="toggleDetails('${detailsId}', this)">
            <i class="fas fa-chevron-down"></i> Show Details
        </button>
        
        <div id="${detailsId}" class="details-content">
            <p class="card-summary">${escapeHtml(item.summary || 'No summary available')}</p>
            <div class="card-date"><i class="far fa-clock"></i> Saved on ${date}</div>
            
            <div class="notes-section">
                <button class="notes-toggle" onclick="toggleNotes('${notesId}', this)">
                    <i class="fas fa-chevron-right"></i>
                    <span><i class="fas fa-sticky-note"></i> Personal Notes</span>
                </button>
                <div id="${notesId}" class="notes-content">
                    <textarea class="notes-textarea" 
                              placeholder="Add your notes here..."
                              onchange="updateNotes(${item.id}, this.value)">${escapeHtml(item.notes || '')}</textarea>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Toggle details visibility
function toggleDetails(detailsId, button) {
    const detailsContent = document.getElementById(detailsId);
    const icon = button.querySelector('i');
    const isExpanded = detailsContent.classList.contains('expanded');
    
    if (isExpanded) {
        detailsContent.classList.remove('expanded');
        icon.className = 'fas fa-chevron-down';
        button.innerHTML = '<i class="fas fa-chevron-down"></i> Show Details';
    } else {
        detailsContent.classList.add('expanded');
        icon.className = 'fas fa-chevron-up';
        button.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Details';
    }
}

// Toggle notes visibility
function toggleNotes(notesId, button) {
    const notesContent = document.getElementById(notesId);
    const isExpanded = notesContent.classList.contains('expanded');
    
    if (isExpanded) {
        notesContent.classList.remove('expanded');
        button.classList.remove('expanded');
    } else {
        notesContent.classList.add('expanded');
        button.classList.add('expanded');
    }
}

// Save a new item (called from other pages)
async function saveItem(title, url, summary) {
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, url, summary })
        });
        
        if (response.ok) {
            showToast('Item saved successfully!', 'success');
            return true;
        } else {
            const error = await response.json();
            showToast(
                (error.error ? `Failed to save item: ${error.error}` : `Failed to save item (status ${response.status})`),
                'warning'
            );
            return false;
        }
    } catch (error) {
        console.error('Error saving item:', error);
        if (error instanceof TypeError) {
            showToast('Network error: Unable to reach server. Please check your connection.', 'error');
        } else {
            showToast(`Unexpected error: ${error.message || error}`, 'error');
        }
        return false;
    }
}

// Update notes for an item
async function updateNotes(id, notes) {
    try {
        const response = await fetch(`${API_BASE}/${id}/notes`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notes })
        });
        
        if (response.ok) {
            showToast('Notes updated', 'success');
        } else {
            showToast('Failed to update notes', 'error');
        }
    } catch (error) {
        console.error('Error updating notes:', error);
        showToast('Failed to update notes', 'error');
    }
}

// Delete an item
async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Item deleted', 'success');
            // Remove card from UI
            const card = document.querySelector(`[data-id="${id}"]`);
            if (card) {
                card.remove();
            }
            // Reload to update count
            loadSavedItems();
        } else {
            showToast('Failed to delete item', 'error');
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        showToast('Failed to delete item', 'error');
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions globally available
window.saveItem = saveItem;
window.updateNotes = updateNotes;
window.deleteItem = deleteItem;
window.showToast = showToast;
window.toggleDetails = toggleDetails;
window.toggleNotes = toggleNotes;
