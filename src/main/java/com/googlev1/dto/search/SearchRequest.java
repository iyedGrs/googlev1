package com.googlev1.dto.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for search requests.
 * Contains the query text, search type, and maximum results configuration.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchRequest {

    /**
     * The search query text. Must not be blank.
     */
    private String query;

    /**
     * The type of search to perform (e.g., "general" or "news").
     * Defaults to "general" if not specified.
     */
    @Builder.Default
    private String searchType = "general";

    /**
     * Maximum number of results to return.
     * Defaults to 10 if not specified.
     */
    @Builder.Default
    private Integer maxResults = 10;
}
