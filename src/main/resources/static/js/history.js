// History JS: exposes loadHistory() and saveToHistory(query, type, count)

const apiBase = '/api/history';

async function loadHistory() {
    try {
        console.log('loadHistory: Fetching from', apiBase);
        const res = await fetch(apiBase);
        console.log('loadHistory: Response status:', res.status);
        
        if (!res.ok) {
            throw new Error(`Failed to load history: HTTP ${res.status}`);
        }
        
        const items = await res.json();
        console.log('loadHistory: Received items:', items);
        renderHistory(items);
    } catch (e) {
        console.error('loadHistory error:', e);
        showErrorMessage('Failed to load search history');
    }
}

function timeAgo(isoString) {
    if (!isoString) return '';
    const then = new Date(isoString);
    const now = new Date();
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff/86400)}d ago`;
    return `${Math.floor(diff/604800)}w ago`;
}

function renderHistory(items) {
    const list = document.getElementById('history-list');
    const empty = document.getElementById('empty-state');
    const countBadge = document.getElementById('count-badge');
    const countText = document.getElementById('count-text');
    const clearBtn = document.getElementById('clear-btn');

    // If history elements don't exist on this page, skip rendering (e.g., on index.html)
    if (!list || !empty || !countBadge || !clearBtn) {
        console.log('History UI elements not found on this page, skipping render');
        return;
    }

    list.innerHTML = '';
    if (!items || items.length === 0) {
        empty.style.display = 'block';
        if (countText) countText.textContent = '0';
        clearBtn.disabled = true;
        return;
    }

    empty.style.display = 'none';
    if (countText) countText.textContent = items.length;
    clearBtn.disabled = false;

    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'history-item';
        li.style.animationDelay = `${index * 0.05}s`;

        const left = document.createElement('div');
        left.className = 'history-left';

        const q = document.createElement('div');
        q.className = 'history-query';
        q.title = item.query;
        q.textContent = item.query;

        const meta = document.createElement('div');
        meta.className = 'history-meta';
        
        const typeSpan = document.createElement('span');
        typeSpan.innerHTML = `<i class="fas fa-tag"></i> ${item.searchType || 'general'}`;
        
        const countSpan = document.createElement('span');
        countSpan.innerHTML = `<i class="fas fa-list"></i> ${item.resultsCount ?? 0} results`;
        
        const timeSpan = document.createElement('span');
        timeSpan.innerHTML = `<i class="fas fa-clock"></i> ${timeAgo(item.searchedAt)}`;
        
        meta.appendChild(typeSpan);
        meta.appendChild(countSpan);
        meta.appendChild(timeSpan);

        left.appendChild(q);
        left.appendChild(meta);

        const actions = document.createElement('div');
        actions.className = 'history-actions';

        const rerun = document.createElement('button');
        rerun.className = 'btn small';
        rerun.innerHTML = '<i class="fas fa-redo"></i> Re-run';
        rerun.title = 'Search again with this query';
        rerun.addEventListener('click', () => {
            // navigate back to root with params to re-run
            const url = new URL(window.location.origin + '/');
            url.searchParams.set('q', item.query);
            if (item.searchType) url.searchParams.set('type', item.searchType);
            window.location.href = url.toString();
        });

        actions.appendChild(rerun);

        li.appendChild(left);
        li.appendChild(actions);
        list.appendChild(li);
    });
}

async function saveToHistory(query, searchType = 'general', resultsCount = 0) {
    if (!query || query.trim() === '') {
        console.warn('saveToHistory: empty query, skipping');
        return null;
    }
    
    try {
        const payload = {
            query: query.trim(),
            searchType: searchType || 'general',
            resultsCount: resultsCount || 0
        };
        
        console.log('Saving to history with payload:', payload);
        
        const res = await fetch(apiBase, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        
        console.log('History API response status:', res.status);
        
        if (!res.ok) {
            let errMsg = 'Unknown error';
            try {
                const err = await res.json();
                errMsg = err.error || err.message || JSON.stringify(err);
            } catch (parseErr) {
                errMsg = res.statusText || `HTTP ${res.status}`;
            }
            console.error('saveToHistory failed with status', res.status, ':', errMsg);
            return null;
        }
        
        const created = await res.json();
        console.log('History entry saved successfully:', created);
        
        // Only refresh list if we're on the history page
        const historyList = document.getElementById('history-list');
        if (historyList) {
            console.log('saveToHistory: Refreshing history list since we are on history page');
            await loadHistory();
        } else {
            console.log('saveToHistory: Not on history page, skipping loadHistory');
        }
        
        return created;
    } catch (e) {
        console.error('saveToHistory error:', e);
        return null;
    }
}

async function clearHistory() {
    if (!confirm('Are you sure you want to clear all search history? This cannot be undone.')) return;
    try {
        const res = await fetch(apiBase, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to clear');
        loadHistory();
        showSuccessMessage('Search history cleared');
    } catch (e) {
        console.error('clearHistory error', e);
        showErrorMessage('Failed to clear history');
    }
}

function showSuccessMessage(msg) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.className = 'message success';
        messageDiv.style.display = 'block';
        messageDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}

function showErrorMessage(msg) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.className = 'message error';
        messageDiv.style.display = 'block';
        messageDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${msg}`;
    }
}

// Init bindings
document.addEventListener('DOMContentLoaded', () => {
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearHistory);
    }
    loadHistory();
});

// Expose to global so other modules/pages can use it
window.historyApi = {
    loadHistory,
    saveToHistory,
    clearHistory
};
