package com.googlev1.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "search_history")
public class SearchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String query;

    @Column(name = "search_type")
    private String searchType;

    @Column(name = "results_count")
    private Integer resultsCount;

    @Column(name = "searched_at")
    private LocalDateTime searchedAt;

    public SearchHistory() {}

    public SearchHistory(String query, String searchType, Integer resultsCount) {
        this.query = query;
        this.searchType = searchType;
        this.resultsCount = resultsCount;
        this.searchedAt = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist() {
        if (this.searchedAt == null) this.searchedAt = LocalDateTime.now();
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
