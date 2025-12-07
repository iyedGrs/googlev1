package com.googlev1.service;

import com.googlev1.dto.SavedItemRequest;
import com.googlev1.dto.SavedItemResponse;
import com.googlev1.entity.SavedItem;
import com.googlev1.repository.SavedItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SavedItemService {
    
    private final SavedItemRepository repository;
    
    public SavedItemService(SavedItemRepository repository) {
        this.repository = repository;
    }
    
    // Get all saved items (newest first)
    public List<SavedItemResponse> getAllSavedItems() {
        return repository.findAllByOrderBySavedDateDesc()
                .stream()
                .map(SavedItemResponse::new)
                .collect(Collectors.toList());
    }
    
    // Save a new item
    @Transactional
    public SavedItemResponse saveItem(SavedItemRequest request) {
        // Check for duplicates
        if (repository.existsByUrl(request.getUrl())) {
            throw new IllegalArgumentException("This URL is already saved");
        }
        
        SavedItem item = new SavedItem(
            request.getTitle(),
            request.getUrl(),
            request.getSummary()
        );
        
        SavedItem saved = repository.save(item);
        return new SavedItemResponse(saved);
    }
    
    // Update notes for a saved item
    @Transactional
    public SavedItemResponse updateNotes(Long id, String notes) {
        SavedItem item = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Saved item not found"));
        
        item.setNotes(notes);
        SavedItem updated = repository.save(item);
        return new SavedItemResponse(updated);
    }
    
    // Delete a saved item
    @Transactional
    public void deleteItem(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Saved item not found");
        }
        repository.deleteById(id);
    }
    
    // Check if URL exists
    public boolean checkUrlExists(String url) {
        return repository.existsByUrl(url);
    }
}
