# 🔍 Search & Tavily Integration - IYED

## 📋 Feature Overview

You are responsible for the **core search functionality** - the heart of the application. This includes the search input interface, Tavily API integration, and connecting everything together.

---

## 🎯 Your Responsibilities

### Frontend (Search Interface)
- Build the main search page with search bar
- Create search type selector (general/news dropdown)
- Implement loading spinner while searching
- Handle search form submission
- Display error messages if search fails

### Backend (Tavily API Integration)
- Create `TavilyService` class to call Tavily API
- Create `/api/search` REST endpoint
- Parse Tavily API JSON response
- Handle API errors (rate limits, timeouts, etc.)
- Configure CORS for frontend communication

### Database (Search Configuration - Optional)
- Store API configuration if needed
- Help with initial Spring Boot + JPA setup

---

## 📁 Files You'll Create/Modify

### Frontend Files
```
src/main/resources/static/
├── index.html (main search page)
├── css/
│   └── search.css (search page styles)
└── js/
    └── search.js (search functionality)
```

### Backend Files
```
src/main/java/com/googlev1/
├── controller/
│   └── SearchController.java
├── service/
│   └── TavilyService.java
├── dto/
│   ├── SearchRequest.java
│   └── SearchResponse.java
└── config/
    └── CorsConfig.java
```

---

## 📝 Detailed Tasks

### Week 1: Setup & Tavily Integration

#### Days 1-2: Project Setup
- [ ] Set up development environment
- [ ] Add Tavily API key to `application.properties`
- [ ] Add required dependencies to `pom.xml`:
  ```xml
  <!-- For HTTP calls -->
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-webflux</artifactId>
  </dependency>
  ```
- [ ] Create basic folder structure

#### Days 3-5: Tavily Service
- [ ] Create `TavilyService.java`
  ```java
  @Service
  public class TavilyService {
      public SearchResponse search(String query, String searchType) {
          // Call Tavily API
          // Parse response
          // Return results
      }
  }
  ```
- [ ] Test Tavily API connection
- [ ] Handle errors gracefully
- [ ] Create DTO classes for request/response

### Week 2: API & Frontend

#### Days 6-8: Search Controller
- [ ] Create `SearchController.java`
  ```java
  @RestController
  @RequestMapping("/api")
  public class SearchController {
      @PostMapping("/search")
      public ResponseEntity<SearchResponse> search(@RequestBody SearchRequest request) {
          // Call TavilyService
          // Return results
      }
  }
  ```
- [ ] Configure CORS in `CorsConfig.java`
- [ ] Test endpoint with Postman

#### Days 9-12: Frontend Search Page
- [ ] Create `index.html` with search form
  ```html
  <form id="searchForm">
      <input type="text" id="searchQuery" placeholder="Search...">
      <select id="searchType">
          <option value="general">General</option>
          <option value="news">News</option>
      </select>
      <button type="submit">Search</button>
  </form>
  <div id="loading" class="hidden">Searching...</div>
  <div id="results"></div>
  ```
- [ ] Create `search.js` with API call logic
- [ ] Style with Bootstrap or custom CSS
- [ ] Show loading spinner during search

---

## 🔗 API Endpoint Specification

### POST `/api/search`

**Request Body:**
```json
{
    "query": "what is artificial intelligence",
    "searchType": "general"
}
```

**Response:**
```json
{
    "results": [
        {
            "title": "Artificial Intelligence - Wikipedia",
            "url": "https://en.wikipedia.org/wiki/Artificial_intelligence",
            "summary": "AI is intelligence demonstrated by machines...",
            "content": "Full content here..."
        }
    ],
    "query": "what is artificial intelligence",
    "searchType": "general",
    "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🔑 Tavily API Integration

### API Key Setup
Add to `application.properties`:
```properties
tavily.api.key=your-api-key-here
tavily.api.url=https://api.tavily.com/search
```

### Tavily Request Format
```json
{
    "api_key": "your-key",
    "query": "search query",
    "search_depth": "basic",
    "include_answer": true,
    "include_raw_content": false,
    "max_results": 10
}
```

---

## 🤝 Collaboration Points

### You Need From Others:
- **Aziz**: Will consume your search results to display them
- **Louay**: Needs search result format to save items
- **Marwa**: Needs to know when a search is made to save history

### Others Need From You:
- Share the `SearchResponse` DTO structure early
- Document your `/api/search` endpoint
- Notify when search is complete (for history saving)

---

## ✅ Checklist

### Must Have
- [ ] Tavily API integration working
- [ ] `/api/search` endpoint functional
- [ ] Search form on frontend
- [ ] Loading state while searching
- [ ] Error handling for API failures
- [ ] CORS configured properly

### Nice to Have
- [ ] Search suggestions
- [ ] Advanced search options
- [ ] Cache recent searches

---

## 📚 Resources

- [Tavily API Documentation](https://docs.tavily.com/)
- [Spring WebClient Guide](https://docs.spring.io/spring-framework/reference/web/webflux-webclient.html)
- [Bootstrap Forms](https://getbootstrap.com/docs/5.0/forms/overview/)

---

## 💡 Tips

1. **Test Tavily first**: Use Postman to test Tavily API before coding
2. **API Key security**: Never commit API keys to Git
3. **Error messages**: Show user-friendly error messages
4. **Coordinate with Aziz**: He needs your response format to display results

---

**Good luck, Iyed! You're building the core engine of the app! 🚀**
