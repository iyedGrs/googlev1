package com.googlev1.dto;

import com.googlev1.entity.SearchHistory;
import java.time.LocalDateTime;

public class HistoryResponse {
    private Long id;
    private String query;
    private String searchType;
    private Integer resultsCount;
    private LocalDateTime searchedAt;

    public HistoryResponse() {}

    public HistoryResponse(SearchHistory e) {
        this.id = e.getId();
        this.query = e.getQuery();
        this.searchType = e.getSearchType();
        this.resultsCount = e.getResultsCount();
        this.searchedAt = e.getSearchedAt();
    }

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

    public LocalDateTime getSearchedAt() {
        return searchedAt;
    }

    public void setSearchedAt(LocalDateTime searchedAt) {
        this.searchedAt = searchedAt;
    }
}
