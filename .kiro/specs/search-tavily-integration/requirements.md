# Requirements Document

## Introduction

This document specifies the requirements for the Search & Tavily API Integration feature. The feature provides the core search engine functionality for the GoogleV1 application, integrating with the Tavily API to perform web searches, caching results for performance, and exposing health status endpoints for monitoring. This is the foundational component that other features (results display, favorites, search history) depend on.

## Glossary

- **Tavily API**: A third-party web search API service that provides search results including titles, URLs, and content summaries
- **Search Cache**: A database-backed storage mechanism that temporarily stores search results to reduce API calls and improve response times
- **TTL (Time-To-Live)**: The duration for which a cached search result remains valid before expiration
- **Search Type**: The category of search being performed (e.g., "general" or "news")
- **WebClient**: Spring's reactive HTTP client used for making API calls to Tavily
- **Search Status**: Health information about the search service including API availability and cache statistics

## Requirements

### Requirement 1: Search Request Processing

**User Story:** As a user, I want to submit search queries through the application, so that I can find relevant web content.

#### Acceptance Criteria

1. WHEN a user submits a search query via POST /api/search THEN the System SHALL accept a JSON payload containing query text and search type
2. WHEN a search request contains an empty or whitespace-only query THEN the System SHALL reject the request with a 400 Bad Request response
3. WHEN a search request contains a valid query THEN the System SHALL return a normalized response containing results with title, URL, and summary fields
4. WHEN a search completes successfully THEN the System SHALL include metadata containing the original query, search type, result count, and timestamp

### Requirement 2: Tavily API Integration

**User Story:** As a system operator, I want the application to integrate with Tavily API, so that users receive high-quality search results.

#### Acceptance Criteria

1. WHEN the TavilyService receives a search request THEN the System SHALL construct a properly formatted API request with the configured API key
2. WHEN the Tavily API returns results THEN the System SHALL parse the JSON response and transform it into normalized SearchResult DTOs
3. WHEN the Tavily API returns an error response THEN the System SHALL log the error and return a graceful error response to the client
4. WHEN the Tavily API times out THEN the System SHALL return cached results if available or an appropriate error message

### Requirement 3: Search Result Caching

**User Story:** As a system operator, I want search results to be cached, so that repeated queries are faster and reduce API costs.

#### Acceptance Criteria

1. WHEN a search completes successfully THEN the System SHALL store the results in the SearchCacheEntry table with an expiration timestamp
2. WHEN a cached result exists for a query and search type combination and the cache entry has not expired THEN the System SHALL return the cached result without calling Tavily API
3. WHEN a cache entry expires THEN the System SHALL fetch fresh results from Tavily API
4. WHEN the scheduled cache cleanup runs THEN the System SHALL delete all cache entries where the expiration timestamp is in the past

### Requirement 4: Search Status Monitoring

**User Story:** As a user, I want to see the health status of the search service, so that I know if the service is working properly.

#### Acceptance Criteria

1. WHEN a client requests GET /api/search/status THEN the System SHALL return a JSON response containing health status, cache statistics, and last successful call timestamp
2. WHEN the Tavily API is reachable THEN the System SHALL report healthy status as true
3. WHEN the Tavily API is unreachable or returning errors THEN the System SHALL report healthy status as false
4. WHEN reporting cache statistics THEN the System SHALL include the total cached entry count

### Requirement 5: CORS Configuration

**User Story:** As a frontend developer, I want the API to support cross-origin requests, so that the frontend application can communicate with the backend.

#### Acceptance Criteria

1. WHEN a browser makes a preflight OPTIONS request THEN the System SHALL respond with appropriate CORS headers
2. WHEN CORS is configured THEN the System SHALL allow requests from the configured frontend origins
3. WHEN a cross-origin request is made to any /api/* endpoint THEN the System SHALL include Access-Control-Allow-Origin headers in the response

### Requirement 6: Data Serialization

**User Story:** As a developer, I want search cache entries to be properly serialized to and from the database, so that cached data persists correctly.

#### Acceptance Criteria

1. WHEN storing a SearchCacheEntry THEN the System SHALL serialize the search response as JSON text in the database
2. WHEN retrieving a SearchCacheEntry THEN the System SHALL deserialize the JSON text back into a SearchResponse object
3. WHEN serializing or deserializing cache data THEN the System SHALL preserve all fields including nested result objects
