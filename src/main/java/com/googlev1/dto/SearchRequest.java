package com.googlev1.dto;

public class SearchRequest {
    private String query;
    private String searchType;
    
    public SearchRequest() {}
    
    public SearchRequest(String query, String searchType) {
        this.query = query;
        this.searchType = searchType;
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
}
