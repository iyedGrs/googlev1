package com.googlev1.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.googlev1.dto.search.SearchResponse;
import com.googlev1.entity.search.SearchCacheEntry;
import com.googlev1.repository.search.SearchCacheRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Service for managing search result caching with TTL functionality.
 * Handles storing, retrieving, and cleaning up cached search responses.
 */
@Service
@Slf4j
public class SearchCacheService {

    private final SearchCacheRepository searchCacheRepository;
    private final ObjectMapper objectMapper;
    private final int cacheTtlMinutes;

    @Autowired
    public SearchCacheService(SearchCacheRepository searchCacheRepository, 
                             ObjectMapper objectMapper,
                             @Value("${search.cache.ttl-minutes:60}") int cacheTtlMinutes) {
        this.searchCacheRepository = searchCacheRepository;
        this.objectMapper = objectMapper;
        this.cacheTtlMinutes = cacheTtlMinutes;
    }

    /**
     * Retrieves a cached search result if it exists and hasn't expired.
     * 
     * @param query the search query
     * @param searchType the search type
     * @return Optional containing the cached SearchResponse if found and valid, empty otherwise
     */
    public Optional<SearchResponse> getCachedResult(String query, String searchType) {
        try {
            Optional<SearchCacheEntry> cacheEntry = searchCacheRepository.findByQueryAndSearchType(query, searchType);
            
            if (cacheEntry.isEmpty()) {
                log.debug("No cache entry found for query: {} and searchType: {}", query, searchType);
                return Optional.empty();
            }
            
            SearchCacheEntry entry = cacheEntry.get();
            LocalDateTime now = LocalDateTime.now();
            
            // Check if the cache entry has expired
            if (entry.getExpiresAt().isBefore(now)) {
                log.debug("Cache entry expired for query: {} and searchType: {}", query, searchType);
                // Optionally delete the expired entry immediately
                searchCacheRepository.delete(entry);
                return Optional.empty();
            }
            
            // Deserialize the cached response
            SearchResponse cachedResponse = objectMapper.readValue(entry.getResponseJson(), SearchResponse.class);
            
            // Mark as from cache and update timestamp to current time
            cachedResponse.setFromCache(true);
            cachedResponse.setTimestamp(now);
            
            log.debug("Retrieved cached result for query: {} and searchType: {}", query, searchType);
            return Optional.of(cachedResponse);
            
        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize cached response for query: {} and searchType: {}", query, searchType, e);
            return Optional.empty();
        } catch (Exception e) {
            log.error("Error retrieving cached result for query: {} and searchType: {}", query, searchType, e);
            return Optional.empty();
        }
    }

    /**
     * Saves a search response to the cache with TTL.
     * 
     * @param query the search query
     * @param searchType the search type
     * @param response the SearchResponse to cache
     */
    @Transactional
    public void saveToCache(String query, String searchType, SearchResponse response) {
        try {
            // Serialize the response to JSON
            String responseJson = objectMapper.writeValueAsString(response);
            
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime expiresAt = now.plusMinutes(cacheTtlMinutes);
            
            // Check if an entry already exists for this query and search type
            Optional<SearchCacheEntry> existingEntry = searchCacheRepository.findByQueryAndSearchType(query, searchType);
            
            if (existingEntry.isPresent()) {
                // Update existing entry
                SearchCacheEntry entry = existingEntry.get();
                entry.setResponseJson(responseJson);
                entry.setCreatedAt(now);
                entry.setExpiresAt(expiresAt);
                searchCacheRepository.save(entry);
                log.debug("Updated cache entry for query: {} and searchType: {}", query, searchType);
            } else {
                // Create new entry
                SearchCacheEntry newEntry = SearchCacheEntry.builder()
                        .query(query)
                        .searchType(searchType)
                        .responseJson(responseJson)
                        .createdAt(now)
                        .expiresAt(expiresAt)
                        .build();
                
                searchCacheRepository.save(newEntry);
                log.debug("Created new cache entry for query: {} and searchType: {}", query, searchType);
            }
            
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize response for caching. Query: {} and searchType: {}", query, searchType, e);
        } catch (Exception e) {
            log.error("Error saving to cache for query: {} and searchType: {}", query, searchType, e);
        }
    }

    /**
     * Scheduled method to clean up expired cache entries.
     * Runs every hour to remove entries that have passed their expiration time.
     */
    @Scheduled(fixedRate = 3600000) // Run every hour (3600000 ms)
    @Transactional
    public void evictExpiredEntries() {
        try {
            LocalDateTime now = LocalDateTime.now();
            int deletedCount = searchCacheRepository.deleteByExpiresAtBefore(now);
            
            if (deletedCount > 0) {
                log.info("Evicted {} expired cache entries", deletedCount);
            } else {
                log.debug("No expired cache entries to evict");
            }
            
        } catch (Exception e) {
            log.error("Error during cache cleanup", e);
        }
    }

    /**
     * Returns the total number of cache entries currently stored.
     * 
     * @return the count of cache entries
     */
    public long getCacheEntryCount() {
        try {
            return searchCacheRepository.count();
        } catch (Exception e) {
            log.error("Error getting cache entry count", e);
            return 0;
        }
    }
}