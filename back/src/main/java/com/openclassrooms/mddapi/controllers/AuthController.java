package com.openclassrooms.mddapi.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.dto.request.TokenRefreshRequestDto;
import com.openclassrooms.mddapi.dto.request.UserLoginDto;
import com.openclassrooms.mddapi.dto.request.UserRegistrationDto;
import com.openclassrooms.mddapi.dto.response.AuthResponseDto;
import com.openclassrooms.mddapi.dto.response.TokenRefreshResponseDto;
import com.openclassrooms.mddapi.exceptions.TokenRefreshException;
import com.openclassrooms.mddapi.models.RefreshToken;
import com.openclassrooms.mddapi.repositories.RefreshTokenRepository;
import com.openclassrooms.mddapi.security.JwtTokenProvider;
import com.openclassrooms.mddapi.security.RefreshTokenService;
import com.openclassrooms.mddapi.services.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;


    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody UserRegistrationDto registrationDto) {
        return ResponseEntity.ok(authService.register(registrationDto));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody UserLoginDto loginDto) {
        return ResponseEntity.ok(authService.login(loginDto));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authHeader) {
        authService.logout(authHeader);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<TokenRefreshResponseDto> refreshToken(@Valid @RequestBody TokenRefreshRequestDto request) {
        TokenRefreshResponseDto response = refreshTokenService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(response);
    }
}