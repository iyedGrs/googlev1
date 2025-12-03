# 📊 Results Display & Content Viewer - AZIZ

## 📋 Feature Overview

You own how search results look and how full articles open inside the app. Focus on a clean result grid, a smooth "view content" flow, and smart caching so repeated article opens stay fast.

---

## 🎯 Responsibilities

### Frontend
- Build reusable result card components and a modal-based content viewer.
- Provide pagination, empty-state messaging, and responsive behavior for desktop + mobile.
- Trigger Louay's save action and expose hooks Emna can call after she fetches data.

### Backend
- Offer a `/api/content` read endpoint that returns normalized article data (title, body, word count, fetched timestamp).
- Add cache-first semantics: check storage before invoking Tavily/Jsoup extraction and surface freshness metadata to the UI.

### Database
- Store cached articles with URL, title, cleaned body, and last-fetched timestamp.
- Give the service layer helpers to evict stale rows and to reuse valid cached entries within the agreed TTL (24h by default).

---

## 📁 Target Files

- Frontend: `static/js/results.js`, `static/js/content-viewer.js`, `static/css/results.css`, shared HTML snippet for the modal shell.
- Backend: `controller/ContentController.java`, `service/ContentService.java`, `dto/ContentResponse.java`.
- Persistence: `entity/ContentCacheEntry.java`, `repository/ContentCacheRepository.java`, optional scheduled cleanup class under `tasks/`.

---

## 🗓️ Execution Plan

### Week 1 — Result Surfacing
- **Day 1-2:** Model the cache entity + repository, define TTL constants, and decide how cleanup will run (scheduler vs. manual endpoint).
- **Day 3-4:** Sketch the result card layout and DOM structure, ensuring Emna can drop her data object into `displayResults(...)`.
- **Day 5-6:** Finish the styling layer, empty states, hover interactions, pagination skeleton, and share the CSS tokens with the rest of the UI team.

### Week 2 — Content Modal + API
- **Day 6-8:** Assemble the modal markup + JS controller, including loading states, error fallback, accessibility hooks, and integration with Iyed's search status indicator.
- **Day 9-10:** Implement the `/api/content` controller + service flow, connect it to the cache, and document the JSON response so Louay/Marwa can reuse it if needed.

---

## 🔗 API Contract

- **Endpoint:** `GET /api/content?url={articleUrl}`
- **Request rules:** URL must be encoded; repeated calls within TTL should not hit external services; include `forceRefresh` query param for debugging.
- **Response fields:** url, title, sanitized HTML/text content, word count, fetchedAt timestamp, and a boolean `cached` flag so the UI can show freshness info.

---

## 🤝 Collaboration Notes

- **Needs from Iyed:** Structure of search results, cache TTL guidance, and any extract API nuances.
- **Needs from Emna:** Container IDs and event hooks so her search page can render your cards.
- **Needs from Louay:** Public save handler signature plus any data he expects (title/summary/url).
- **What others need from you:** Reliable `displayResults(...)` export, `save` button integration, and a documented `ContentResponse` schema.

---

## ✅ Checklist

- [ ] Cache entity + repository defined with TTL helpers
- [ ] `/api/content` endpoint returns normalized payload + cache metadata
- [ ] Result grid handles real data, empty states, and pagination
- [ ] Modal viewer shows loader, error, and success states
- [ ] Save button delegates to Louay's API without blocking the modal
- [ ] Collaboration notes shared in the README section for cross-team visibility

---

**Make the results shine and keep the reading flow buttery smooth. 💡**
