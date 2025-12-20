package com.googlev1.controller;

import com.googlev1.dto.HistoryRequest;
import com.googlev1.dto.HistoryResponse;
import com.googlev1.service.SearchHistoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "*")
public class SearchHistoryController {

    private final SearchHistoryService service;

    public SearchHistoryController(SearchHistoryService service) {
        this.service = service;
    }

    // GET /api/history
    @GetMapping
    public ResponseEntity<List<HistoryResponse>> getHistory() {
        try {
            List<HistoryResponse> history = service.getRecentHistory();
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            System.err.println("Error getting history: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
        }
    }

    // POST /api/history
    @PostMapping
    public ResponseEntity<?> addHistory(@RequestBody HistoryRequest request) {
        try {
            System.out.println("POST /api/history - Request: query=" + request.getQuery() + 
                             ", type=" + request.getSearchType() + 
                             ", count=" + request.getResultsCount());
            
            HistoryResponse response = service.saveHistory(request);
            System.out.println("Successfully saved history entry: " + response.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            System.out.println("Validation error: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            System.err.println("Unexpected error saving history: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to save history: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // DELETE /api/history
    @DeleteMapping
    public ResponseEntity<?> clearHistory() {
        try {
            service.clearAll();
            System.out.println("Successfully cleared all history");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error clearing history: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to clear history: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
