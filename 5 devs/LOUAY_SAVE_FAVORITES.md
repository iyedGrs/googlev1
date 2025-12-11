# ⭐ Save Favorites Feature - LOUAY

## 📋 Feature Overview

Own the full experience of letting users keep, annotate, and revisit their favorite search results. The feature spans a saved-items page, toast notifications for feedback, and backend logic that prevents duplicates.

---

## 🎯 Responsibilities

### Frontend
- Build the `saved.html` page with list, empty state, and responsive layout.
- Provide note editing, delete confirmation, and a public `saveItem(...)` helper that Aziz can trigger from result cards.
- Surface lightweight toast notifications so users know when an item is saved, skipped as duplicate, or deleted.

### Backend
- Deliver a `/api/saved-items` REST surface that supports list, create, update notes, delete, and duplicate checks.
- Enforce unique URLs, return helpful error messages, and expose a dedicated `/check` endpoint so the UI can gray out buttons when needed.

### Database
- Model the `SavedItem` entity with title, url, summary, notes, and timestamps.
- Provide repository helpers for newest-first ordering and fast existence checks.

---

## 📁 Target Files

- Frontend: `static/saved.html`, `static/js/saved.js`, `static/css/saved.css`, optional shared toast component.
- Backend: `controller/SavedItemController.java`, `service/SavedItemService.java`, `dto/SavedItemRequest.java` (or record), `repository/SavedItemRepository.java`.
- Config: ensure `application.properties` exposes the right H2 settings while also keeping room for future Postgres swap.

---

## 🗓️ Execution Plan

### Week 1 — Data + API
- **Day 1:** Finalize entity schema, column constraints, and TTL decisions for saved timestamps.
- **Day 2:** Build repository methods (order by saved date, existsByUrl, optional search by keyword) and add migrations if needed.
- **Day 3:** Implement service logic for create/read/update/delete, including guard rails for duplicates and descriptive exceptions.
- **Day 4:** Wire up the REST controller, response models, and validation, then document each endpoint and status code.
- **Day 5:** Add integration tests or Postman collection to validate CRUD, notes editing, and duplicate handling.

### Week 2 — UI + Integration
- **Day 6:** Structure `saved.html` with header, count badge, empty state, and container for cards.
- **Day 7:** Implement `saved.js` to load items, render cards, bind textarea change events, and expose global helpers (`saveItem`, `showToast`).
- **Day 8:** Style the page via `saved.css`, focusing on readability, mobile layouts, and transitions.
- **Day 9:** Connect delete/notes actions to backend endpoints, handle optimistic updates, and confirm toasts fire correctly.
- **Day 10:** QA the flow with Aziz’s result cards and Marwa’s history rerun, making sure saved status persists across navigation.

---

## 🔗 API Contract

- **GET /api/saved-items** → returns newest-first list with metadata (id, title, url, summary, notes, savedDate).
- **POST /api/saved-items** → accepts title, url, summary; rejects duplicates with 400 and friendly message.
- **PUT /api/saved-items/{id}/notes** → updates only the notes field; returns the updated item.
- **DELETE /api/saved-items/{id}** → removes an item and returns 200 with no body.
- **GET /api/saved-items/check?url={url}** → returns true/false so the UI can disable the save button.

Document the JSON contracts in README or an API reference so teammates can call them confidently.

---

## 🤝 Collaboration Notes

- **Needs from Aziz:** Hook into his result cards so `saveItem(...)` receives title/url/summary and displays the correct toast message.
- **Needs from Emna:** Navigation link placement and shared styles so the saved page matches the search page shell.
- **What others need from you:** Public JS functions (`saveItem`, `showToast`), knowledge of duplicate handling, and the ability to query saved status without visiting the saved page.

---

## ✅ Checklist

- [x] Entity + repository committed with migrations or schema notes
- [x] Service + controller return clear success and error payloads
- [x] Saved page renders list, empty state, and count badge
- [x] Notes autosave without page reload
- [x] Delete flow confirms action and updates UI instantly
- [x] Toast notifications cover success, duplicate, and failure cases
- [x] Documentation shared so Aziz and Emna know how to call your helpers

---

**Help users keep their best finds organized and delightful. ⭐**
