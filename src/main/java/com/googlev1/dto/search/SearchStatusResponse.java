package com.googlev1.dto.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO representing the search service status response.
 * Contains health information, cache statistics, and API metrics.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchStatusResponse {

    /**
     * Whether the search service is healthy (API is reachable).
     */
    private boolean healthy;

    /**
     * Number of entries currently in the search cache.
     */
    private long cachedEntryCount;

    /**
     * Timestamp of the last successful API call to Tavily.
     */
    private LocalDateTime lastSuccessfulCall;

    /**
     * Status message providing additional information.
     */
    private String message;
}