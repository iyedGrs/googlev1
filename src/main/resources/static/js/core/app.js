/**
 * Global App Initialization and Navigation Management
 * Handles navigation bar loading, preferences initialization, and shared utilities
 */

// API Configuration
const API_BASE = '/api';
const PREFERENCES_ENDPOINT = `${API_BASE}/preferences/search`;
const NAVIGATION_ENDPOINT = `${API_BASE}/navigation`;

// Load saved theme from localStorage immediately (before page renders)
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-theme-pending');
}

/**
 * Initialize app on page load
 * - Load navigation from API
 * - Load user preferences
 * - Apply user theme
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Load navigation
    await loadNavigation();

    // Load and apply preferences on ALL pages
    await loadPreferences();

    // Setup preferences panel on all pages
    setupPreferencesPanel();

    // Setup mobile nav toggle
    setupMobileNav();

    // Set active nav link
    setActiveNavLink();
});

/**
 * Load navigation from /api/navigation and render it
 */
async function loadNavigation() {
    try {
        const response = await fetch(NAVIGATION_ENDPOINT);
        if (!response.ok) {
            console.error('Failed to load navigation:', response.status);
            return;
        }

        const data = await response.json();
        renderNavigation(data);
    } catch (error) {
        console.error('Error loading navigation:', error);
    }
}

/**
 * Render navigation links from API response
 */
function renderNavigation(navData) {
    const navLinksContainer = document.getElementById('navLinks');
    if (!navLinksContainer) return;

    navLinksContainer.innerHTML = '';

    // Add navigation links
    if (navData.links && Array.isArray(navData.links)) {
        navData.links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.href;
            a.className = 'nav-link';
            a.innerHTML = `${link.icon} ${link.label}`;
            navLinksContainer.appendChild(a);
        });
    }

    // Update status text
    const statusBadge = document.getElementById('statusBadge');
    if (statusBadge && navData.statusText) {
        statusBadge.textContent = navData.statusText;
    }
}

/**
 * Set the active nav link based on current page
 */
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Match root path or exact file
        if ((href === '/' && currentPath === '/') ||
            (href !== '/' && currentPath.includes(href))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Setup mobile navigation toggle
 */
function setupMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

/**
 * Setup preferences panel
 */
function setupPreferencesPanel() {
    const preferencesBtn = document.getElementById('preferencesBtn');
    const preferencesPanel = document.getElementById('preferencesPanel');
    const themePref = document.getElementById('themePref');
    const savePreferencesBtn = document.getElementById('savePreferencesBtn');

    if (!preferencesBtn || !preferencesPanel) return;

    // Toggle panel visibility
    preferencesBtn.addEventListener('click', () => {
        preferencesPanel.classList.toggle('hidden');
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!preferencesPanel.contains(e.target) && !preferencesBtn.contains(e.target)) {
            preferencesPanel.classList.add('hidden');
        }
    });

    // Theme change listener - apply immediately
    if (themePref) {
        themePref.addEventListener('change', (e) => {
            const newTheme = e.target.value;
            console.log('Theme changed to:', newTheme);
            setTheme(newTheme);
            showToast(`Theme changed to ${newTheme} mode`, 'success');
        });
    }

    // Save preferences button
    if (savePreferencesBtn) {
        savePreferencesBtn.addEventListener('click', async () => {
            const theme = themePref?.value || 'light';
            const tips = document.getElementById('tipsCheckbox')?.checked || false;
            const query = document.getElementById('searchQuery')?.value || '';
            const type = document.getElementById('searchType')?.value || 'general';

            const preferences = {
                defaultQuery: query,
                defaultType: type,
                theme: theme,
                showAdvancedTips: tips
            };

            const success = await savePreferences(preferences);
            if (success) {
                showToast('Preferences saved successfully', 'success');
                preferencesPanel.classList.add('hidden');
            } else {
                showToast('Failed to save preferences', 'error');
            }
        });
    }
}
async function loadPreferences() {
    try {
        const response = await fetch(PREFERENCES_ENDPOINT);
        if (!response.ok) {
            console.error('Failed to load preferences:', response.status);
            return;
        }

        const prefs = await response.json();
        applyPreferences(prefs);
    } catch (error) {
        console.error('Error loading preferences:', error);
        // Still apply localStorage theme if API fails
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }
}

/**
 * Apply preferences to the UI
 */
function applyPreferences(prefs) {
    // Apply theme from API or fallback to localStorage
    let theme = prefs?.theme || localStorage.getItem('theme') || 'light';

    console.log('Applying preferences, theme:', theme);

    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }

    // Prefill search query if available
    const searchInput = document.getElementById('searchQuery');
    if (searchInput && prefs?.defaultQuery) {
        searchInput.value = prefs.defaultQuery;
    }

    // Set search type
    const searchType = document.getElementById('searchType');
    if (searchType && prefs?.defaultType) {
        searchType.value = prefs.defaultType;
    }

    // Update preferences panel if it exists
    const themePref = document.getElementById('themePref');
    if (themePref && prefs?.theme) {
        themePref.value = prefs.theme;
    }

    const tipsCheckbox = document.getElementById('tipsCheckbox');
    if (tipsCheckbox && prefs?.showAdvancedTips !== undefined) {
        tipsCheckbox.checked = prefs.showAdvancedTips;
    }
}

/**
 * Save preferences to backend
 */
async function savePreferences(preferences) {
    try {
        const response = await fetch(PREFERENCES_ENDPOINT, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(preferences)
        });

        if (!response.ok) {
            console.error('Failed to save preferences:', response.status);
            return false;
        }

        const saved = await response.json();
        applyPreferences(saved);
        return true;
    } catch (error) {
        console.error('Error saving preferences:', error);
        return false;
    }
}

/**
 * Update theme preference
 */
function setTheme(theme) {
    console.log('🎨 Setting theme to:', theme);

    // Ensure theme value is valid
    if (theme !== 'dark' && theme !== 'light') {
        theme = 'light';
    }

    // Apply theme using classList (most reliable method)
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.documentElement.classList.add('dark-theme');
        console.log('✓ Dark theme applied. Body classes:', document.body.className);
    } else {
        document.body.classList.remove('dark-theme');
        document.documentElement.classList.remove('dark-theme');
        console.log('✓ Light theme applied. Body classes:', document.body.className);
    }

    // Force reflow to ensure styles update immediately
    void document.body.offsetHeight;

    // Store in localStorage for persistence
    localStorage.setItem('theme', theme);

    // Update the select element if it exists
    const themePref = document.getElementById('themePref');
    if (themePref) {
        themePref.value = theme;
        console.log('✓ Theme select updated to:', theme);
    }

    // Save to backend
    saveThemeToBackend(theme);
}

/**
 * Save theme to backend API
 */
async function saveThemeToBackend(theme) {
    try {
        const response = await fetch(PREFERENCES_ENDPOINT, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                theme: theme
            })
        });

        if (response.ok) {
            console.log('✓ Theme saved to backend');
        }
    } catch (error) {
        console.error('❌ Error saving theme:', error);
    }
}

/**
 * Show/hide element with optional timeout
 */
function show(element) {
    if (element) {
        element.classList.remove('hidden');
    }
}

function hide(element) {
    if (element) {
        element.classList.add('hidden');
    }
}

/**
 * Display toast notification
 */
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;

    // Set color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    toast.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(toast);

    // Remove after duration
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Global error handler
 */
function handleError(error, defaultMessage = 'An error occurred') {
    console.error('Error:', error);
    showToast(error.message || defaultMessage, 'error');
}

/**
 * Add animation styles to document
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export functions to global scope for use in HTML attributes
window.setTheme = setTheme;
window.showToast = showToast;
window.applyPreferences = applyPreferences;
window.savePreferences = savePreferences;
