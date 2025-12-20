package com.googlev1.controller.search;

import com.googlev1.dto.search.SearchRequest;
import com.googlev1.dto.search.SearchResponse;
import com.googlev1.service.TavilyService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for handling search requests.
 * Provides endpoints for performing web searches via the Tavily API.
 */
@RestController
@RequestMapping("/api/search")
@Slf4j
public class searchController {

    private final TavilyService tavilyService;

    @Autowired
    public searchController(TavilyService tavilyService) {
        this.tavilyService = tavilyService;
    }

    /**
     * Performs a web search using the provided query and search type.
     * 
     * @param request the search request containing query, search type, and max results
     * @return SearchResponse containing search results and metadata
     */
    @PostMapping
    public ResponseEntity<SearchResponse> search(@Valid @RequestBody SearchRequest request) {
        log.info("Received search request for query: '{}' with searchType: '{}'", 
                request.getQuery(), request.getSearchType());
        
        // Additional validation for whitespace-only queries
        if (request.getQuery() == null || request.getQuery().trim().isEmpty()) {
            log.warn("Rejected search request with empty or whitespace-only query");
            return ResponseEntity.badRequest().build();
        }
        
        try {
            SearchResponse response = tavilyService.search(request.getQuery().trim(), request.getSearchType());
            log.info("Successfully processed search request for query: '{}' with {} results", 
                    request.getQuery(), response.getResultCount());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error processing search request for query '{}': {}", request.getQuery(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
