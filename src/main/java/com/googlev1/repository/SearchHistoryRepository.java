package com.googlev1.repository;

import com.googlev1.entity.SearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
    
    // Petit commentaire: ajouté pour contribution (Maram Benwarred)

    List<SearchHistory> findTop20ByOrderBySearchedAtDesc();

    Optional<SearchHistory> findFirstByQueryAndSearchTypeOrderBySearchedAtDesc(String query, String searchType);
}
