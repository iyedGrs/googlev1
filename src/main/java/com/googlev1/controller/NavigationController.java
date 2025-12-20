package com.googlev1.controller;

import com.googlev1.dto.NavigationResponse;
import com.googlev1.dto.NavigationResponse.NavLink;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class NavigationController {
    
    /**
     * GET /api/navigation
     * Returns navigation links and status text for the app
     * Used by all pages to maintain consistent navigation
     */
    @GetMapping("/navigation")
    public ResponseEntity<NavigationResponse> getNavigation() {
        List<NavLink> links = Arrays.asList(
            new NavLink("/", "Search", "🔍"),
            new NavLink("/saved.html", "Saved", "⭐"),
            new NavLink("/history.html", "History", "📜")
        );
        
        NavigationResponse response = new NavigationResponse(
            links,
            "API: OK"  // Placeholder for Iyed's status badge data
        );
        
        return ResponseEntity.ok(response);
    }
}
