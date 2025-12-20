(() => {
    const state = {
        url: '',
        title: '',
        summary: ''
    };

    let elements = null;

    function init() {
        const modal = document.getElementById('contentModal');
        if (!modal) {
            return false;
        }

        elements = {
            modal,
            backdrop: modal.querySelector('[data-close="true"]'),
            closeButton: modal.querySelector('.content-modal__close'),
            closeFooterButton: modal.querySelector('.content-modal__close-btn'),
            saveButton: modal.querySelector('.content-modal__save-btn'),
            title: modal.querySelector('#contentModalTitle'),
            meta: modal.querySelector('#contentModalMeta'),
            body: modal.querySelector('#contentModalBody'),
            status: modal.querySelector('#contentModalStatus')
        };

        bindModalActions();
        return true;
    }

    function bindModalActions() {
        if (!elements || elements.modal.dataset.bound === 'true') {
            return;
        }
        elements.modal.dataset.bound = 'true';

        if (elements.backdrop) {
            elements.backdrop.addEventListener('click', close);
        }
        if (elements.closeButton) {
            elements.closeButton.addEventListener('click', close);
        }
        if (elements.closeFooterButton) {
            elements.closeFooterButton.addEventListener('click', close);
        }
        if (elements.saveButton) {
            elements.saveButton.addEventListener('click', async () => {
                if (typeof window.saveItem === 'function') {
                    await window.saveItem(state.title, state.url, state.summary || '');
                }
            });
        }
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && elements.modal.classList.contains('is-open')) {
                close();
            }
        });
    }

    async function open(url, context = {}) {
        if (!elements && !init()) {
            return;
        }

        state.url = url;
        state.title = context.title || url;
        state.summary = context.summary || '';

        elements.modal.classList.add('is-open');
        elements.modal.setAttribute('aria-hidden', 'false');
        setLoading();

        try {
            const response = await fetch(`/api/content?url=${encodeURIComponent(url)}`);
            if (!response.ok) {
                throw new Error(`Request failed (${response.status})`);
            }
            const data = await response.json();
            renderContent(data);
        } catch (error) {
            renderError(error);
        }
    }

    function close() {
        if (!elements) {
            return;
        }
        elements.modal.classList.remove('is-open');
        elements.modal.setAttribute('aria-hidden', 'true');
    }

    function setLoading() {
        elements.title.textContent = 'Loading content...';
        elements.meta.textContent = '';
        elements.body.innerHTML = '<div class="content-modal__status">Fetching article content...</div>';
        if (elements.status) {
            elements.status.textContent = '';
        }
    }

    function renderContent(data) {
        const title = data.title || state.title || 'Untitled';
        const fetchedAt = data.fetchedAt ? new Date(data.fetchedAt).toLocaleString() : 'Unknown';
        const cachedLabel = data.cached ? 'Cached' : 'Fresh';
        const wordCount = Number.isFinite(data.wordCount) ? data.wordCount : 0;

        elements.title.textContent = title;
        elements.meta.textContent = `${cachedLabel} • ${wordCount} words • ${fetchedAt}`;
        elements.body.innerHTML = formatParagraphs(data.content || 'No content available.');
    }

    function renderError(error) {
        elements.title.textContent = 'Unable to load content';
        elements.meta.textContent = '';
        elements.body.innerHTML = `<div class="content-modal__status">Error: ${escapeHtml(error.message || 'Unknown error')}</div>`;
    }

    function formatParagraphs(text) {
        const trimmed = String(text || '').trim();
        if (!trimmed) {
            return '<p>No content available.</p>';
        }
        return trimmed
            .split(/\n{2,}/)
            .map((block) => `<p>${escapeHtml(block)}</p>`)
            .join('');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    document.addEventListener('DOMContentLoaded', init);

    window.contentViewer = {
        open,
        close
    };
})();
