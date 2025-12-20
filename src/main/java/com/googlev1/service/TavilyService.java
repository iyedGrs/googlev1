package com.googlev1.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.googlev1.dto.search.SearchResponse;
import com.googlev1.dto.search.SearchResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeoutException;

/**
 * Service for integrating with the Tavily API to perform web searches.
 * Handles API communication, response parsing, caching, and error handling.
 */
@Service
@Slf4j
public class TavilyService {

    private final WebClient webClient;
    private final SearchCacheService searchCacheService;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final Duration timeout;
    
    private LocalDateTime lastSuccessfulCall;
    private boolean isHealthy = true;

    @Autowired
    public TavilyService(
            @Value("${tavily.api.base-url}") String baseUrl,
            @Value("${tavily.api.key}") String apiKey,
            @Value("${tavily.api.timeout:30000}") long timeoutMs,
            SearchCacheService searchCacheService,
            ObjectMapper objectMapper) {
        
        this.apiKey = apiKey;
        this.timeout = Duration.ofMillis(timeoutMs);
        this.searchCacheService = searchCacheService;
        this.objectMapper = objectMapper;
        
        // Configure WebClient with base URL and timeout
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
        
        log.info("TavilyService initialized with base URL: {} and timeout: {}ms", baseUrl, timeoutMs);
    }

    /**
     * Performs a search using the Tavily API.
     * Checks cache first, then calls API if needed, and saves successful results to cache.
     * 
     * @param query the search query
     * @param searchType the type of search (e.g., "general", "news")
     * @return SearchResponse containing results and metadata
     */
    public SearchResponse search(String query, String searchType) {
        log.debug("Performing search for query: '{}' with searchType: '{}'", query, searchType);
        
        // Check cache first
        Optional<SearchResponse> cachedResult = searchCacheService.getCachedResult(query, searchType);
        if (cachedResult.isPresent()) {
            log.debug("Returning cached result for query: '{}'", query);
            return cachedResult.get();
        }
        
        try {
            // Prepare request payload for Tavily API
            Map<String, Object> requestBody = Map.of(
                "api_key", apiKey,
                "query", query,
                "search_depth", "basic",
                "include_answer", false,
                "include_images", false,
                "include_raw_content", false,
                "max_results", 10,
                "topic", searchType.equals("news") ? "news" : "general"
            );
            
            // Call Tavily API
            String responseJson = webClient.post()
                    .uri("/search")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(timeout)
                    .block();
            
            // Parse response and create SearchResponse
            SearchResponse searchResponse = parseApiResponse(responseJson, query, searchType);
            
            // Update health status and timestamp
            this.isHealthy = true;
            this.lastSuccessfulCall = LocalDateTime.now();
            
            // Save to cache
            searchCacheService.saveToCache(query, searchType, searchResponse);
            
            log.debug("Successfully completed search for query: '{}' with {} results", query, searchResponse.getResultCount());
            return searchResponse;
            
        } catch (WebClientResponseException e) {
            log.error("Tavily API returned error response for query '{}': {} - {}", query, e.getStatusCode(), e.getResponseBodyAsString());
            this.isHealthy = false;
            return handleApiError(query, searchType, e);
            
        } catch (Exception e) {
            log.error("Error calling Tavily API for query '{}': {}", query, e.getMessage(), e);
            this.isHealthy = false;
            
            if (e.getCause() instanceof TimeoutException || e instanceof java.util.concurrent.TimeoutException) {
                return handleTimeout(query, searchType);
            }
            
            return createErrorResponse(query, searchType, "Search service temporarily unavailable");
        }
    }

    /**
     * Checks if the Tavily service is healthy by attempting a simple API call.
     * 
     * @return true if the service is healthy, false otherwise
     */
    public boolean isHealthy() {
        return isHealthy;
    }

    /**
     * Returns the timestamp of the last successful API call.
     * 
     * @return LocalDateTime of last successful call, or null if no successful calls yet
     */
    public LocalDateTime getLastSuccessfulCallTimestamp() {
        return lastSuccessfulCall;
    }

    /**
     * Parses the Tavily API response JSON into a SearchResponse object.
     * 
     * @param responseJson the JSON response from Tavily API
     * @param query the original query
     * @param searchType the search type
     * @return SearchResponse with parsed results
     */
    private SearchResponse parseApiResponse(String responseJson, String query, String searchType) {
        try {
            JsonNode rootNode = objectMapper.readTree(responseJson);
            List<SearchResult> results = new ArrayList<>();
            
            // Parse results array from Tavily response
            JsonNode resultsNode = rootNode.get("results");
            if (resultsNode != null && resultsNode.isArray()) {
                for (JsonNode resultNode : resultsNode) {
                    SearchResult result = SearchResult.builder()
                            .title(getTextValue(resultNode, "title"))
                            .url(getTextValue(resultNode, "url"))
                            .summary(getTextValue(resultNode, "content"))
                            .content(getTextValue(resultNode, "raw_content"))
                            .build();
                    results.add(result);
                }
            }
            
            return SearchResponse.builder()
                    .query(query)
                    .searchType(searchType)
                    .results(results)
                    .resultCount(results.size())
                    .timestamp(LocalDateTime.now())
                    .fromCache(false)
                    .build();
                    
        } catch (Exception e) {
            log.error("Failed to parse Tavily API response for query '{}': {}", query, e.getMessage(), e);
            return createErrorResponse(query, searchType, "Failed to parse search results");
        }
    }

    /**
     * Safely extracts text value from JsonNode.
     * 
     * @param node the JsonNode to extract from
     * @param fieldName the field name to extract
     * @return the text value or empty string if not found
     */
    private String getTextValue(JsonNode node, String fieldName) {
        JsonNode fieldNode = node.get(fieldName);
        return fieldNode != null && !fieldNode.isNull() ? fieldNode.asText() : "";
    }

    /**
     * Handles API error responses by returning cached results if available or error response.
     * 
     * @param query the search query
     * @param searchType the search type
     * @param exception the WebClient exception
     * @return SearchResponse with error or cached data
     */
    private SearchResponse handleApiError(String query, String searchType, WebClientResponseException exception) {
        // Try to return cached result if available
        Optional<SearchResponse> cachedResult = searchCacheService.getCachedResult(query, searchType);
        if (cachedResult.isPresent()) {
            log.info("Returning cached result due to API error for query: '{}'", query);
            return cachedResult.get();
        }
        
        // Return error response
        String errorMessage = String.format("Search API error: %s", exception.getStatusCode());
        return createErrorResponse(query, searchType, errorMessage);
    }

    /**
     * Handles timeout exceptions by returning cached results if available.
     * 
     * @param query the search query
     * @param searchType the search type
     * @return SearchResponse with cached data or timeout error
     */
    private SearchResponse handleTimeout(String query, String searchType) {
        // Try to return cached result if available
        Optional<SearchResponse> cachedResult = searchCacheService.getCachedResult(query, searchType);
        if (cachedResult.isPresent()) {
            log.info("Returning cached result due to timeout for query: '{}'", query);
            return cachedResult.get();
        }
        
        // Return timeout error response
        return createErrorResponse(query, searchType, "Search request timed out");
    }

    /**
     * Creates an error response with empty results.
     * 
     * @param query the search query
     * @param searchType the search type
     * @param errorMessage the error message
     * @return SearchResponse with error information
     */
    private SearchResponse createErrorResponse(String query, String searchType, String errorMessage) {
        log.warn("Creating error response for query '{}': {}", query, errorMessage);
        
        return SearchResponse.builder()
                .query(query)
                .searchType(searchType)
                .results(new ArrayList<>())
                .resultCount(0)
                .timestamp(LocalDateTime.now())
                .fromCache(false)
                .build();
    }
}
