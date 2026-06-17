package com.demo.upimesh.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Guards the production bridge endpoint with a shared API key.
 * When no key is configured the filter is bypassed (demo mode).
 */
@Component
@Order(1)
public class BridgeApiKeyFilter extends OncePerRequestFilter {

    @Value("${upi.mesh.bridge.api-key:}")
    private String configuredKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        if (configuredKey.isBlank()) {
            chain.doFilter(request, response);
            return;
        }

        String provided = request.getHeader("X-Api-Key");
        if (!configuredKey.equals(provided)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"missing_or_invalid_api_key\"}");
            return;
        }
        chain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getRequestURI().startsWith("/api/bridge/");
    }
}
