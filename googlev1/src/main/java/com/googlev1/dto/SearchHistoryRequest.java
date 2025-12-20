package com.googlev1.dto;

public class SearchHistoryRequest {

    private String query;
    private String searchType;
    private Integer resultsCount;

    // Constructors
    public SearchHistoryRequest() {
    }

    public SearchHistoryRequest(String query, String searchType, Integer resultsCount) {
        this.query = query;
        this.searchType = searchType;
        this.resultsCount = resultsCount;
    }

    // Getters and Setters
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
}
