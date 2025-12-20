package com.googlev1.service;

import com.googlev1.entity.UserPreference;
import com.googlev1.repository.PreferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PreferenceService {
    
    @Autowired
    private PreferenceRepository preferenceRepository;
    
    /**
     * Get the latest user preferences or return defaults if none exist
     */
    public UserPreference getLatestPreferences() {
        return preferenceRepository.findLatest()
                .orElseGet(() -> new UserPreference(
                    "latest news",
                    "general",
                    "light",
                    true
                ));
    }
    
    /**
     * Save or update user preferences
     */
    public UserPreference savePreferences(UserPreference preference) {
        if (preference.getId() == null) {
            // New preference
            return preferenceRepository.save(preference);
        } else {
            // Update existing
            return preferenceRepository.save(preference);
        }
    }
    
    /**
     * Update preferences from request data
     */
    public UserPreference updatePreferences(UserPreference existingPreference, UserPreference updateData) {
        if (updateData.getDefaultQuery() != null) {
            existingPreference.setDefaultQuery(updateData.getDefaultQuery());
        }
        if (updateData.getDefaultType() != null) {
            existingPreference.setDefaultType(updateData.getDefaultType());
        }
        if (updateData.getTheme() != null) {
            existingPreference.setTheme(updateData.getTheme());
        }
        if (updateData.getShowAdvancedTips() != null) {
            existingPreference.setShowAdvancedTips(updateData.getShowAdvancedTips());
        }
        return preferenceRepository.save(existingPreference);
    }
}
