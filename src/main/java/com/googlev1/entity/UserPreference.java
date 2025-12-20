package com.googlev1.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_preference")
public class UserPreference {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "default_query")
    private String defaultQuery;
    
    @Column(name = "default_type")
    private String defaultType = "general";
    
    @Column(name = "theme")
    private String theme = "light";
    
    @Column(name = "show_advanced_tips")
    private Boolean showAdvancedTips = true;
    
    @Column(name = "updated_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;
    
    @PreUpdate
    @PrePersist
    public void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public UserPreference() {}
    
    public UserPreference(String defaultQuery, String defaultType, String theme, Boolean showAdvancedTips) {
        this.defaultQuery = defaultQuery;
        this.defaultType = defaultType;
        this.theme = theme;
        this.showAdvancedTips = showAdvancedTips;
        this.updatedAt = LocalDateTime.now();
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
