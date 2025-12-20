package com.googlev1.controller;

import com.googlev1.dto.ContentResponse;
import com.googlev1.service.ContentService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/content")
public class ContentController {
    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping
    // API: fetches extracted content for a URL; "forceRefresh" bypasses cache when true.
    public ResponseEntity<?> getContent(
            @RequestParam(name = "url") String url,
            @RequestParam(name = "forceRefresh", defaultValue = "false") boolean forceRefresh
    ) {
        if (url == null || url.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "url parameter is required"));
        }

        ContentResponse response = contentService.getContent(url, forceRefresh);
        return ResponseEntity.ok(response);
    }
}
