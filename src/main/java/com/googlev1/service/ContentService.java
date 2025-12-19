package com.googlev1.service;

import com.googlev1.dto.ContentResponse;
import com.googlev1.entity.ContentCacheEntry;
import com.googlev1.repository.ContentCacheRepository;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class ContentService {
    private static final int CACHE_TTL_HOURS = 24;
    private static final int MAX_BODY_LENGTH = 200_000;

    private final ContentCacheRepository contentCacheRepository;
    private final HttpClient httpClient;

    public ContentService(ContentCacheRepository contentCacheRepository) {
        this.contentCacheRepository = contentCacheRepository;
        this.httpClient = HttpClient.newBuilder()
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
    }

    public ContentResponse getContent(String url, boolean forceRefresh) {
        LocalDateTime now = LocalDateTime.now();
        if (!forceRefresh) {
            Optional<ContentCacheEntry> cached = contentCacheRepository.findByUrl(url);
            if (cached.isPresent() && !isStale(cached.get(), now)) {
                return toResponse(cached.get(), true);
            }
        }

        ContentCacheEntry fresh = fetchAndNormalize(url, now);
        contentCacheRepository.save(fresh);
        return toResponse(fresh, false);
    }

    public int evictStaleEntries() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(CACHE_TTL_HOURS);
        return (int) contentCacheRepository.deleteByFetchedAtBefore(cutoff);
    }

    private boolean isStale(ContentCacheEntry entry, LocalDateTime now) {
        return entry.getFetchedAt() == null || entry.getFetchedAt().isBefore(now.minusHours(CACHE_TTL_HOURS));
    }

    private ContentCacheEntry fetchAndNormalize(String url, LocalDateTime now) {
        String html = fetchHtml(url);
        String title = extractTitle(html);
        String text = extractText(html);
        if (title == null || title.isBlank()) {
            title = url;
        }
        if (text.isBlank()) {
            text = "No readable content was extracted from this page.";
        }

        int wordCount = countWords(text);
        return new ContentCacheEntry(url, title, text, wordCount, now);
    }

    private String fetchHtml(String url) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .header("User-Agent", "GoogleV1/1.0")
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                throw new IllegalStateException("Failed to fetch content. Status: " + response.statusCode());
            }
            return response.body();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Unable to fetch content: " + e.getMessage(), e);
        } catch (IllegalArgumentException | IOException e) {
            throw new IllegalStateException("Unable to fetch content: " + e.getMessage(), e);
        }
    }

    private String extractTitle(String html) {
        String lower = html.toLowerCase(Locale.ROOT);
        int start = lower.indexOf("<title>");
        int end = lower.indexOf("</title>");
        if (start >= 0 && end > start) {
            String title = html.substring(start + 7, end);
            return title.replaceAll("\\s+", " ").trim();
        }
        return null;
    }

    private String extractText(String html) {
        String withoutScripts = html.replaceAll("(?is)<script.*?>.*?</script>", " ")
                .replaceAll("(?is)<style.*?>.*?</style>", " ");
        String noTags = withoutScripts.replaceAll("(?is)<[^>]+>", " ");
        String normalized = noTags.replaceAll("\\s+", " ").trim();
        if (normalized.length() > MAX_BODY_LENGTH) {
            return normalized.substring(0, MAX_BODY_LENGTH) + "...";
        }
        return normalized;
    }

    private int countWords(String text) {
        String trimmed = text.trim();
        if (trimmed.isEmpty()) {
            return 0;
        }
        return trimmed.split("\\s+").length;
    }

    private ContentResponse toResponse(ContentCacheEntry entry, boolean cached) {
        return new ContentResponse(
                entry.getUrl(),
                entry.getTitle(),
                entry.getBody(),
                entry.getWordCount(),
                entry.getFetchedAt(),
                cached
        );
    }
}
