# Save Favorites API Documentation

## Base URL
```
http://localhost:8081/api/saved-items
```

---

## Endpoints

### 1. Get All Saved Items
**GET** `/api/saved-items`

Returns a list of all saved items, ordered by saved date (newest first).

**Response: 200 OK**
```json
[
  {
    "id": 1,
    "title": "Understanding Spring Boot",
    "url": "https://spring.io/guides/gs/spring-boot/",
    "summary": "A comprehensive guide to building applications with Spring Boot",
    "notes": "Great resource for beginners",
    "savedDate": "2025-12-07T15:30:00"
  }
]
```

---

### 2. Save New Item
**POST** `/api/saved-items`

Saves a new item to favorites. Prevents duplicate URLs.

**Request Body**
```json
{
  "title": "Article Title",
  "url": "https://example.com/article",
  "summary": "Brief summary of the article"
}
```

**Response: 201 Created**
```json
{
  "id": 2,
  "title": "Article Title",
  "url": "https://example.com/article",
  "summary": "Brief summary of the article",
  "notes": null,
  "savedDate": "2025-12-07T16:00:00"
}
```

**Response: 400 Bad Request** (Duplicate URL)
```json
{
  "error": "This URL is already saved"
}
```

---

### 3. Update Notes
**PUT** `/api/saved-items/{id}/notes`

Updates the personal notes for a saved item.

**Path Parameters**
- `id` (Long) - The ID of the saved item

**Request Body**
```json
{
  "notes": "Updated notes content"
}
```

**Response: 200 OK**
```json
{
  "id": 1,
  "title": "Understanding Spring Boot",
  "url": "https://spring.io/guides/gs/spring-boot/",
  "summary": "A comprehensive guide to building applications with Spring Boot",
  "notes": "Updated notes content",
  "savedDate": "2025-12-07T15:30:00"
}
```

**Response: 404 Not Found**
```json
{
  "error": "Saved item not found"
}
```

---

### 4. Delete Item
**DELETE** `/api/saved-items/{id}`

Deletes a saved item.

**Path Parameters**
- `id` (Long) - The ID of the saved item

**Response: 200 OK**
```
(Empty body)
```

**Response: 404 Not Found**
```json
{
  "error": "Saved item not found"
}
```

---

### 5. Check URL Exists
**GET** `/api/saved-items/check?url={url}`

Checks if a URL is already saved. Useful for disabling save buttons in the UI.

**Query Parameters**
- `url` (String) - The URL to check

**Response: 200 OK**
```json
{
  "exists": true
}
```

---

## Error Handling

All endpoints return appropriate HTTP status codes:
- **200 OK** - Successful request
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request or duplicate URL
- **404 Not Found** - Resource not found

Error responses include a descriptive message:
```json
{
  "error": "Descriptive error message"
}
```

---

## CORS Configuration

The API enables CORS for all origins (`*`) to allow frontend integration from any domain.

---

## Database Schema

### SavedItem Entity
```sql
CREATE TABLE saved_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL UNIQUE,
    summary VARCHAR(1000),
    notes VARCHAR(2000),
    saved_date TIMESTAMP NOT NULL
);
```

**Constraints:**
- `url` must be unique
- `title` and `saved_date` are required
- `summary` and `notes` are optional

---

## Testing with cURL

### Save an item
```bash
curl -X POST http://localhost:8081/api/saved-items \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Article","url":"https://example.com","summary":"Test summary"}'
```

### Get all items
```bash
curl http://localhost:8081/api/saved-items
```

### Update notes
```bash
curl -X PUT http://localhost:8081/api/saved-items/1/notes \
  -H "Content-Type: application/json" \
  -d '{"notes":"My personal notes"}'
```

### Delete an item
```bash
curl -X DELETE http://localhost:8081/api/saved-items/1
```

### Check if URL exists
```bash
curl "http://localhost:8081/api/saved-items/check?url=https://example.com"
```

---

## Frontend Integration

### JavaScript Example
```javascript
const API_BASE = 'http://localhost:8081/api/saved-items';

// Save an item
async function saveItem(title, url, summary) {
    const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, url, summary })
    });
    return response.json();
}

// Get all items
async function getAllItems() {
    const response = await fetch(API_BASE);
    return response.json();
}

// Update notes
async function updateNotes(id, notes) {
    const response = await fetch(`${API_BASE}/${id}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
    });
    return response.json();
}

// Delete item
async function deleteItem(id) {
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
}

// Check URL
async function checkUrl(url) {
    const response = await fetch(`${API_BASE}/check?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    return data.exists;
}
```

---

## Public Functions for Integration

The `saved.js` file exposes these global functions for use by other pages:

- `window.saveItem(title, url, summary)` - Save a new item
- `window.showToast(message, type)` - Display toast notification
- `window.updateNotes(id, notes)` - Update item notes
- `window.deleteItem(id)` - Delete an item

**Example Usage from Aziz's Result Cards:**
```javascript
// When user clicks "Save" button on a search result
function onSaveButtonClick(result) {
    window.saveItem(result.title, result.url, result.summary);
}
```
