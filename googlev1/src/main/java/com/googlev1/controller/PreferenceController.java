package com.googlev1.controller;

import com.googlev1.dto.PreferenceResponse;
import com.googlev1.entity.UserPreference;
import com.googlev1.service.PreferenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/preferences")
@CrossOrigin(origins = "*")
public class PreferenceController {
    
    @Autowired
    private PreferenceService preferenceService;
    
    /**
     * GET /api/preferences/search
     * Returns the latest user preferences for search
     */
    @GetMapping("/search")
    public ResponseEntity<PreferenceResponse> getSearchPreferences() {
        UserPreference preferences = preferenceService.getLatestPreferences();
        PreferenceResponse response = new PreferenceResponse(
            preferences.getId(),
            preferences.getDefaultQuery(),
            preferences.getDefaultType(),
            preferences.getTheme(),
            preferences.getShowAdvancedTips(),
            preferences.getUpdatedAt()
        );
        return ResponseEntity.ok(response);
    }
    
    /**
     * PUT /api/preferences/search
     * Updates user preferences for search
     */
    @PutMapping("/search")
    public ResponseEntity<PreferenceResponse> updateSearchPreferences(@RequestBody UserPreference updateData) {
        UserPreference existing = preferenceService.getLatestPreferences();
        UserPreference updated = preferenceService.updatePreferences(existing, updateData);
        
        PreferenceResponse response = new PreferenceResponse(
            updated.getId(),
            updated.getDefaultQuery(),
            updated.getDefaultType(),
            updated.getTheme(),
            updated.getShowAdvancedTips(),
            updated.getUpdatedAt()
        );
        return ResponseEntity.ok(response);
    }
}
