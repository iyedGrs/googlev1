# 🖥️ Search Interface UI - EMNA

## 📋 Feature Overview
Own the primary search experience: landing page layout, shared navigation, and user preference storage that supports the rest of the app.

---

## 🎯 Responsibilities

### Frontend
- Build the search hero, input form, filter dropdown, loading + error states.
- Provide a reusable navigation bar consumed by Saved Items and History pages.
- Drive `/api/search` calls, coordinate with Aziz for rendering results, and notify Marwa for history logging.
- Surface cached suggestions from Iyed’s status endpoint under the input field.

### Backend
- Deliver `/api/preferences/search` (GET/PUT) for user defaults.
- Deliver `/api/navigation` so every page renders nav links + badge text from one source of truth.

### Database
- Define the `UserPreference` entity (default query/type, theme, helper toggles, timestamps).
- Implement repository + service helpers that fetch the latest defaults and persist updates with validation.

---

## 📁 Key Files
- Frontend: `index.html`, `css/style.css`, `css/search.css`, `js/app.js`, `js/search.js`.
- Backend: `PreferenceController`, `PreferenceService`.
- Database: `UserPreference` entity + repository.

---

## 📝 Detailed Tasks

### Week 1 – Preferences & Skeleton
1. Model the `UserPreference` entity, repository, and service (load most recent record, save updates, seed defaults).
2. Ship `/api/preferences/search` and `/api/navigation` endpoints.
3. Set up the static asset structure, base HTML template, and placeholder navigation.

### Week 2 – Search Experience
1. Build the search form UI (hero, input, dropdown, submission button, loading/error hints).
2. Wire `search.js` to: validate input, call `/api/search`, show loading state, hand results to Aziz, trigger Marwa’s `saveToHistory` helper, and handle failures gracefully.
3. Load preferences on page init (prefill fields, apply theme, toggle helper tips) and persist user edits via the PUT endpoint.
4. Render the nav bar dynamically from `/api/navigation`, reserving a slot for Iyed’s status badge.

### Week 3 – Polish & Responsiveness
1. Finalize responsive + accessible styling (mobile nav, focus states, aria-live for errors/loading).
2. Add a small preferences panel (theme toggle, “show advanced tips” switch) that updates the stored defaults.
3. QA the full flow end-to-end (search → results → history → saved items navigation).

---

## 🔗 API Contracts
- **GET `/api/preferences/search`** → returns latest defaults (query, type, theme, helper toggle, timestamps).
- **PUT `/api/preferences/search`** → accepts updated defaults and persists them.
- **GET `/api/navigation`** → returns ordered nav links (label, href, icon) plus badge text placeholder for Iyed’s widget.

---

## 🤝 Collaboration Notes
- **Need from Iyed:** `/api/search` + `/api/search/status` payloads (results + badge data/suggestions).
- **Need from Aziz:** `displayResults()` hook and any required container IDs/classes.
- **Need from Marwa:** URL parameter contract for re-running history entries.
- **Provide to everyone:** Shared nav data, preference APIs, consistent `#resultsContainer` target, and search form events.

---

## ✅ Checklist
- [ ] Preferences entity/repository/service complete.
- [ ] `/api/preferences/search` + `/api/navigation` live.
- [ ] Base page layout + navigation wired into Saved/History pages.
- [ ] Search form submits to backend with proper loading/error states.
- [ ] User defaults persist + restore correctly.
- [ ] Responsive + accessible styling verified.

### Nice to Have
- Search suggestions/autocomplete, recent search dropdown, dark mode toggle, keyboard shortcuts.

---

**You set the tone for the whole product—make it delightful! 🎨**
  .search-form {
      max-width: 700px;
      margin: 0 auto 40px;
  }
  
  .search-input-wrapper {
      display: flex;
      gap: 10px;
      background: white;
      padding: 8px;
      border-radius: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  #searchQuery {
      flex: 1;
      border: none;
      padding: 15px 20px;
      font-size: 16px;
      outline: none;
      border-radius: 25px;
  }
  
  .search-type {
      border: 1px solid #ddd;
      padding: 10px 15px;
      border-radius: 20px;
      background: #f8f9fa;
      cursor: pointer;
  }
  
  .btn-search {
      background: #4285f4;
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 25px;
      cursor: pointer;
      font-weight: bold;
      transition: background 0.2s;
  }
  
  .btn-search:hover {
      background: #3367d6;
  }
  
  /* Loading Spinner */
  .loading {
      text-align: center;
      padding: 40px;
  }
  
  .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #4285f4;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 15px;
  }
  
  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }
  
  .hidden {
      display: none !important;
  }
  
  /* Responsive */
  @media (max-width: 600px) {
      .search-input-wrapper {
          flex-direction: column;
          border-radius: 15px;
      }
      
      .btn-search {
          width: 100%;
      }
  }
  ```

---

## 🎨 UI Components

### Navigation Bar
```css
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 30px;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-brand {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    text-decoration: none;
}

.nav-links {
    display: flex;
    gap: 20px;
}

.nav-link {
    color: #666;
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 20px;
    transition: all 0.2s;
}

.nav-link:hover, .nav-link.active {
    background: #f0f0f0;
    color: #333;
}
```

### Global Styles (`style.css`)
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    background: #f5f5f5;
    min-height: 100vh;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.error-message {
    background: #fee;
    color: #c00;
    padding: 15px 20px;
    border-radius: 8px;
    margin: 20px 0;
    text-align: center;
}
```

---

## 🔗 API Endpoints You Own

### GET `/api/preferences/search`
Returns the most recent preference record.

```json
{
    "defaultQuery": "latest ai news",
    "defaultType": "news",
    "theme": "light",
    "showAdvancedTips": true,
    "updatedAt": "2024-01-15T09:20:00Z"
}
```

### PUT `/api/preferences/search`
```json
{
    "defaultQuery": "cloud security trends",
    "defaultType": "general",
    "theme": "dark",
    "showAdvancedTips": false
}
```

### GET `/api/navigation`
```json
{
    "links": [
        { "href": "/", "label": "Search", "icon": "🔍" },
        { "href": "/saved.html", "label": "Saved", "icon": "⭐" },
        { "href": "/history.html", "label": "History", "icon": "📜" }
    ],
    "statusText": "API: OK"
}
```

---

## 🤝 Collaboration Points

### You Need From Others:
- **Iyed**: API endpoint URL and response format
- **Aziz**: His `displayResults()` function to show results
- **Iyed**: `/api/search/status` to show health + cached suggestions
- **Marwa**: Query params contract so the re-search links populate your form correctly

### Others Need From You:
- **Aziz**: The `#resultsContainer` div for displaying results
- **Marwa**: Call her `saveToHistory()` after search
- **Everyone**: Navigation bar component
- **Entire team**: `/api/navigation` + `/api/preferences/search` endpoints so they can stay in sync with layout choices

### Share With Team:
- Base CSS classes and variables
- Navigation HTML component
- Loading/error utility functions
- Preference DTO + validation rules

---

## ✅ Checklist

### Must Have
- [ ] Search form works
- [ ] Loading spinner shows during search
- [ ] Error messages display
- [ ] Navigation to all pages
- [ ] Responsive on mobile
- [ ] Clean, professional design
- [ ] Preferences entity + API wired to UI
- [ ] `/api/navigation` used across pages
- [ ] User selections persisted via `PUT /api/preferences/search`

### Nice to Have
- [ ] Search suggestions/autocomplete
- [ ] Recent searches dropdown
- [ ] Dark mode toggle
- [ ] Keyboard shortcuts (Enter to search)

---

## 💡 Tips

1. **Coordinate with Iyed**: Get API format early
2. **Leave space for Aziz**: He'll add results to `#resultsContainer`
3. **Consistent styling**: Others will follow your CSS patterns
4. **Mobile first**: Design for small screens first

---

**Good luck, Emna! You're creating the first impression! 🎨**
