package com.googlev1.repository;

import com.googlev1.entity.SavedItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedItemRepository extends JpaRepository<SavedItem, Long> {
    
    // Check if URL already exists
    boolean existsByUrl(String url);
    
    // Find by URL
    Optional<SavedItem> findByUrl(String url);
    
    // Get all items ordered by saved date (newest first)
    List<SavedItem> findAllByOrderBySavedDateDesc();
}
