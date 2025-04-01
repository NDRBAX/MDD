package com.openclassrooms.mddapi.security;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;
    private final JwtTokenRevocationList jwtTokenRevocationList;

    @Value("${app.jwt-access-expiration-milliseconds}")
    private long jwtAccessExpirationInMs;

    @Value("${app.jwt.issuer}")
    private String issuer;

    @Value("${app.jwt.audience}")
    private String audience;


    public String generateAccessToken(Authentication authentication) {
        Instant now = Instant.now();
        
        String scope = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));
        
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuer)
                .issuedAt(now)
                .expiresAt(now.plus(jwtAccessExpirationInMs, ChronoUnit.MILLIS))
                .subject(authentication.getName())
                .claim("scope", scope)
                .claim("tokenType", "access")
                .audience(List.of(audience)) 
                .build();
        
        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
    
    public String generateAccessTokenFromEmail(String email) {
        Instant now = Instant.now();
        
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuer)
                .issuedAt(now)
                .expiresAt(now.plus(jwtAccessExpirationInMs, ChronoUnit.MILLIS))
                .subject(email)
                .claim("scope", "ROLE_USER")
                .claim("tokenType", "access")
                .audience(List.of(audience)) 
                .build();
        
        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    public boolean validateToken(String token) {
        try {
            if (jwtTokenRevocationList.isTokenRevoked(token)) {
                return false;
            }
            jwtDecoder.decode(token);
            return true;
        } catch (JwtException e) {
            System.out.println("Invalid JWT token: " + e.getMessage());
            return false;
        }
    }

    public void revokeToken(String token) {
        Jwt jwt = jwtDecoder.decode(token);
        jwtTokenRevocationList.revokeToken(token, jwt.getExpiresAt());
    }

    public String getUsernameFromToken(String token) {
        return jwtDecoder.decode(token).getSubject();
    }
    

    public Jwt decodeToken(String token) {
        return jwtDecoder.decode(token);
    }
}