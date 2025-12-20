package com.googlev1.repository;

import com.googlev1.entity.SearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {

    /**
     * Find all search history entries ordered by most recent first
     */
    @Query("SELECT s FROM SearchHistory s ORDER BY s.searchDate DESC")
    List<SearchHistory> findAllOrderBySearchDateDesc();

    /**
     * Find recent search history (last N entries)
     */
    @Query(value = "SELECT * FROM search_history ORDER BY search_date DESC LIMIT ?1", nativeQuery = true)
    List<SearchHistory> findRecentSearches(int limit);

    /**
     * Find searches by user (for future multi-user support)
     */
    List<SearchHistory> findByUserIdOrderBySearchDateDesc(String userId);

    /**
     * Delete old searches before a certain date
     */
    void deleteBySearchDateBefore(LocalDateTime date);

    /**
     * Delete all searches for a user (for future multi-user support)
     */
    void deleteByUserId(String userId);
}
