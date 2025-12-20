package com.googlev1.dto.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO representing a search response.
 * Contains the original query, search type, results, metadata, and cache information.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResponse {

    /**
     * Echo of the original search query.
     */
    private String query;

    /**
     * Echo of the search type used.
     */
    private String searchType;

    /**
     * List of search results.
     */
    private List<SearchResult> results;

    /**
     * Number of results returned.
     */
    private int resultCount;

    /**
     * Timestamp when the response was generated.
     */
    private LocalDateTime timestamp;

    /**
     * Whether this result was served from cache.
     */
    private boolean fromCache;
}