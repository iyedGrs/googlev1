package com.googlev1.dto;

public class HistoryRequest {
    private String query;
    private String searchType;
    private Integer resultsCount;

    public HistoryRequest() {}

    public HistoryRequest(String query, String searchType, Integer resultsCount) {
        this.query = query;
        this.searchType = searchType;
        this.resultsCount = resultsCount;
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
}
