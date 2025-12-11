package com.googlev1.controller;

import com.googlev1.dto.SavedItemRequest;
import com.googlev1.dto.SavedItemResponse;
import com.googlev1.dto.UpdateNotesRequest;
import com.googlev1.service.SavedItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saved-items")
@CrossOrigin(origins = "*")
public class SavedItemController {
    
    private final SavedItemService service;
    
    public SavedItemController(SavedItemService service) {
        this.service = service;
    }
    
    // GET /api/saved-items - Get all saved items
    @GetMapping
    public ResponseEntity<List<SavedItemResponse>> getAllSavedItems() {
        return ResponseEntity.ok(service.getAllSavedItems());
    }
    
    // POST /api/saved-items - Save a new item
    @PostMapping
    public ResponseEntity<?> saveItem(@RequestBody SavedItemRequest request) {
        try {
            SavedItemResponse response = service.saveItem(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    // PUT /api/saved-items/{id}/notes - Update notes
    @PutMapping("/{id}/notes")
    public ResponseEntity<?> updateNotes(@PathVariable Long id, @RequestBody UpdateNotesRequest request) {
        try {
            SavedItemResponse response = service.updateNotes(id, request.getNotes());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    // DELETE /api/saved-items/{id} - Delete an item
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        try {
            service.deleteItem(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    // GET /api/saved-items/check?url={url} - Check if URL exists
    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkUrl(@RequestParam String url) {
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", service.checkUrlExists(url));
        return ResponseEntity.ok(response);
    }
}
