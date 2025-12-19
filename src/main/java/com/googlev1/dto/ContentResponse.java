package com.googlev1.dto;

import java.time.LocalDateTime;

public class ContentResponse {
    private String url;
    private String title;
    private String content;
    private int wordCount;
    private LocalDateTime fetchedAt;
    private boolean cached;

    public ContentResponse() {
    }

    public ContentResponse(String url, String title, String content, int wordCount, LocalDateTime fetchedAt, boolean cached) {
        this.url = url;
        this.title = title;
        this.content = content;
        this.wordCount = wordCount;
        this.fetchedAt = fetchedAt;
        this.cached = cached;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getWordCount() {
        return wordCount;
    }

    public void setWordCount(int wordCount) {
        this.wordCount = wordCount;
    }

    public LocalDateTime getFetchedAt() {
        return fetchedAt;
    }

    public void setFetchedAt(LocalDateTime fetchedAt) {
        this.fetchedAt = fetchedAt;
    }

    public boolean isCached() {
        return cached;
    }

    public void setCached(boolean cached) {
        this.cached = cached;
    }
}
