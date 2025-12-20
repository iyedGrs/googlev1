package com.googlev1.entity.search;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * JPA entity representing a cached search result.
 * Stores search responses with TTL for performance optimization.
 */
@Entity
@Table(name = "search_cache", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"query", "searchType"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchCacheEntry {

    /**
     * Primary key for the cache entry.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The search query that was cached.
     */
    @Column(nullable = false)
    private String query;

    /**
     * The search type that was used.
     */
    @Column(nullable = false)
    private String searchType;

    /**
     * The serialized SearchResponse as JSON.
     */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String responseJson;

    /**
     * When this cache entry was created.
     */
    @Column(nullable = false)
    private LocalDateTime createdAt;

    /**
     * When this cache entry expires and should be removed.
     */
    @Column(nullable = false)
    private LocalDateTime expiresAt;
}