package com.googlev1.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.googlev1.dto.SearchRequest;
import com.googlev1.dto.SearchResponse;
import java.util.*;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class SearchController {
    
    /**
     * POST /api/search
     * Performs a search query
     * This is a placeholder that delegates to Iyed's search implementation
     */
    @PostMapping
    public ResponseEntity<SearchResponse> performSearch(@RequestBody SearchRequest request) {
        // Placeholder response - will be integrated with Iyed's search service
        List<Map<String, String>> results = new ArrayList<>();
        
        // Sample results for demonstration
        for (int i = 1; i <= 5; i++) {
            Map<String, String> result = new HashMap<>();
            result.put("id", "result-" + i);
            result.put("title", "Result " + i + ": " + request.getQuery());
            result.put("url", "https://example.com/result-" + i);
            result.put("description", "This is a sample search result for query: " + request.getQuery());
            results.add(result);
        }
        
        SearchResponse response = new SearchResponse(
            request.getQuery(),
            request.getSearchType(),
            results,
            results.size(),
            "success"
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/search/status
     * Returns search service status and suggestions
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getSearchStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "OK");
        status.put("message", "Search service is running");
        status.put("suggestions", Arrays.asList(
            "latest news",
            "technology",
            "sports",
            "entertainment",
            "business"
        ));
        status.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(status);
    }
}
