# ⭐ Save Favorites Feature - LOUAY

## 📋 Feature Overview

You are responsible for the **Save Favorites** functionality - allowing users to save interesting search results, view their saved items, delete them, and add personal notes.

---

## 🎯 Your Responsibilities

### Frontend (Saved Items Page)
- Create "My Saved Items" page
- Display all saved items in a list/grid
- Add delete functionality for each item
- Implement notes adding/editing feature
- Create save button functionality (in result cards)

### Backend (Saved Items API)
- Create `/api/saved-items` CRUD endpoints
- Implement save, get, update, delete logic
- Connect to database through repository

### Database (SavedItems Entity)
- Create `SavedItem` JPA entity
- Create `SavedItemRepository` interface
- Design SavedItems table schema
- Write database queries

---

## 📁 Files You'll Create/Modify

### Frontend Files
```
src/main/resources/static/
├── saved.html (My Saved Items page)
├── css/
│   └── saved.css (saved items styling)
└── js/
    └── saved.js (saved items functionality)
```

### Backend Files
```
src/main/java/com/googlev1/
├── controller/
│   └── SavedItemController.java
├── service/
│   └── SavedItemService.java
├── entity/
│   └── SavedItem.java
├── repository/
│   └── SavedItemRepository.java
└── dto/
    └── SavedItemRequest.java
```

---

## 📝 Detailed Tasks

### Week 1: Database & Backend Setup

#### Days 1-3: Database Entity
- [ ] Create `SavedItem.java` entity
  ```java
  @Entity
  @Table(name = "saved_items")
  public class SavedItem {
      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;
      
      private String title;
      private String url;
      
      @Column(columnDefinition = "TEXT")
      private String summary;
      
      @Column(columnDefinition = "TEXT")
      private String notes;
      
      @Column(name = "saved_date")
      private LocalDateTime savedDate;
      
      // Getters and Setters
  }
  ```
- [ ] Create `SavedItemRepository.java`
  ```java
  @Repository
  public interface SavedItemRepository extends JpaRepository<SavedItem, Long> {
      List<SavedItem> findAllByOrderBySavedDateDesc();
      Optional<SavedItem> findByUrl(String url);
  }
  ```
- [ ] Configure H2 database in `application.properties`

#### Days 4-5: Service Layer
- [ ] Create `SavedItemService.java`
  ```java
  @Service
  public class SavedItemService {
      public SavedItem saveItem(SavedItemRequest request);
      public List<SavedItem> getAllSavedItems();
      public SavedItem updateNotes(Long id, String notes);
      public void deleteItem(Long id);
      public boolean isAlreadySaved(String url);
  }
  ```

### Week 2: API & Frontend

#### Days 6-8: REST Controller
- [ ] Create `SavedItemController.java`
  ```java
  @RestController
  @RequestMapping("/api/saved-items")
  public class SavedItemController {
      
      @GetMapping
      public List<SavedItem> getAllSavedItems();
      
      @PostMapping
      public SavedItem saveItem(@RequestBody SavedItemRequest request);
      
      @PutMapping("/{id}/notes")
      public SavedItem updateNotes(@PathVariable Long id, @RequestBody String notes);
      
      @DeleteMapping("/{id}")
      public void deleteItem(@PathVariable Long id);
      
      @GetMapping("/check")
      public boolean isAlreadySaved(@RequestParam String url);
  }
  ```
- [ ] Test all endpoints with Postman

#### Days 9-12: Frontend Implementation
- [ ] Create `saved.html` page
  ```html
  <div class="container">
      <h1>My Saved Items</h1>
      <div id="savedItemsCount">0 items saved</div>
      <div id="savedItemsList"></div>
  </div>
  ```
- [ ] Create `saved.js` for functionality
- [ ] Implement save button click handler (for result cards)
- [ ] Create notes editing modal
- [ ] Add delete confirmation dialog
- [ ] Style with CSS

---

## 🔗 API Endpoint Specifications

### GET `/api/saved-items`
Get all saved items.

**Response:**
```json
[
    {
        "id": 1,
        "title": "Article Title",
        "url": "https://example.com/article",
        "summary": "Article summary...",
        "notes": "My personal notes about this",
        "savedDate": "2024-01-15T10:30:00Z"
    }
]
```

### POST `/api/saved-items`
Save a new item.

**Request:**
```json
{
    "title": "Article Title",
    "url": "https://example.com/article",
    "summary": "Article summary..."
}
```

### PUT `/api/saved-items/{id}/notes`
Update notes for an item.

**Request:**
```json
{
    "notes": "Updated notes here"
}
```

### DELETE `/api/saved-items/{id}`
Delete a saved item.

### GET `/api/saved-items/check?url={url}`
Check if a URL is already saved (returns true/false).

---

## 🗄️ Database Schema

```sql
CREATE TABLE saved_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    url VARCHAR(2000) NOT NULL,
    summary TEXT,
    notes TEXT,
    saved_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎨 UI Components

### Saved Item Card
```html
<div class="saved-item-card" data-id="1">
    <div class="saved-item-header">
        <h3 class="saved-item-title">
            <a href="url" target="_blank">Title</a>
        </h3>
        <span class="saved-date">Saved on Jan 15, 2024</span>
    </div>
    <p class="saved-item-summary">Summary text...</p>
    <div class="notes-section">
        <label>My Notes:</label>
        <textarea class="notes-input">User's notes here...</textarea>
        <button class="btn-save-notes">Save Notes</button>
    </div>
    <div class="saved-item-actions">
        <button class="btn-delete">🗑️ Delete</button>
    </div>
</div>
```

### CSS Styling
```css
.saved-item-card {
    background: white;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.btn-delete {
    background: #dc3545;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
}

.btn-delete:hover {
    background: #c82333;
}

.notes-input {
    width: 100%;
    min-height: 80px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    resize: vertical;
}
```

---

## 🤝 Collaboration Points

### You Need From Others:
- **Aziz**: Needs to include "Save" button in result cards
- **Iyed**: Search result data format to know what to save

### Others Need From You:
- Share the save item request format
- Provide save button click handler function
- Tell Aziz what data you need when saving

### Integration with Result Cards (Aziz's work)
```javascript
// This function should be called when Save button is clicked
async function saveItem(title, url, summary) {
    const response = await fetch('/api/saved-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, url, summary })
    });
    
    if (response.ok) {
        showToast('Item saved successfully!');
        // Change button to "Saved ✓"
    }
}
```

---

## ✅ Checklist

### Must Have
- [ ] SavedItem entity and repository working
- [ ] All CRUD endpoints functional
- [ ] "My Saved Items" page displays saved items
- [ ] Save button works on result cards
- [ ] Delete functionality works
- [ ] Notes can be added/edited

### Nice to Have
- [ ] Check if already saved (prevent duplicates)
- [ ] Export saved items as text/JSON
- [ ] Search within saved items
- [ ] Sort by date or title

---

## 📚 Resources

- [Spring Data JPA Guide](https://spring.io/guides/gs/accessing-data-jpa/)
- [H2 Database Setup](https://www.baeldung.com/spring-boot-h2-database)
- [REST API Best Practices](https://restfulapi.net/)

---

## 💡 Tips

1. **Test database first**: Use H2 console to verify data is saving
2. **Coordinate with Aziz**: He builds the cards, you build the save logic
3. **Handle duplicates**: Check if URL already saved before adding
4. **Delete confirmation**: Always ask "Are you sure?" before deleting
5. **Notes auto-save**: Consider auto-saving notes as user types

---

## 🔧 H2 Database Console

Access at: `http://localhost:8080/h2-console`

Add to `application.properties`:
```properties
spring.datasource.url=jdbc:h2:mem:searchdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

**Good luck, Louay! Users will love saving their favorite finds! ⭐**
