(() => {
    const DEFAULTS = {
        containerId: 'resultsContainer',
        emptyId: 'resultsEmpty',
        paginationId: 'resultsPagination',
        pageSize: 6,
        onSave: null
    };

    const state = {
        results: [],
        pageSize: DEFAULTS.pageSize,
        currentPage: 1,
        options: { ...DEFAULTS }
    };

    function displayResults(results, options = {}) {
        state.options = { ...DEFAULTS, ...options };
        state.results = Array.isArray(results) ? results : [];
        state.pageSize = state.options.pageSize;
        state.currentPage = 1;

        const container = document.getElementById(state.options.containerId);
        const emptyState = document.getElementById(state.options.emptyId);
        const pagination = document.getElementById(state.options.paginationId);

        if (!container || !emptyState || !pagination) {
            return;
        }

        bindContainerActions(container);
        renderPage(container, emptyState, pagination);
    }

    function bindContainerActions(container) {
        if (container.dataset.bound === 'true') {
            return;
        }
        container.dataset.bound = 'true';

        container.addEventListener('click', async (event) => {
            const viewButton = event.target.closest('[data-action="view"]');
            const saveButton = event.target.closest('[data-action="save"]');
            if (!viewButton && !saveButton) {
                return;
            }

            const card = event.target.closest('.result-card');
            if (!card) {
                return;
            }

            const index = Number(card.dataset.index);
            const result = state.results[index];
            if (!result) {
                return;
            }

            if (viewButton) {
                if (window.contentViewer && typeof window.contentViewer.open === 'function') {
                    window.contentViewer.open(result.url, {
                        title: result.title,
                        summary: result.summary
                    });
                }
                return;
            }

            if (saveButton) {
                const saveHandler = state.options.onSave || window.saveItem;
                if (typeof saveHandler === 'function') {
                    try {
                        await saveHandler(result.title, result.url, result.summary || '');
                    } catch (error) {
                        console.error('Save failed:', error);
                    }
                }
            }
        });
    }

    function renderPage(container, emptyState, pagination) {
        if (state.results.length === 0) {
            emptyState.style.display = 'block';
            container.innerHTML = '';
            pagination.innerHTML = '';
            return;
        }

        emptyState.style.display = 'none';
        const start = (state.currentPage - 1) * state.pageSize;
        const pageItems = state.results.slice(start, start + state.pageSize);
        container.innerHTML = pageItems
            .map((item, idx) => renderCard(item, start + idx))
            .join('');

        renderPagination(pagination);
    }

    function renderCard(result, index) {
        const normalized = normalizeResult(result);
        const meta = normalized.source || normalized.publishedAt ? `${normalized.source || 'Result'}${normalized.publishedAt ? ` • ${normalized.publishedAt}` : ''}` : 'Result';

        return `
            <article class="result-card" data-index="${index}">
                <div class="result-meta">${escapeHtml(meta)}</div>
                <h3 class="result-title">${escapeHtml(normalized.title)}</h3>
                <p class="result-snippet">${escapeHtml(normalized.summary)}</p>
                <div class="result-actions">
                    <button class="btn" data-action="view">View content</button>
                    <button class="btn btn-secondary" data-action="save">Save</button>
                </div>
            </article>
        `;
    }

    function renderPagination(pagination) {
        const totalPages = Math.ceil(state.results.length / state.pageSize);
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        const buttons = [];
        buttons.push(`<button ${state.currentPage === 1 ? 'disabled' : ''} data-page="prev">Prev</button>`);
        for (let i = 1; i <= totalPages; i += 1) {
            const activeClass = i === state.currentPage ? 'active' : '';
            buttons.push(`<button class="${activeClass}" data-page="${i}">${i}</button>`);
        }
        buttons.push(`<button ${state.currentPage === totalPages ? 'disabled' : ''} data-page="next">Next</button>`);
        pagination.innerHTML = buttons.join('');

        pagination.querySelectorAll('button').forEach((button) => {
            button.addEventListener('click', () => {
                const page = button.dataset.page;
                if (page === 'prev' && state.currentPage > 1) {
                    state.currentPage -= 1;
                } else if (page === 'next' && state.currentPage < totalPages) {
                    state.currentPage += 1;
                } else if (!Number.isNaN(Number(page))) {
                    state.currentPage = Number(page);
                }
                const container = document.getElementById(state.options.containerId);
                const emptyState = document.getElementById(state.options.emptyId);
                if (!container || !emptyState) {
                    return;
                }
                renderPage(container, emptyState, pagination);
            });
        });
    }

    function normalizeResult(result) {
        const safeResult = result || {};
        return {
            title: safeResult.title || safeResult.name || 'Untitled result',
            url: safeResult.url || safeResult.link || '',
            summary: safeResult.summary || safeResult.snippet || safeResult.description || 'No summary provided.',
            source: safeResult.source || safeResult.publisher || '',
            publishedAt: safeResult.publishedAt || safeResult.published || ''
        };
    }

    function escapeHtml(text) {
        if (!text) {
            return '';
        }
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }

    window.displayResults = displayResults;
})();
