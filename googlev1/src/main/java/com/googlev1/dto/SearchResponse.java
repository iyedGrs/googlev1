package com.googlev1.dto;

import java.util.List;
import java.util.Map;

public class SearchResponse {
    private String query;
    private String searchType;
    private List<Map<String, String>> results;
    private int resultCount;
    private String status;
    
    public SearchResponse() {}
    
    public SearchResponse(String query, String searchType, List<Map<String, String>> results, 
                         int resultCount, String status) {
        this.query = query;
        this.searchType = searchType;
        this.results = results;
        this.resultCount = resultCount;
        this.status = status;
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
    
    public List<Map<String, String>> getResults() {
        return results;
    }
    
    public void setResults(List<Map<String, String>> results) {
        this.results = results;
    }
    
    public int getResultCount() {
        return resultCount;
    }
    
    public void setResultCount(int resultCount) {
        this.resultCount = resultCount;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}
