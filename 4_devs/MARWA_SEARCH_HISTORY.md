# 📜 Search History Feature - MARWA

## 📋 Feature Overview

You are responsible for the **Search History** functionality - tracking all searches made by users, displaying search history, and allowing users to quickly re-run previous searches.

---

## 🎯 Your Responsibilities

### Frontend (Search History Page)
- Create "Search History" page
- Display all previous searches with timestamps
- Implement "Re-search" click functionality
- Add clear history option
- Create history preview on main page (optional)

### Backend (Search History API)
- Create `/api/history` endpoints
- Auto-save searches when performed
- Connect to database through repository

### Database (SearchHistory Entity)
- Create `SearchHistory` JPA entity
- Create `SearchHistoryRepository` interface
- Design SearchHistory table schema
- Write queries (recent searches, etc.)

---

## 📁 Files You'll Create/Modify

### Frontend Files
```
src/main/resources/static/
├── history.html (Search History page)
├── css/
│   └── history.css (history page styling)
└── js/
    └── history.js (history functionality)
```

### Backend Files
```
src/main/java/com/googlev1/
├── controller/
│   └── SearchHistoryController.java
├── service/
│   └── SearchHistoryService.java
├── entity/
│   └── SearchHistory.java
├── repository/
│   └── SearchHistoryRepository.java
└── dto/
    └── SearchHistoryResponse.java
```

---

## 📝 Detailed Tasks

### Week 1: Database & Backend Setup

#### Days 1-3: Database Entity
- [ ] Create `SearchHistory.java` entity
  ```java
  @Entity
  @Table(name = "search_history")
  public class SearchHistory {
      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;
      
      @Column(nullable = false)
      private String query;
      
      @Column(name = "search_type")
      private String searchType;
      
      @Column(name = "results_count")
      private Integer resultsCount;
      
      @Column(name = "searched_at")
      private LocalDateTime searchedAt;
      
      // Getters and Setters
  }
  ```
- [ ] Create `SearchHistoryRepository.java`
  ```java
  @Repository
  public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
      List<SearchHistory> findTop20ByOrderBySearchedAtDesc();
      List<SearchHistory> findByQueryContainingIgnoreCase(String query);
      void deleteAllBySearchedAtBefore(LocalDateTime date);
  }
  ```
- [ ] Test with H2 console

#### Days 4-5: Service Layer
- [ ] Create `SearchHistoryService.java`
  ```java
  @Service
  public class SearchHistoryService {
      public SearchHistory saveSearch(String query, String searchType, int resultsCount);
      public List<SearchHistory> getRecentSearches();
      public List<SearchHistory> searchInHistory(String keyword);
      public void clearAllHistory();
      public void deleteOldHistory(int daysOld);
  }
  ```

### Week 2: API & Frontend

#### Days 6-8: REST Controller
- [ ] Create `SearchHistoryController.java`
  ```java
  @RestController
  @RequestMapping("/api/history")
  public class SearchHistoryController {
      
      @GetMapping
      public List<SearchHistory> getRecentSearches();
      
      @PostMapping
      public SearchHistory saveSearch(@RequestBody SearchHistoryRequest request);
      
      @DeleteMapping
      public void clearHistory();
      
      @GetMapping("/search")
      public List<SearchHistory> searchInHistory(@RequestParam String keyword);
  }
  ```
- [ ] Test all endpoints with Postman

#### Days 9-12: Frontend Implementation
- [ ] Create `history.html` page
  ```html
  <div class="container">
      <div class="history-header">
          <h1>Search History</h1>
          <button id="clearHistoryBtn" class="btn-danger">
              Clear All History
          </button>
      </div>
      <div id="historyList"></div>
  </div>
  ```
- [ ] Create `history.js` for functionality
- [ ] Implement re-search on click
- [ ] Add clear history with confirmation
- [ ] Style with CSS
- [ ] Add navigation to history page

---

## 🔗 API Endpoint Specifications

### GET `/api/history`
Get recent search history (last 20 searches).

**Response:**
```json
[
    {
        "id": 1,
        "query": "artificial intelligence",
        "searchType": "general",
        "resultsCount": 10,
        "searchedAt": "2024-01-15T10:30:00Z"
    },
    {
        "id": 2,
        "query": "latest tech news",
        "searchType": "news",
        "resultsCount": 8,
        "searchedAt": "2024-01-15T09:15:00Z"
    }
]
```

### POST `/api/history`
Save a new search to history.

**Request:**
```json
{
    "query": "machine learning",
    "searchType": "general",
    "resultsCount": 10
}
```

### DELETE `/api/history`
Clear all search history.

### GET `/api/history/search?keyword={keyword}`
Search within history.

**Response:** Same format as GET `/api/history`

---

## 🗄️ Database Schema

```sql
CREATE TABLE search_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    query VARCHAR(500) NOT NULL,
    search_type VARCHAR(50) DEFAULT 'general',
    results_count INT,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX idx_searched_at ON search_history(searched_at DESC);
```

---

## 🎨 UI Components

### History Item
```html
<div class="history-item" data-id="1" data-query="AI" data-type="general">
    <div class="history-content" onclick="reSearch(this)">
        <span class="history-icon">🔍</span>
        <div class="history-details">
            <span class="history-query">artificial intelligence</span>
            <span class="history-meta">
                General • 10 results • 2 hours ago
            </span>
        </div>
    </div>
    <button class="btn-delete-single" onclick="deleteHistoryItem(1)">
        ✕
    </button>
</div>
```

### CSS Styling
```css
.history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: white;
    border-radius: 8px;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: background 0.2s;
}

.history-item:hover {
    background: #f8f9fa;
}

.history-query {
    font-size: 16px;
    font-weight: 500;
    color: #1a0dab;
}

.history-meta {
    font-size: 13px;
    color: #666;
}

.history-icon {
    font-size: 20px;
    margin-right: 15px;
}

.btn-danger {
    background: #dc3545;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}
```

---

## 🤝 Collaboration Points

### You Need From Others:
- **Iyed**: Needs to call your save function after each search
- Get search query, type, and results count from search

### Others Need From You:
- Provide a function/endpoint that Iyed can call to save history
- Share history page URL for navigation

### Integration with Search (Iyed's work)
```javascript
// Iyed should call this after a successful search
async function saveToHistory(query, searchType, resultsCount) {
    await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            query, 
            searchType, 
            resultsCount 
        })
    });
}

// In Iyed's search.js, after getting results:
// saveToHistory(query, searchType, results.length);
```

### Re-search Function
```javascript
// When user clicks on a history item
function reSearch(element) {
    const query = element.dataset.query;
    const type = element.dataset.type;
    
    // Redirect to search page with query
    window.location.href = `/?q=${encodeURIComponent(query)}&type=${type}`;
}
```

---

## ✅ Checklist

### Must Have
- [ ] SearchHistory entity and repository working
- [ ] GET and POST endpoints functional
- [ ] History page displays recent searches
- [ ] Click to re-run a search works
- [ ] Clear all history works
- [ ] Integration with search (auto-save)

### Nice to Have
- [ ] Delete individual history items
- [ ] Search within history
- [ ] Show "time ago" format (e.g., "2 hours ago")
- [ ] Limit history to last 30 days
- [ ] Recent searches preview on main page

---

## 📚 Resources

- [Spring Data JPA Guide](https://spring.io/guides/gs/accessing-data-jpa/)
- [LocalDateTime in Java](https://www.baeldung.com/java-8-date-time-intro)
- [JavaScript Date Formatting](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

---

## 💡 Tips

1. **Coordinate with Iyed**: He needs to call your save function
2. **Time formatting**: Use "2 hours ago" instead of full timestamps
3. **Don't duplicate**: Consider not saving identical consecutive searches
4. **Clear confirmation**: Always ask before clearing all history
5. **Responsive**: Make sure history looks good on mobile

---

## 🔧 Time Ago Helper

```javascript
function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }
    
    return 'Just now';
}
```

---

## 🧭 Navigation Component

Add to all pages for easy navigation:
```html
<nav class="navbar">
    <a href="/" class="nav-link">🔍 Search</a>
    <a href="/saved.html" class="nav-link">⭐ Saved Items</a>
    <a href="/history.html" class="nav-link active">📜 History</a>
</nav>
```

---

**Good luck, Marwa! Help users remember what they searched for! 📜**
