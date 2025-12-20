package com.googlev1.dto.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing a single search result.
 * Contains the title, URL, summary, and optional content for a search result.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResult {

    /**
     * The title of the search result.
     */
    private String title;

    /**
     * The URL of the search result.
     */
    private String url;

    /**
     * A summary or snippet of the search result content.
     */
    private String summary;

    /**
     * Optional full content of the search result.
     */
    private String content;
}