# Project Structure Documentation

## Backend Organization

```
src/main/java/com/googlev1/
├── config/              # Spring configuration classes
│   └── CorsConfig.java              # CORS configuration for API
├── controller/          # REST API endpoints
│   ├── PreferenceController.java    # User preference endpoints
│   ├── NavigationController.java    # Navigation endpoints
│   └── SavedItemController.java     # Saved items endpoints
├── dto/                 # Data Transfer Objects
│   ├── PreferenceRequest.java
│   ├── PreferenceResponse.java
│   ├── NavigationResponse.java
│   ├── SavedItemRequest.java
│   ├── SavedItemResponse.java
│   └── UpdateNotesRequest.java
├── entity/              # JPA Entity classes
│   ├── UserPreference.java
│   └── SavedItem.java
├── repository/          # Data access layer
│   ├── PreferenceRepository.java
│   └── SavedItemRepository.java
├── service/             # Business logic layer
│   ├── PreferenceService.java
│   └── SavedItemService.java
└── utils/               # Utility classes (for future use)
```

### Backend Layers Explanation

1. **Controller** - Handles HTTP requests and responses
2. **Service** - Contains business logic and validation
3. **Repository** - Handles database operations
4. **Entity** - Defines database schema
5. **DTO** - Data transfer between client and server
6. **Config** - Application configuration (CORS, database, etc.)

---

## Frontend Organization

```
src/main/resources/static/
├── pages/               # HTML pages
│   ├── index.html               # Search page (landing page)
│   ├── saved.html               # Saved items page
│   └── history.html             # Search history page
├── js/                  # JavaScript files
│   ├── core/
│   │   └── app.js               # Global initialization, navigation, preferences
│   ├── pages/
│   │   ├── search.js            # Search page logic
│   │   ├── saved.js             # Saved items page logic
│   │   └── history.js           # History page logic
│   └── utils/                   # Utility functions (for future use)
├── css/                 # Stylesheets
│   ├── common/
│   │   └── style.css            # Global styles, typography, layout
│   └── pages/
│       ├── search.css           # Search page styles
│       ├── saved.css            # Saved items page styles
│       └── history.css          # History page styles
├── components/          # Reusable HTML components (for future use)
└── assets/              # Images, icons, fonts
    ├── images/
    └── icons/
```

### Frontend Architecture

**Core Layer (js/core/app.js)**
- Navigation loading from `/api/navigation`
- User preferences management
- Theme switching
- Toast notifications
- Utility functions

**Page Layer (js/pages/\*.js)**
- Page-specific logic
- API calls
- Form handling
- Event listeners

**Styling**
- `style.css`: Global styles, colors, typography, responsive design
- `search.css`: Search page specific styling
- `saved.css`: Saved items page styling
- `history.css`: History page styling

---

## API Endpoints

### Preferences API
```
GET  /api/preferences/search          # Get user preferences
PUT  /api/preferences/search          # Update user preferences
```

### Navigation API
```
GET  /api/navigation                  # Get navigation links
```

### Saved Items API (Louay)
```
GET    /api/saved-items               # Get all saved items
POST   /api/saved-items               # Save new item
PUT    /api/saved-items/{id}/notes    # Update notes
DELETE /api/saved-items/{id}          # Delete item
GET    /api/saved-items/check         # Check if URL exists
```

### Search API (Iyed - to be implemented)
```
POST /api/search                      # Perform search
GET  /api/search/status               # Get search status
```

### History API (Marwa - to be implemented)
```
GET    /api/history                   # Get search history
POST   /api/history                   # Save search to history
DELETE /api/history/{id}              # Delete history item
DELETE /api/history                   # Clear all history
```

---

## File Dependencies

### index.html (Search Page)
- `../css/common/style.css` - Global styles
- `../css/pages/search.css` - Search page styles
- `../js/core/app.js` - Navigation and preferences
- `../js/pages/search.js` - Search logic

### saved.html (Saved Items Page)
- `../css/common/style.css` - Global styles
- `../css/pages/saved.css` - Saved items styles
- `../js/core/app.js` - Navigation
- `../js/pages/saved.js` - Saved items logic

### history.html (History Page)
- `../css/common/style.css` - Global styles
- `../css/pages/history.css` - History styles
- `../js/core/app.js` - Navigation
- `../js/pages/history.js` - History logic

---

## Development Guide

### Adding a New Page

1. Create `pages/newpage.html`
2. Create `css/pages/newpage.css`
3. Create `js/pages/newpage.js`
4. Update navigation in `NavigationController.java`
5. Link CSS and JS files in HTML header and footer

### Adding a New Backend Feature

1. Create entity in `entity/`
2. Create repository in `repository/`
3. Create service in `service/`
4. Create controller in `controller/`
5. Create DTOs in `dto/`

### Styling Best Practices

- Use `style.css` for global styles
- Use page-specific CSS for page layout
- Mobile-first responsive design
- Support both light and dark themes
- Use CSS variables for colors and spacing

---

## Server Configuration

- **Port**: 8081 (configured in `application.properties`)
- **Database**: H2 in-memory (dev), upgradeable to PostgreSQL
- **CORS**: Enabled for all origins
- **Base Path**: `http://localhost:8081/`
- **Static Files**: Served from `/` (pages accessible directly)
- **API Routes**: All under `/api/` prefix

---

## Running the Application

```bash
# From googlev1 directory
mvn spring-boot:run

# Then access in browser
http://localhost:8081/        # Search page
http://localhost:8081/saved.html  # Saved items
http://localhost:8081/history.html # History
```

---

## Next Steps

1. **Iyed** - Implement `/api/search` endpoint
2. **Aziz** - Implement results display component
3. **Marwa** - Implement `/api/history` endpoint
4. **Team** - Integrate all modules together
5. **QA** - Test full end-to-end flow
