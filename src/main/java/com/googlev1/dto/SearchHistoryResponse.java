package com.googlev1.dto;

import java.time.LocalDateTime;

public class SearchHistoryResponse {

    private Long id;
    private String query;
    private String searchType;
    private Integer resultsCount;
    private LocalDateTime searchDate;

    // Constructors
    public SearchHistoryResponse() {
    }

    public SearchHistoryResponse(Long id, String query, String searchType, Integer resultsCount,
            LocalDateTime searchDate) {
        this.id = id;
        this.query = query;
        this.searchType = searchType;
        this.resultsCount = resultsCount;
        this.searchDate = searchDate;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getSearchType() {
        return searchType;
    }

    public void setSearchType(String searchType) {
        this.searchType = searchType;
    }

    public Integer getResultsCount() {
        return resultsCount;
    }

    public void setResultsCount(Integer resultsCount) {
        this.resultsCount = resultsCount;
    }

    public LocalDateTime getSearchDate() {
        return searchDate;
    }

    public void setSearchDate(LocalDateTime searchDate) {
        this.searchDate = searchDate;
    }
}
