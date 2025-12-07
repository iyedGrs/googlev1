package com.googlev1.dto;

import com.googlev1.entity.SavedItem;
import java.time.LocalDateTime;

public class SavedItemResponse {
    private Long id;
    private String title;
    private String url;
    private String summary;
    private String notes;
    private LocalDateTime savedDate;
    
    // Constructor from entity
    public SavedItemResponse(SavedItem item) {
        this.id = item.getId();
        this.title = item.getTitle();
        this.url = item.getUrl();
        this.summary = item.getSummary();
        this.notes = item.getNotes();
        this.savedDate = item.getSavedDate();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public LocalDateTime getSavedDate() {
        return savedDate;
    }
    
    public void setSavedDate(LocalDateTime savedDate) {
        this.savedDate = savedDate;
    }
}
