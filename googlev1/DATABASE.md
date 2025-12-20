# Database Configuration & Documentation

## Current Setup

### Database Type
- **Type:** H2 Database (in-memory replaced with file-based)
- **Mode:** File-based persistent storage
- **Location:** `./data/searchdb.mv.db` (project root)

### Configuration
```properties
# Database URL with MySQL mode compatibility
jdbc:h2:file:./data/searchdb;MODE=MySQL;AUTO_SERVER=true

# Login Credentials
Username: sa
Password: (empty)

# Features
- AUTO_SERVER: Allows multiple JVM connections
- MODE=MySQL: Compatible with MySQL syntax
- Persistent: Data survives app restarts
```

---

## Accessing the Database

### 1. H2 Web Console
**URL:** `http://localhost:8081/h2-console`

**Connection Settings:**
- **JDBC URL:** `jdbc:h2:file:./data/searchdb`
- **User Name:** `sa`
- **Password:** (leave blank)

### 2. Using IDE Database Tools
- Configure H2 connection in IntelliJ/VS Code
- Server: `localhost`
- Database: `file:./data/searchdb`

---

## Database Schema

### Tables Auto-Created by Hibernate

#### 1. `user_preference`
```sql
CREATE TABLE user_preference (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    default_query VARCHAR(255),
    default_type VARCHAR(50) DEFAULT 'general',
    theme VARCHAR(20) DEFAULT 'light',
    show_advanced_tips BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Purpose:** Store user search preferences

#### 2. `saved_items`
```sql
CREATE TABLE saved_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL UNIQUE,
    summary VARCHAR(1000),
    notes VARCHAR(2000),
    saved_date TIMESTAMP NOT NULL
);
```
**Purpose:** Store bookmarked articles

#### 3. `search_history` (Future - Marwa)
```sql
CREATE TABLE search_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    query VARCHAR(255) NOT NULL,
    search_type VARCHAR(50),
    results_count INT DEFAULT 0,
    searched_at TIMESTAMP NOT NULL
);
```
**Purpose:** Track search queries

#### 4. `search_cache_entry` (Future - Iyed)
```sql
CREATE TABLE search_cache_entry (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    query VARCHAR(255),
    search_type VARCHAR(50),
    response_json LONGTEXT,
    expires_at TIMESTAMP
);
```
**Purpose:** Cache search results

#### 5. `content_cache_entry` (Future - Aziz)
```sql
CREATE TABLE content_cache_entry (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    url VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255),
    content LONGTEXT,
    word_count INT,
    fetched_at TIMESTAMP,
    expires_at TIMESTAMP
);
```
**Purpose:** Cache article content

---

## Data Initialization

### Auto-Initialization
The file `src/main/resources/data.sql` runs automatically on application startup:
- Inserts default user preference if none exists
- Seeds sample data (optional - commented out)

### Manual Data Management
1. Use H2 Console for quick queries
2. Use API endpoints for CRUD operations
3. Use SQL scripts in `data.sql` for batch initialization

---

## Backup & Data Management

### Backup Database
```bash
# The database files are located at:
./data/searchdb.mv.db    # Main database file
./data/searchdb.trace.db # Trace file (debugging)

# Backup these files to preserve data
```

### Clear Database
```bash
# Delete database files to reset
rm ./data/searchdb.mv.db
rm ./data/searchdb.trace.db

# Restart application to recreate with defaults
```

### Export Data
Use H2 Console to run:
```sql
-- Export table as CSV
SELECT * FROM saved_items INTO OUTFILE './export/saved_items.csv';

-- Backup as SQL script
SCRIPT TO './backup/database_backup.sql';
```

---

## Performance Optimization

### Current Settings
```properties
# Connection Pool
spring.datasource.hikari.maximum-pool-size=10   # Max connections
spring.datasource.hikari.minimum-idle=5         # Min idle connections

# Hibernate Batch Processing
hibernate.jdbc.batch_size=20                    # Batch insert/update
hibernate.order_inserts=true                    # Optimize insert order

# SQL Formatting
hibernate.format_sql=true                       # Readable SQL logs
```

### Monitoring
- Enable SQL logging: Change `spring.jpa.show-sql=true` in properties
- Check H2 Console for query performance
- Monitor connection pool status

---

## Migration to PostgreSQL

When ready for production, update to PostgreSQL:

```properties
# 1. Change dependency in pom.xml:
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
</dependency>

# 2. Update application.properties:
spring.datasource.url=jdbc:postgresql://localhost:5432/searchdb
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQL94Dialect
```

---

## Troubleshooting

### Database Not Found
- **Error:** `Database does not exist`
- **Solution:** Delete `./data/searchdb.mv.db`, restart app

### Port Already in Use (8081)
- **Error:** `Port 8081 already in use`
- **Solution:** Change in properties: `server.port=8082`

### Connection Issues
- **Error:** `Cannot get a connection, pool error`
- **Solution:** Check H2 file permissions, ensure `./data/` directory exists

### Data Not Persisting
- **Error:** Data lost after restart
- **Cause:** Accidentally using in-memory mode
- **Solution:** Verify JDBC URL contains `file:`

---

## SQL Cheat Sheet

```sql
-- View all tables
SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='PUBLIC';

-- Count records
SELECT COUNT(*) FROM saved_items;
SELECT COUNT(*) FROM user_preference;

-- Clear all data (WARNING: Data loss!)
DELETE FROM saved_items;
DELETE FROM user_preference;

-- Update preference
UPDATE user_preference SET theme = 'dark' WHERE id = 1;

-- Find by URL
SELECT * FROM saved_items WHERE url LIKE '%example%';

-- Recent saved items
SELECT * FROM saved_items ORDER BY saved_date DESC LIMIT 10;
```

---

## Next Steps

1. ✅ Start application: `mvn spring-boot:run`
2. ✅ Access H2 Console: `http://localhost:8081/h2-console`
3. ✅ Test API endpoints with saved data
4. ✅ Monitor performance as data grows
5. ⚠️ Plan PostgreSQL migration for production

---

**Database is now fully integrated and persistent! 🗄️**
