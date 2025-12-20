-- H2 Database Initialization Script
-- This file seeds initial data and setup

-- Initialize UserPreference table with default values
INSERT INTO USER_PREFERENCE (default_query, default_type, theme, show_advanced_tips, updated_at)
SELECT 'latest news', 'general', 'light', true, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM USER_PREFERENCE LIMIT 1);

-- Note: search_history and saved_item tables will be created automatically by JPA
-- No initial data needed for these tables as they will be populated by user actions

