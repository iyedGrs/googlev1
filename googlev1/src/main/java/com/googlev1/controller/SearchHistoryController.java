package com.googlev1.controller;

import com.googlev1.dto.SearchHistoryRequest;
import com.googlev1.dto.SearchHistoryResponse;
import com.googlev1.entity.SearchHistory;
import com.googlev1.service.SearchHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "*")
public class SearchHistoryController {

    @Autowired
    private SearchHistoryService searchHistoryService;

    /**
     * GET /api/history
     * Retrieve all search history entries
     */
    @GetMapping
    public ResponseEntity<List<SearchHistoryResponse>> getAllHistory() {
        List<SearchHistory> history = searchHistoryService.getAllHistory();
        List<SearchHistoryResponse> response = history.stream()
                .map(h -> new SearchHistoryResponse(
                        h.getId(),
                        h.getQuery(),
                        h.getSearchType(),
                        h.getResultsCount(),
                        h.getSearchDate()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/history/recent?limit=10
     * Get recent search history (limited)
     */
    @GetMapping("/recent")
    public ResponseEntity<List<SearchHistoryResponse>> getRecentHistory(
            @RequestParam(defaultValue = "10") int limit) {
        List<SearchHistory> history = searchHistoryService.getRecentHistory(limit);
        List<SearchHistoryResponse> response = history.stream()
                .map(h -> new SearchHistoryResponse(
                        h.getId(),
                        h.getQuery(),
                        h.getSearchType(),
                        h.getResultsCount(),
                        h.getSearchDate()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/history/{id}
     * Get a specific history entry
     */
    @GetMapping("/{id}")
    public ResponseEntity<SearchHistoryResponse> getHistoryById(@PathVariable Long id) {
        return searchHistoryService.getHistoryById(id)
                .map(h -> new SearchHistoryResponse(
                        h.getId(),
                        h.getQuery(),
                        h.getSearchType(),
                        h.getResultsCount(),
                        h.getSearchDate()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/history
     * Save a search to history
     */
    @PostMapping
    public ResponseEntity<SearchHistoryResponse> saveToHistory(@RequestBody SearchHistoryRequest request) {
        SearchHistory saved = searchHistoryService.saveSearch(
                request.getQuery(),
                request.getSearchType(),
                request.getResultsCount());

        SearchHistoryResponse response = new SearchHistoryResponse(
                saved.getId(),
                saved.getQuery(),
                saved.getSearchType(),
                saved.getResultsCount(),
                saved.getSearchDate());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * DELETE /api/history/{id}
     * Delete a specific history entry
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteHistoryEntry(@PathVariable Long id) {
        boolean deleted = searchHistoryService.deleteHistoryEntry(id);

        Map<String, Object> response = new HashMap<>();
        if (deleted) {
            response.put("success", true);
            response.put("message", "History entry deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "History entry not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * DELETE /api/history
     * Clear all history
     */
    @DeleteMapping
    public ResponseEntity<Map<String, Object>> clearAllHistory() {
        searchHistoryService.clearAllHistory();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "All history cleared successfully");

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/history/count
     * Get total count of history entries
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Object>> getHistoryCount() {
        long count = searchHistoryService.getHistoryCount();

        Map<String, Object> response = new HashMap<>();
        response.put("count", count);

        return ResponseEntity.ok(response);
    }
}
