/**
 * Search Page Logic
 * Handles search form submission, API calls, and integration with other modules
 */

const SEARCH_API = '/api/search';
const SEARCH_STATUS_API = '/api/search/status';

/**
 * Initialize search page on load
 */
document.addEventListener('DOMContentLoaded', () => {
    setupSearchForm();
    loadSuggestions();
    setupSuggestionsDisplay();

    // Check for URL parameters (from history re-run)
    checkUrlParameters();
});

/**
 * Setup search form submission
 */
function setupSearchForm() {
    const form = document.getElementById('searchForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await performSearch();
    });
}

/**
 * Perform search with Iyed's API
 */
async function performSearch() {
    const query = document.getElementById('searchQuery').value.trim();
    const type = document.getElementById('searchType').value;

    if (!query) {
        showToast('Please enter a search query', 'warning');
        return;
    }

    // Show loading state
    showLoadingState();
    hideErrorMessage();

    try {
        // Call Iyed's search API
        const response = await fetch(SEARCH_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: query,
                searchType: type
            })
        });

        if (!response.ok) {
            throw new Error(`Search failed with status ${response.status}`);
        }

        const results = await response.json();

        // Hide loading state
        hideLoadingState();

        // Display results using Aziz's function
        if (typeof displayResults === 'function') {
            displayResults(results);
        } else {
            console.warn('displayResults function not found. Results:', results);
            showResultsPlaceholder(results);
        }

        // Save to history (Marwa's function)
        if (typeof saveToHistory === 'function') {
            saveToHistory(query, type, results.length || 0);
        }

        // Save as preference for next time
        updateSearchPreference(query, type);

        showToast('Search completed successfully', 'success');

    } catch (error) {
        hideLoadingState();
        showErrorMessage(`Search failed: ${error.message}`);
        showToast(`Search error: ${error.message}`, 'error');
        console.error('Search error:', error);
    }
}

/**
 * Show loading state
 */
function showLoadingState() {
    const loading = document.getElementById('loadingState');
    const results = document.getElementById('resultsContainer');

    if (loading) loading.classList.remove('hidden');
    if (results) results.classList.add('hidden');
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    const loading = document.getElementById('loadingState');
    if (loading) loading.classList.add('hidden');
}

/**
 * Show error message
 */
function showErrorMessage(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }
}

/**
 * Hide error message
 */
function hideErrorMessage() {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.classList.add('hidden');
    }
}

/**
 * Show placeholder results (fallback if displayResults not available)
 */
function showResultsPlaceholder(results) {
    const container = document.getElementById('resultsContainer');
    if (!container) return;

    container.classList.remove('hidden');
    container.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h2>Results (${results.length || 0} found)</h2>
            <p>Results display component not initialized yet.</p>
            <pre style="text-align: left; background: #f5f5f5; padding: 20px; border-radius: 8px; overflow-x: auto;">
${JSON.stringify(results, null, 2)}
            </pre>
        </div>
    `;
}

/**
 * Load search suggestions from Iyed's status endpoint
 */
async function loadSuggestions() {
    try {
        const response = await fetch(SEARCH_STATUS_API);
        if (!response.ok) return;

        const status = await response.json();

        if (status.suggestions && Array.isArray(status.suggestions)) {
            renderSuggestions(status.suggestions);
        }
    } catch (error) {
        console.error('Error loading suggestions:', error);
    }
}

/**
 * Setup suggestions display behavior
 */
function setupSuggestionsDisplay() {
    const searchInput = document.getElementById('searchQuery');
    const suggestionsContainer = document.getElementById('suggestionsContainer');

    if (!searchInput || !suggestionsContainer) return;

    // Show suggestions on focus
    searchInput.addEventListener('focus', () => {
        if (suggestionsContainer.children.length > 0) {
            suggestionsContainer.classList.remove('hidden');
        }
    });

    // Hide suggestions on blur
    searchInput.addEventListener('blur', () => {
        setTimeout(() => {
            suggestionsContainer.classList.add('hidden');
        }, 200);
    });

    // Filter suggestions on input
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const items = suggestionsContainer.querySelectorAll('.suggestion-item');

        items.forEach(item => {
            if (query && item.textContent.toLowerCase().includes(query)) {
                item.style.display = 'block';
            } else if (!query) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

/**
 * Render suggestions under search input
 */
function renderSuggestions(suggestions) {
    const container = document.getElementById('suggestionsContainer');
    if (!container || !suggestions.length) return;

    container.innerHTML = '';

    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = suggestion;
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            document.getElementById('searchQuery').value = suggestion;
            container.classList.add('hidden');
            performSearch();
        });
        container.appendChild(item);
    });
}

/**
 * Update search preference (called after successful search)
 */
async function updateSearchPreference(query, type) {
    try {
        const response = await fetch('/api/preferences/search', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                defaultQuery: query,
                defaultType: type
            })
        });

        if (response.ok) {
            console.log('Search preference updated');
        }
    } catch (error) {
        console.error('Error updating preference:', error);
    }
}

/**
 * Check for URL parameters (for history re-runs)
 * Supports: ?q=query&type=search_type
 */
function checkUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    const type = params.get('type');

    if (query) {
        const searchInput = document.getElementById('searchQuery');
        if (searchInput) {
            searchInput.value = decodeURIComponent(query);
        }

        if (type) {
            const typeSelect = document.getElementById('searchType');
            if (typeSelect) {
                typeSelect.value = type;
            }
        }

        // Auto-run search if both query is provided
        setTimeout(() => {
            performSearch();
        }, 500);
    }
}

/**
 * Preferences Panel Handlers
 */
document.addEventListener('DOMContentLoaded', () => {
    const themePref = document.getElementById('themePref');
    const saveBtn = document.getElementById('savePreferencesBtn');

    if (themePref) {
        themePref.addEventListener('change', (e) => {
            setTheme(e.target.value);
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            const theme = document.getElementById('themePref').value;
            const tips = document.getElementById('tipsCheckbox').checked;
            const query = document.getElementById('searchQuery').value;
            const type = document.getElementById('searchType').value;

            const success = await savePreferences({
                defaultQuery: query,
                defaultType: type,
                theme: theme,
                showAdvancedTips: tips
            });

            if (success) {
                showToast('Preferences saved successfully', 'success');
            } else {
                showToast('Failed to save preferences', 'error');
            }
        });
    }
});

/**
 * Save search to history via backend API
 * Called after search completes successfully
 */
async function saveToHistory(query, type, resultsCount) {
    try {
        const response = await fetch('/api/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: query,
                searchType: type,
                resultsCount: resultsCount
            })
        });

        if (response.ok) {
            console.log('Search saved to history successfully');
        } else {
            console.warn('Failed to save search to history:', response.status);
        }
    } catch (error) {
        console.error('Error saving to history:', error);
    }
}

/**
 * Public function for Aziz's results display - Default Implementation
 * Shows search results in a formatted list with titles, URLs, and descriptions
 * @param {Array} results - Array of search result objects
 */
function displayResults(results) {
    const container = document.getElementById('resultsContainer');
    if (!container) return;

    container.classList.remove('hidden');

    if (!results || results.length === 0) {
        container.innerHTML = `
            <div class="empty-results">
                <p>No results found. Try a different search query.</p>
            </div>
        `;
        return;
    }

    // Build results HTML
    let html = `<div class="results-header"><h2>Found ${results.length} results</h2></div>`;
    html += '<div class="results-list">';

    results.forEach((result, index) => {
        html += `
            <article class="result-item" data-id="${result.id || index}">
                <h3 class="result-title">
                    <a href="${result.url || '#'}" target="_blank">${result.title || 'Untitled'}</a>
                </h3>
                <p class="result-url">${result.url || 'No URL'}</p>
                <p class="result-description">${result.description || 'No description available'}</p>
                <div class="result-actions">
                    <button class="btn-save-result" onclick="saveResultToItems('${(result.id || index)}', '${escapeHtml(result.title || 'Untitled')}', '${escapeHtml(result.url || '')}', '${escapeHtml(result.description || '')}')">
                        <i class="fas fa-bookmark"></i> Save
                    </button>
                </div>
            </article>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

/**
 * Save a search result to saved items
 */
async function saveResultToItems(id, title, url, description) {
    try {
        const response = await fetch('/api/saved', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                url: url,
                summary: description
            })
        });

        if (response.ok) {
            showToast('Saved to your collection!', 'success');
        } else {
            showToast('Failed to save item', 'error');
        }
    } catch (error) {
        console.error('Error saving item:', error);
        showToast('Error saving item', 'error');
    }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/'/g, '&apos;');
}

// Export functions for external use
window.performSearch = performSearch;
window.saveToHistory = saveToHistory;
window.displayResults = displayResults;
window.saveResultToItems = saveResultToItems;
