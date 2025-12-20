package com.googlev1.repository;

import com.googlev1.entity.ContentCacheEntry;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentCacheRepository extends JpaRepository<ContentCacheEntry, Long> {
    Optional<ContentCacheEntry> findByUrl(String url);

    long deleteByFetchedAtBefore(LocalDateTime cutoff);
}
