package com.openclassrooms.mddapi.exceptions;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
public class JwtExceptionHandler {
    
    @ExceptionHandler(JwtException.class)
    public ResponseEntity<Object> handleJwtException(JwtException ex) {
        log.error("JWT exception: {}", ex.getMessage());
        
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Invalid token");
        body.put("message", "Authentication token is invalid or expired");
        
        return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(TokenRefreshException.class)
    public ResponseEntity<Object> handleTokenRefreshException(TokenRefreshException ex) {
        log.error("Refresh token exception: {}", ex.getMessage());
        
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Invalid refresh token");
        body.put("message", ex.getMessage());
        
        return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDeniedException(org.springframework.security.access.AccessDeniedException ex) {
        log.error("Access denied: {}", ex.getMessage());
        
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Access denied");
        body.put("message", "You do not have permission to access this resource");
        
        return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
    }

    
}