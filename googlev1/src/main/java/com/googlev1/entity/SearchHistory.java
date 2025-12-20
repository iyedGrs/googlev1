package com.googlev1.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "search_history")
public class SearchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "query", nullable = false)
    private String query;

    @Column(name = "search_type")
    private String searchType = "general";

    @Column(name = "results_count")
    private Integer resultsCount = 0;

    @Column(name = "search_date", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime searchDate;

    // Placeholder for future user authentication
    @Column(name = "user_id")
    private String userId = "default";

    @PrePersist
    public void prePersist() {
        if (this.searchDate == null) {
            this.searchDate = LocalDateTime.now();
        }
    }

    // Constructors
    public SearchHistory() {
    }

    public SearchHistory(String query, String searchType, Integer resultsCount) {
        this.query = query;
        this.searchType = searchType;
        this.resultsCount = resultsCount;
        this.searchDate = LocalDateTime.now();
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

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
