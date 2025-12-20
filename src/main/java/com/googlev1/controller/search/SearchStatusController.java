package com.googlev1.controller.search;

import com.googlev1.dto.search.SearchStatusResponse;
import com.googlev1.service.SearchCacheService;
import com.googlev1.service.TavilyService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for search service status monitoring.
 * Provides endpoints for checking health status, cache statistics, and API metrics.
 */
@RestController
@RequestMapping("/api/search")
@Slf4j
public class SearchStatusController {

    private final SearchCacheService searchCacheService;
    private final TavilyService tavilyService;

    @Autowired
    public SearchStatusController(SearchCacheService searchCacheService, TavilyService tavilyService) {
        this.searchCacheService = searchCacheService;
        this.tavilyService = tavilyService;
    }

    /**
     * Returns the health status of the search service.
     * Includes API health, cache statistics, and last successful call timestamp.
     * 
     * @return SearchStatusResponse containing health and metrics information
     */
    @GetMapping("/status")
    public ResponseEntity<SearchStatusResponse> getStatus() {
        log.debug("Received request for search service status");
        
        try {
            boolean isHealthy = tavilyService.isHealthy();
            long cachedEntryCount = searchCacheService.getCacheEntryCount();
            
            String message = isHealthy 
                    ? "Search service is operational" 
                    : "Search service is experiencing issues";
            
            SearchStatusResponse response = SearchStatusResponse.builder()
                    .healthy(isHealthy)
                    .cachedEntryCount(cachedEntryCount)
                    .lastSuccessfulCall(tavilyService.getLastSuccessfulCallTimestamp())
                    .message(message)
                    .build();
            
            log.debug("Returning status: healthy={}, cachedEntries={}", isHealthy, cachedEntryCount);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error getting search service status: {}", e.getMessage(), e);
            
            SearchStatusResponse errorResponse = SearchStatusResponse.builder()
                    .healthy(false)
                    .cachedEntryCount(0)
                    .lastSuccessfulCall(null)
                    .message("Error retrieving service status: " + e.getMessage())
                    .build();
            
            return ResponseEntity.ok(errorResponse);
        }
    }
}
