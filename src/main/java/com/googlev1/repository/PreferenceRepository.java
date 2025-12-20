package com.googlev1.repository;

import com.googlev1.entity.UserPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PreferenceRepository extends JpaRepository<UserPreference, Long> {
    
    @Query(value = "SELECT * FROM user_preference ORDER BY updated_at DESC LIMIT 1", nativeQuery = true)
    Optional<UserPreference> findLatest();
}
