package com.googlev1.repository.search;

import com.googlev1.entity.search.SearchCacheEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Repository interface for managing SearchCacheEntry entities.
 * Provides methods for caching search results with TTL functionality.
 */
@Repository
public interface SearchCacheRepository extends JpaRepository<SearchCacheEntry, Long> {
    
    /**
     * Find a cache entry by query and search type combination.
     * Used to check if a search result is already cached.
     * 
     * @param query the search query
     * @param searchType the type of search (e.g., "general", "news")
     * @return Optional containing the cache entry if found
     */
    Optional<SearchCacheEntry> findByQueryAndSearchType(String query, String searchType);
    
    /**
     * Delete all cache entries that have expired before the given timestamp.
     * Used by the scheduled cleanup process to remove stale cache entries.
     * 
     * @param timestamp the cutoff time - entries expiring before this will be deleted
     * @return the number of deleted entries
     */
    int deleteByExpiresAtBefore(LocalDateTime timestamp);
}
