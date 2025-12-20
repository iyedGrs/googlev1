# 🔍 Search & Tavily API Integration - IYED

## 📋 Feature Overview

You are responsible for the **core search engine** - integrating with Tavily API and creating the search endpoint. This is the heart of the application that everyone else depends on.

---

## 🎯 Your Responsibilities

### Frontend (Support Component)
- Build the **Search Status widget** that sits in the navbar and shows API health, last sync, and cached result count.
- Expose a small toast/alert when the backend returns degraded status so users know to retry later.
- Surface cached suggestions (from the new search cache table) under the search box when Iyed's cached data is available.

### Backend (Primary Focus)
- Create `TavilyService` class to call Tavily API.
- Create `/api/search` REST endpoint.
- Parse Tavily API JSON response and normalize it for the rest of the app.
- Handle API errors (rate limits, timeouts) and expose a `/api/search/status` endpoint the frontend widget can poll.
- Configure CORS for frontend.

### Database (Search Cache & Logging)
- Define the `SearchCacheEntry` JPA entity + repository to store the last N searches with TTL.
- Implement automatic cache cleanup (e.g., scheduled task) so the table does not grow forever.
- Seed reference data (search types) so dropdowns stay consistent across the UI.

---

## 📁 Files You'll Create/Modify

### Backend & Database Files
```
src/main/java/com/googlev1/
├── controller/
│   ├── SearchController.java
│   └── SearchStatusController.java
├── service/
│   ├── TavilyService.java
│   └── SearchCacheService.java
├── dto/
│   ├── SearchRequest.java
│   ├── SearchResponse.java
│   ├── SearchResult.java
│   └── SearchStatusResponse.java
├── entity/
│   └── SearchCacheEntry.java
├── repository/
│   └── SearchCacheRepository.java
└── config/
    ├── CorsConfig.java
    └── TavilyConfig.java
```

### Configuration Files
```
src/main/resources/
└── application.properties
pom.xml (add dependencies)
```

### Frontend Files
```
src/main/resources/static/
├── js/
│   └── search-status.js
└── css/
    └── status.css
```

---

## 📝 Detailed Tasks

### Week 1: Setup, Cache & Tavily Integration

#### Days 1-2: Project Setup
- [ ] Add required dependencies to `pom.xml` (web + WebFlux for WebClient).
- [ ] Configure `application.properties` with Tavily key + base URL.
- [ ] Create CORS configuration

#### Days 3-4: Search Cache Schema
- [ ] Create `SearchCacheEntry.java` JPA entity (query, type, response JSON, expiration timestamp).
- [ ] Create `SearchCacheRepository` with helpers (`findByQueryAndSearchType`, `deleteByExpiresAtBefore`).
- [ ] Implement `SearchCacheService` with methods `getCachedResult`, `saveCacheEntry`, `evictExpiredEntries`.
- [ ] Add Spring `@Scheduled` job (every hour) to purge expired cache rows.

#### Days 5-7: Tavily Service Implementation
- [ ] Create `TavilyService.java` (WebClient config, cache-aware search, status ping helper).
- [ ] Create DTO classes
- [ ] Test API connection
- [ ] Handle errors gracefully

### Week 2: Controller & Testing

#### Days 6-8: Search Controller
- [ ] Create `SearchController.java` exposing `POST /api/search` that delegates to service.
- [ ] Create `SearchStatusController.java` exposing `GET /api/search/status` that returns cache hit ratio, Tavily latency, and timestamp of last successful call.
- [ ] Wire `SearchCacheService` into both controllers so the `/search` endpoint can optionally skip Tavily when cached data is fresh.

#### Days 9-10: Testing & Documentation
- [ ] Test with Postman
- [ ] Document API for team
- [ ] Handle edge cases

### Week 3: Frontend Status Widget

#### Days 11-12: Navbar Badge & Toasts
- [ ] Create `search-status.js` that polls `/api/search/status`, updates a navbar badge, and shows toasts when degraded.
- [ ] Add `<span id="searchStatusBadge"></span>` to the shared navbar markup (coordinate with Emna).
- [ ] Style badge in `status.css` (green for OK, amber/red for degraded) and ensure it works in both desktop + mobile nav.

---

## 🔗 API Endpoint Specification

### POST `/api/search`
- **Request:** JSON payload containing the query text + search type (general/news).
- **Response:** Normalized list of result DTOs (title, url, summary, optional content) plus metadata like query echo, selected type, result count, and timestamp.

### GET `/api/search/status`
- **Response:** Health boolean, Tavily latency metrics, cache hit ratio, and timestamp for the last successful upstream call.

---

## 🔑 Tavily API Details

### Request Format
- API key
- Query string
- Search depth (basic/deep)
- Answer/raw-content flags
- Max results
- Topic filter

---

## 🤝 Collaboration Points

### Others Need From You:
- **Emna**: Needs response format for search UI
- **Aziz**: Needs result structure for display
- **Louay**: Needs result data to save items
- **Marwa**: Needs to know when search completes (for history)
- **Everyone**: Needs the `/api/search/status` contract so they can show service health on their pages if desired.

### Share Early:
- `SearchResponse` and `SearchResult` DTO structures
- API endpoint documentation
- Error response format
- Status polling interval recommendations + JSON schema

---

## ✅ Checklist

### Must Have
- [ ] Tavily API integration working
- [ ] `/api/search` endpoint returns results
- [ ] Error handling for API failures
- [ ] CORS configured for frontend
- [ ] DTOs documented for team
- [ ] Search cache layer with TTL + scheduled purge
- [ ] `/api/search/status` endpoint
- [ ] Navbar status badge wired to live status data

### Nice to Have
- [ ] Request caching
- [ ] Rate limiting
- [ ] Search suggestions

---

## 💡 Tips

1. **Test Tavily first**: Use Postman before coding
2. **API Key security**: Never commit to Git - use environment variables
3. **Share DTOs early**: Team depends on your response format
4. **Notify Marwa**: She needs to save history after search

---

**Good luck, Iyed! You're building the core engine! 🚀**
