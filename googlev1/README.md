# Smart Search Web App 🔍

A simple web application that leverages the **Tavily Search API** to provide enhanced search results with intelligent summaries and content extraction. Users can search for information, view organized results, and save their favorite findings.

## 📋 Project Overview

This is a group project built by a team of 3 developers, demonstrating full-stack development with external API integration. The application provides a clean interface for conducting research and organizing search results.

## ✨ Features

- **Smart Search**: Search the web using Tavily's powerful API
- **Rich Results**: View search results with titles, URLs, and AI-generated summaries
- **Save Favorites**: Bookmark interesting results for later reference
- **Add Notes**: Attach personal notes to saved items
- **Search History**: Track and revisit previous searches
- **Simple UI**: Clean, responsive interface that works on desktop and mobile

## 🛠️ Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (or React)
- Bootstrap for responsive design
- Fetch API for HTTP requests

### Backend
- Java 17+
- Spring Boot 3.x
- Spring Data JPA
- RestTemplate/WebClient for API calls

### Database
- H2 Database (embedded, in-memory)
- JPA/Hibernate for ORM

### External API
- Tavily Search API

## 📁 Project Structure

```
smart-search-app/
├── src/
│   ├── main/
│   │   ├── java/com/googlev1/
│   │   │   ├── controller/          # REST API endpoints
│   │   │   ├── service/              # Business logic & Tavily integration
│   │   │   ├── repository/           # Database access layer
│   │   │   ├── model/                # JPA entities
│   │   │   └── GoogleV1Application.java
│   │   └── resources/
│   │       ├── static/               # Frontend files (HTML, CSS, JS)
│   │       ├── application.properties
│   │       └── data.sql              # Database initialization
│   └── test/                         # Unit tests
├── pom.xml                           # Maven dependencies
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- Tavily API key ([Get one here](https://tavily.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-search-app
   ```

2. **Configure Tavily API Key**
   
   Open `src/main/resources/application.properties` and add your API key:
   ```properties
   tavily.api.key=YOUR_API_KEY_HERE
   tavily.api.url=https://api.tavily.com/search
   ```

3. **Build the project**
   ```bash
   mvn clean install
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

5. **Access the application**
   
   Open your browser and navigate to: `http://localhost:8080`

## 📡 API Endpoints

### Search
- **POST** `/api/search`
  - Request Body: `{ "query": "search term", "searchType": "general" }`
  - Response: Array of search results with titles, URLs, and summaries

### Saved Items
- **GET** `/api/saved-items` - Get all saved items
- **POST** `/api/saved-items` - Save a new item
  - Request Body: `{ "title": "...", "url": "...", "summary": "...", "notes": "..." }`
- **DELETE** `/api/saved-items/{id}` - Delete a saved item

### Search History
- **GET** `/api/history` - Get search history
- **POST** `/api/history` - Add search to history
  - Request Body: `{ "query": "...", "searchType": "general" }`

## 🗄️ Database Schema

### SavedItems Table
| Column     | Type      | Description                    |
|------------|-----------|--------------------------------|
| id         | BIGINT    | Primary key (auto-increment)   |
| title      | VARCHAR   | Result title                   |
| url        | VARCHAR   | Source URL                     |
| summary    | TEXT      | Content summary                |
| notes      | TEXT      | User's personal notes          |
| saved_date | TIMESTAMP | When the item was saved        |

### SearchHistory Table
| Column      | Type      | Description                    |
|-------------|-----------|--------------------------------|
| id          | BIGINT    | Primary key (auto-increment)   |
| query       | VARCHAR   | Search query text              |
| search_type | VARCHAR   | Type of search (general/news)  |
| timestamp   | TIMESTAMP | When the search was performed  |

## 👥 Team & Responsibilities

### Person 1: Frontend Developer
- User interface design and implementation
- Search page with results display
- Saved items management page
- Search history page
- Responsive design

### Person 2: Backend Developer
- Spring Boot application setup
- Tavily API integration
- REST API endpoints
- Error handling and validation
- CORS configuration

### Person 3: Database Developer
- Database schema design
- JPA entity creation
- Repository interfaces
- Data persistence logic
- Sample data creation

## 🧪 Testing

Run tests with:
```bash
mvn test
```

## 📝 Usage Guide

1. **Search for Information**
   - Enter your search query in the search bar
   - Select search type (General or News)
   - Click "Search" to get results

2. **View Results**
   - Browse through search results
   - Click on URLs to visit source websites
   - Read AI-generated summaries

3. **Save Items**
   - Click "Save" button on any result
   - Add personal notes if desired
   - Access saved items from "My Saved Items" page

4. **Manage Saved Items**
   - View all saved items in one place
   - Edit notes on saved items
   - Delete items you no longer need

5. **Review History**
   - Check "Search History" to see past searches
   - Click on any previous search to run it again

## 🔧 Configuration

### Application Properties
```properties
# Server Configuration
server.port=8080

# H2 Database
spring.datasource.url=jdbc:h2:mem:searchdb
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true

# Tavily API
tavily.api.key=YOUR_API_KEY
tavily.api.url=https://api.tavily.com/search
```

## 🐛 Troubleshooting

### Common Issues

**Problem**: Application won't start
- **Solution**: Check if port 8080 is already in use. Change port in `application.properties`

**Problem**: Tavily API errors
- **Solution**: Verify your API key is correct and you haven't exceeded rate limits

**Problem**: Database errors
- **Solution**: Delete the H2 database file and restart the application

**Problem**: CORS errors in browser
- **Solution**: Ensure CORS is properly configured in the backend

## 📚 Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Tavily API Documentation](https://docs.tavily.com)
- [H2 Database Documentation](https://www.h2database.com)

## 🎯 Future Enhancements

If time permits, consider adding:
- [ ] User authentication
- [ ] Export saved items as text/PDF
- [ ] Advanced search filters
- [ ] Categories/tags for saved items
- [ ] Search result pagination
- [ ] Dark mode theme

## 📄 License

This project is created for educational purposes.

## 🤝 Contributing

This is a group project. All team members contribute through:
1. Creating feature branches
2. Making pull requests
3. Code reviews
4. Regular team meetings

## 📞 Contact

For questions or issues, contact the development team.

---

**Built with ❤️ by Team [Your Team Name]**
