# 📜 Search History Feature - MARWA

## 📋 Feature Overview

You manage the trail of every query run in the app. Search history must capture the query, type, result counts, timestamps, and offer a friendly page where users can re-run or clear their past searches.

---

## 🎯 Responsibilities

### Frontend
- Create `history.html` with a list of past searches, empty state, and clear-all button.
- Provide click-to-rerun behavior that forwards query/type params back to Emna’s search page.
- Show relative timestamps ("5m ago" style) and keep the UI accessible on mobile.

### Backend
- Expose `/api/history` endpoints for list, create, and delete actions.
- Auto-save searches by offering a public `saveToHistory(query, type, resultsCount)` method that the search page can call.
- Enforce ordering by most recent and limit responses to the latest 20 entries for performance.

### Database
- Model the `SearchHistory` entity with query text, search type, count, and timestamp columns.
- Provide repository helpers for newest-first reads and bulk deletes when the list is cleared.

---

## 📁 Target Files

- Frontend: `static/history.html`, `static/js/history.js`, `static/css/history.css`.
- Backend: `controller/SearchHistoryController.java`, `service/SearchHistoryService.java`, `repository/SearchHistoryRepository.java`, optional request DTO for POST body.

---

## 🗓️ Execution Plan

### Week 1 — Data + API
- **Day 1:** Finalize entity schema, column constraints, and audit fields (auto timestamp on insert).
- **Day 2:** Build repository methods for top-20 ordering and add delete-all helper.
- **Day 3:** Implement service logic for save/get/clear, ensuring it can be called from Iyed’s search flow without extra DTO mapping.
- **Day 4:** Wire up controller routes with validation and descriptive responses.
- **Day 5:** Document the API contract and add a quick smoke test (Postman or unit tests) that covers list, save, and delete scenarios.

### Week 2 — UI + Integrations
- **Day 6:** Structure the history page markup, including nav, header count, list container, and empty state placeholder.
- **Day 7:** Implement `history.js` to fetch history, render cards, show counts, and hide/show clear button appropriately.
- **Day 8:** Add timestamp formatting helper, rerun-on-click logic, and a global `saveToHistory(...)` export.
- **Day 9:** Polish styling with `history.css`, making sure cards animate when hovered or emptied.
- **Day 10:** Coordinate with Emna so URL parameters trigger automatic searches, and verify the clear-all flow with confirmation dialog.

---

## 🔗 API Contract

- **GET /api/history** → returns up to 20 most recent items (query, searchType, resultsCount, searchedAt).
- **POST /api/history** → accepts `{ query, searchType, resultsCount }`, stores entry, and responds with the persisted item.
- **DELETE /api/history** → clears all history rows and returns 200 once done.

Make sure the POST handler is idempotent from Emna’s perspective (she may call it after every search) and that empty query submissions are rejected with a clear error.

---

## 🤝 Collaboration Notes

- **Needs from Emna:** Hook in your `saveToHistory(...)` call after each successful search, and honor your rerun URL parameters when the user lands on `/` with `?q=` and `type=`.
- **Needs from Iyed:** Access to result metadata (type, count) so you can log meaningful entries.
- **What others need from you:** Public JS helpers (`saveToHistory`, `loadHistory`, `reSearch`), a documented response schema, and confidence that clicking a history row will relaunch the search instantly.

---

## ✅ Checklist

- [ ] Entity + repository committed with newest-first helper and delete-all method
- [ ] Service/controller tested for save, list, clear, and bad inputs
- [ ] History page renders list, count badge, empty state, and clear-all control
- [ ] Relative time formatter shows minutes/hours/days correctly
- [ ] Re-run action navigates back to Emna’s search form with prefilled values
- [ ] Clear-all flow hides list, shows empty state, and disables button until new data exists
- [ ] README or API reference updated so the team knows how to log searches

---

**Help users remember every insightful query. 📜**
