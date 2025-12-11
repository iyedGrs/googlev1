package com.googlev1.repository;

import com.googlev1.entity.SavedItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedItemRepository extends JpaRepository<SavedItem, Long> {
    
    boolean existsByUrl(String url);
    
    
    List<SavedItem> findAllByOrderBySavedDateDesc();
}
