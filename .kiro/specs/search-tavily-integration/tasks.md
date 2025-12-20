# Implementation Plan

- [x] 1. Project Setup and Dependencies
  - [x] 1.1 Add WebFlux dependency to pom.xml for WebClient





    - Add spring-boot-starter-webflux for reactive HTTP client
    - Add jqwik dependency for property-based testing
    - Add Jackson databind for JSON serialization
    - _Requirements: 2.1_
  - [x] 1.2 Configure Tavily API properties in application.properties





    - Add tavily.api.key placeholder (use environment variable)
    - Add tavily.api.base-url=https://api.tavily.com
    - Add tavily.api.timeout=30000
    - Add search.cache.ttl-minutes=60
    - _Requirements: 2.1_
  - [x] 1.3 Create CORS configuration class





    - Create CorsConfig.java in config package
    - Allow all origins for development (configure for production later)
    - Allow GET, POST, PUT, DELETE, OPTIONS methods
    - Allow all headers
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 2. Data Models and DTOs




  - [x] 2.1 Implement SearchRequest DTO





    - Add query field (String)
    - Add searchType field (String, default "general")
    - Add maxResults field (Integer, default 10)
    - Add validation annotations
    - _Requirements: 1.1_
  - [x] 2.2 Implement SearchResult DTO


    - Add title, url, summary, content fields
    - Add Lombok annotations for getters/setters
    - _Requirements: 1.3_
  - [x] 2.3 Implement SearchResponse DTO


    - Add query, searchType, results list, resultCount, timestamp, fromCache fields
    - Add builder pattern for easy construction
    - _Requirements: 1.3, 1.4_


  - [x] 2.4 Implement SearchStatusResponse DTO


    - Add healthy, cachedEntryCount, lastSuccessfulCall, message fields
    - _Requirements: 4.1_
  - [x] 2.5 Implement SearchCacheEntry entity




    - Add JPA annotations (@Entity, @Table, @Id, @GeneratedValue)
    - Add query, searchType, responseJson, createdAt, expiresAt fields
    - Add unique constraint on query + searchType combination
    - _Requirements: 3.1, 6.1_
  - [ ]* 2.6 Write property test for cache serialization round-trip
    - **Property 3: Cache serialization round-trip**
    - Generate random SearchResponse objects
    - Serialize to JSON, deserialize back
    - Verify equivalence of all fields
    - **Validates: Requirements 6.1, 6.2, 6.3**

- [x] 3. Repository Layer




  - [x] 3.1 Implement SearchCacheRepository interface

    - Extend JpaRepository<SearchCacheEntry, Long>
    - Add findByQueryAndSearchType method
    - Add deleteByExpiresAtBefore method
    - _Requirements: 3.2, 3.4_

- [x] 4. Cache Service Implementation


  - [x] 4.1 Implement SearchCacheService




    - Inject SearchCacheRepository and ObjectMapper
    - Implement getCachedResult(query, searchType) method
    - Implement saveToCache(query, searchType, response) method
    - Implement evictExpiredEntries() method with @Scheduled annotation
    - Implement getCacheEntryCount() method
    - Configure cache TTL from properties
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [ ]* 4.2 Write property test for cache cleanup
    - **Property 5: Expired cache entries are cleaned up**
    - Generate cache entries with mixed expiration times
    - Run cleanup
    - Verify only expired entries are removed
    - **Validates: Requirements 3.4**

- [x] 5. Tavily Service Implementation





  - [x] 5.1 Implement TavilyService with WebClient


    - Configure WebClient with base URL and timeout
    - Inject SearchCacheService
    - Implement search(query, searchType) method
    - Check cache before calling API
    - Parse Tavily API response into SearchResult DTOs
    - Save successful results to cache
    - Track last successful call timestamp
    - _Requirements: 2.1, 2.2, 3.1, 3.2_
  - [x] 5.2 Implement error handling in TavilyService


    - Handle timeout exceptions - return cached result or error
    - Handle API error responses - log and return error
    - Implement isHealthy() method for status checks
    - _Requirements: 2.3, 2.4_
  - [ ]* 5.3 Write property test for response structure validation
    - **Property 2: Valid search responses contain required structure**
    - Generate valid search queries
    - Verify response contains all required fields
    - **Validates: Requirements 1.3, 1.4**

- [ ] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Controller Implementation
  - [x] 7.1 Implement SearchController



    - Add @RestController and @RequestMapping("/api/search")
    - Inject TavilyService
    - Implement POST endpoint for search
    - Add request validation for empty/whitespace queries
    - Return SearchResponse
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [ ]* 7.2 Write property test for whitespace query rejection
    - **Property 1: Whitespace queries are rejected**
    - Generate whitespace-only strings
    - Verify 400 response
    - **Validates: Requirements 1.2**
  - [x] 7.3 Implement SearchStatusController
    - Add @RestController and @RequestMapping("/api/search")
    - Inject SearchCacheService and TavilyService
    - Implement GET /status endpoint
    - Return SearchStatusResponse with health, cache count, last call timestamp
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [ ]* 7.4 Write property test for status response structure
    - **Property 6: Status response contains required fields**
    - Verify response contains healthy, cachedEntryCount, lastSuccessfulCall
    - **Validates: Requirements 4.1, 4.4**

- [x] 8. Enable Scheduling
  - [x] 8.1 Add @EnableScheduling to main application class
    - Enable Spring's scheduled task execution
    - Verify cache cleanup runs on schedule
    - _Requirements: 3.4_

- [ ] 9. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
