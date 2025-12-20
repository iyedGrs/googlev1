package com.googlev1.service;

import com.googlev1.entity.SearchHistory;
import com.googlev1.repository.SearchHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SearchHistoryService {

    @Autowired
    private SearchHistoryRepository searchHistoryRepository;

    /**
     * Save a search to history
     */
    @Transactional
    public SearchHistory saveSearch(String query, String searchType, Integer resultsCount) {
        SearchHistory history = new SearchHistory(query, searchType, resultsCount);
        return searchHistoryRepository.save(history);
    }

    /**
     * Get all search history (ordered by most recent)
     */
    public List<SearchHistory> getAllHistory() {
        return searchHistoryRepository.findAllOrderBySearchDateDesc();
    }

    /**
     * Get recent search history (limited to N entries)
     */
    public List<SearchHistory> getRecentHistory(int limit) {
        return searchHistoryRepository.findRecentSearches(limit);
    }

    /**
     * Get history by user ID (for future multi-user support)
     */
    public List<SearchHistory> getHistoryByUser(String userId) {
        return searchHistoryRepository.findByUserIdOrderBySearchDateDesc(userId);
    }

    /**
     * Get a specific history entry by ID
     */
    public Optional<SearchHistory> getHistoryById(Long id) {
        return searchHistoryRepository.findById(id);
    }

    /**
     * Delete a specific history entry
     */
    @Transactional
    public boolean deleteHistoryEntry(Long id) {
        if (searchHistoryRepository.existsById(id)) {
            searchHistoryRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Clear all search history
     */
    @Transactional
    public void clearAllHistory() {
        searchHistoryRepository.deleteAll();
    }

    /**
     * Clear history for a specific user
     */
    @Transactional
    public void clearHistoryForUser(String userId) {
        searchHistoryRepository.deleteByUserId(userId);
    }

    /**
     * Delete old history entries (older than X days)
     */
    @Transactional
    public void deleteOldHistory(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        searchHistoryRepository.deleteBySearchDateBefore(cutoffDate);
    }

    /**
     * Get total count of history entries
     */
    public long getHistoryCount() {
        return searchHistoryRepository.count();
    }
}
