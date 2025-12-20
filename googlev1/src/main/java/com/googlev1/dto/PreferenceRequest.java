package com.googlev1.dto;

public class PreferenceRequest {
    private String defaultQuery;
    private String defaultType;
    private String theme;
    private Boolean showAdvancedTips;
    
    // Constructors
    public PreferenceRequest() {}
    
    public PreferenceRequest(String defaultQuery, String defaultType, String theme, Boolean showAdvancedTips) {
        this.defaultQuery = defaultQuery;
        this.defaultType = defaultType;
        this.theme = theme;
        this.showAdvancedTips = showAdvancedTips;
    }
    
    // Getters and Setters
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
}
