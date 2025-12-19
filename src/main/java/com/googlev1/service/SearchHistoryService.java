package com.googlev1.service;

import com.googlev1.dto.HistoryRequest;
import com.googlev1.dto.HistoryResponse;
import com.googlev1.entity.SearchHistory;
import com.googlev1.repository.SearchHistoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchHistoryService {

    private final SearchHistoryRepository repository;

    public SearchHistoryService(SearchHistoryRepository repository) {
        this.repository = repository;
    }

    public List<HistoryResponse> getRecentHistory() {
        return repository.findTop20ByOrderBySearchedAtDesc()
                .stream()
                .map(HistoryResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public HistoryResponse saveHistory(HistoryRequest request) {
        if (request.getQuery() == null || request.getQuery().trim().isEmpty()) {
            throw new IllegalArgumentException("Query must not be empty");
        }

        // Normalize search type
        String searchType = request.getSearchType();
        if (searchType == null || searchType.trim().isEmpty()) {
            searchType = "general";
        }
        
        // Idempotency: if the same query+type was saved very recently, return the recent one
        var existing = repository.findFirstByQueryAndSearchTypeOrderBySearchedAtDesc(
            request.getQuery().trim(), 
            searchType
        );
        if (existing.isPresent()) {
            SearchHistory e = existing.get();
            if (e.getSearchedAt() != null) {
                Duration age = Duration.between(e.getSearchedAt(), LocalDateTime.now());
                if (age.toSeconds() < 30) { // considered duplicate within 30s
                    return new HistoryResponse(e);
                }
            }
        }

        SearchHistory entity = new SearchHistory(
            request.getQuery().trim(), 
            searchType, 
            request.getResultsCount()
        );
        SearchHistory saved = repository.save(entity);
        return new HistoryResponse(saved);
    }

    @Transactional
    public void clearAll() {
        repository.deleteAll();
    }
}
