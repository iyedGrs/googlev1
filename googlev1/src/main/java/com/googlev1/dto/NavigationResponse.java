package com.googlev1.dto;

import java.util.List;

public class NavigationResponse {
    
    public static class NavLink {
        private String href;
        private String label;
        private String icon;
        
        public NavLink(String href, String label, String icon) {
            this.href = href;
            this.label = label;
            this.icon = icon;
        }
        
        // Getters
        public String getHref() {
            return href;
        }
        
        public String getLabel() {
            return label;
        }
        
        public String getIcon() {
            return icon;
        }
    }
    
    private List<NavLink> links;
    private String statusText;
    
    public NavigationResponse(List<NavLink> links, String statusText) {
        this.links = links;
        this.statusText = statusText;
    }
    
    // Getters
    public List<NavLink> getLinks() {
        return links;
    }
    
    public String getStatusText() {
        return statusText;
    }
}
