package com.googlev1.dto;

public class SavedItemRequest {
    private String title;
    private String url;
    private String summary;
    
    // Constructors
    public SavedItemRequest() {}
    
    public SavedItemRequest(String title, String url, String summary) {
        this.title = title;
        this.url = url;
        this.summary = summary;
    }
    
    // Getters and Setters
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getUrl() {
        return url;
    }
    
    public void setUrl(String url) {
        this.url = url;
    }
    
    public String getSummary() {
        return summary;
    }
    
    public void setSummary(String summary) {
        this.summary = summary;
    }
}
