package com.googlev1.dto;

import java.time.LocalDateTime;

public class PreferenceResponse {
    private Long id;
    private String defaultQuery;
    private String defaultType;
    private String theme;
    private Boolean showAdvancedTips;
    private LocalDateTime updatedAt;
    
    // Constructors
    public PreferenceResponse() {}
    
    public PreferenceResponse(Long id, String defaultQuery, String defaultType, String theme, 
                             Boolean showAdvancedTips, LocalDateTime updatedAt) {
        this.id = id;
        this.defaultQuery = defaultQuery;
        this.defaultType = defaultType;
        this.theme = theme;
        this.showAdvancedTips = showAdvancedTips;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getDefaultQuery() {
        return defaultQuery;
    }
    
    public void setDefaultQuery(String defaultQuery) {
        this.defaultQuery = defaultQuery;
    }
    
    public String getDefaultType() {
        return defaultType;
    }
    
    public void setDefaultType(String defaultType) {
        this.defaultType = defaultType;
    }
    
    public String getTheme() {
        return theme;
    }
    
    public void setTheme(String theme) {
        this.theme = theme;
    }
    
    public Boolean getShowAdvancedTips() {
        return showAdvancedTips;
    }
    
    public void setShowAdvancedTips(Boolean showAdvancedTips) {
        this.showAdvancedTips = showAdvancedTips;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
