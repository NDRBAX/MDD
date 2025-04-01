package com.openclassrooms.mddapi.security;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenRevocationList {
    
    private final Map<String, Instant> revokedTokens = new ConcurrentHashMap<>();
    
    public void revokeToken(String token, Instant expiryTime) {
        revokedTokens.put(token, expiryTime);
    }
    
    public boolean isTokenRevoked(String token) {
        return revokedTokens.containsKey(token);
    }
    
    // Cleanup blacklisted tokens every hour
    @Scheduled(fixedRate = 3600000)
    public void cleanupExpiredTokens() {
        Instant now = Instant.now();
        revokedTokens.entrySet().removeIf(entry -> entry.getValue().isBefore(now));
    }
}
