# Smart Search Web App - Project Proposal

## 🎯 Project Overview

A simple web application that uses the **Tavily API** to provide enhanced search results with summaries and content extraction. Users can search for topics, view organized results, and save their favorite findings to a personal collection.

## 💡 Why This Project?

- **Simple & Focused**: Core search functionality with basic save feature
- **API Integration**: Uses your Tavily API effectively
- **Easy to Build**: Manageable scope for 3-4 weeks
- **Clear Task Division**: Frontend, Backend, Database - no DevOps complexity
- **Practical**: Useful tool for research and information gathering

## 🏗️ Core Features

### 1. Search Interface
- Simple search bar for entering queries
- Basic filters (search type: general/news)
- Display loading state while searching

### 2. Results Display
- Show search results with titles, URLs, and summaries
- Display content snippets from Tavily
- Clean card-based layout
- Click to view full content

### 3. Save Favorites
- Save interesting results to "My Saved Items"
- View all saved items in one page
- Delete saved items
- Add personal notes to saved items

### 4. Search History
- Simple list of previous searches
- Click to re-run a previous search

---

## 👥 Task Distribution (3 Team Members)

### **Person 1: Frontend Developer**

**Responsibilities**: Build all user-facing pages and components

#### Tasks:
1. **Setup** (Days 1-2)
   - Create HTML/CSS/JavaScript structure (or React if preferred)
   - Set up basic page layout with navigation
   - Create simple styling with CSS/Bootstrap

2. **Search Page** (Days 3-5)
   - Build search form with input field
   - Add search type selector (general/news)
   - Create results display area
   - Show loading spinner during search
   - Display results as cards (title, URL, summary)

3. **Saved Items Page** (Days 6-8)
   - Create "My Saved Items" page
   - Display all saved items in a list
   - Add delete button for each item
   - Show notes field for each saved item

4. **Search History Page** (Days 9-10)
   - Create simple search history list
   - Show previous search queries with timestamps
   - Add click to re-search functionality

5. **Polish** (Days 11-12)
   - Make responsive for mobile
   - Add basic styling improvements
   - Fix any UI bugs

---

### **Person 2: Backend Developer**

**Responsibilities**: Create REST API and integrate Tavily

#### Tasks:
1. **Setup** (Days 1-2)
   - Set up Spring Boot project
   - Configure application.properties
   - Add Tavily API credentials
   - Create basic controller structure

2. **Tavily Integration** (Days 3-5)
   - Create TavilyService class
   - Implement search method calling Tavily API
   - Parse Tavily JSON response
   - Handle errors (API down, rate limits)
   - Return clean data to frontend

3. **Search API** (Days 6-7)
   - Create `/api/search` endpoint (POST)
   - Accept search query and type
   - Call TavilyService
   - Return formatted results

4. **Saved Items API** (Days 8-10)
   - Create `/api/saved-items` endpoints (GET, POST, DELETE)
   - Implement save item logic
   - Implement get all saved items
   - Implement delete item

5. **Search History API** (Days 11-12)
   - Create `/api/history` endpoint (GET, POST)
   - Save each search to history
   - Return history list
   - Basic testing

---

### **Person 3: Database Developer**

**Responsibilities**: Design database and handle data persistence

#### Tasks:
1. **Database Setup** (Days 1-3)
   - Design database schema (2 tables: SavedItems, SearchHistory)
   - Set up H2 database (simple, no installation needed)
   - Create SQL initialization script
   - Configure Spring Data JPA

2. **SavedItems Entity** (Days 4-6)
   - Create SavedItem JPA entity
   - Fields: id, title, url, summary, notes, savedDate
   - Create SavedItemRepository interface
   - Implement CRUD methods
   - Test with sample data

3. **SearchHistory Entity** (Days 7-9)
   - Create SearchHistory JPA entity
   - Fields: id, query, searchType, timestamp
   - Create SearchHistoryRepository interface
   - Implement save and retrieve methods
   - Test with sample data

4. **Integration Support** (Days 10-12)
   - Help backend developer connect to repositories
   - Write simple queries if needed
   - Add any missing database methods
   - Test all database operations
   - Create sample data for demo

---

## 🗄️ Database Schema (Simple!)

```
SavedItems
- id (PK, auto-increment)
- title (String)
- url (String)
- summary (Text)
- notes (Text)
- saved_date (Timestamp)

SearchHistory
- id (PK, auto-increment)
- query (String)
- search_type (String)
- timestamp (Timestamp)
```

---

## 🛠️ Technology Stack (Keep It Simple!)

### Frontend
- **HTML/CSS/JavaScript** (or React if team prefers)
- **Bootstrap** for styling
- **Fetch API** for HTTP requests

### Backend
- **Spring Boot** (Java)
- **H2 Database** (embedded, no setup needed)
- **Spring Data JPA** (easy database access)
- **RestTemplate** or **WebClient** for Tavily API calls

### API
- **Tavily Search API** (you already have this!)

---

## 📅 Timeline (2-3 Weeks)

### Week 1: Core Setup
- Everyone sets up their development environment
- Database: Create schema and entities
- Backend: Set up Spring Boot and Tavily integration
- Frontend: Create basic page structure

### Week 2: Main Features
- Backend: Complete all API endpoints
- Frontend: Build search and results display
- Database: Connect everything and test
- **Integration**: Connect frontend to backend

### Week 3: Finish & Polish
- Frontend: Complete saved items and history pages
- Backend: Fix any bugs
- Database: Ensure all data is saving correctly
- **Everyone**: Test together, fix bugs, prepare demo

---

## 🎯 Success Criteria (Must Have)

1. ✅ User can type a search query and get results from Tavily
2. ✅ Results show title, URL, and summary
3. ✅ User can save a result to "My Saved Items"
4. ✅ User can view all saved items
5. ✅ User can delete saved items
6. ✅ Search history is saved and viewable
7. ✅ Application runs locally without errors

---

## 🚀 Optional Enhancements (If You Finish Early)

- Add notes to saved items
- Filter search results
- Export saved items as text file
- Add pagination for results
- Make it look prettier with better CSS

---

## 📝 Important Notes

- **API Key**: Backend person needs the Tavily API key
- **H2 Database**: No installation needed, it's embedded in Spring Boot
- **CORS**: Backend needs to enable CORS so frontend can call APIs
- **Testing Together**: Plan integration days where everyone works together

---

## 🤝 Collaboration Tips

1. **Share Code**: Use GitHub or GitLab
2. **API Contract**: Backend person should share API endpoints early (URLs, request/response format)
3. **Meet Regularly**: Quick 15-min check-ins every few days
4. **Help Each Other**: If someone finishes early, help others
5. **Test Together**: Don't wait until the end to connect everything

---

## 🎓 What Each Person Learns

- **Frontend Person**: HTML/CSS/JS, API calls, UI design
- **Backend Person**: Spring Boot, REST APIs, external API integration
- **Database Person**: SQL, JPA, data modeling

---

**This is much simpler and totally doable! Focus on getting the basics working first, then add extras if you have time.** 🚀
