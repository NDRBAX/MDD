package com.openclassrooms.mddapi.security;

import java.time.Instant;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.openclassrooms.mddapi.dto.response.TokenResponseDto;
import com.openclassrooms.mddapi.exceptions.TokenRefreshException;
import com.openclassrooms.mddapi.models.RefreshToken;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repositories.RefreshTokenRepository;
import com.openclassrooms.mddapi.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    @Value("${app.jwt-refresh-expiration-milliseconds}")
    private long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public RefreshToken createRefreshToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Revoke all existing tokens for the user
        refreshTokenRepository.revokeAllUserTokens(user);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshTokenDurationMs))
                .revoked(false)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    @Transactional
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.isRevoked() || token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token was expired or revoked");
        }

        return token;
    }

    @Transactional
    public void revokeRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new TokenRefreshException(token, "Refresh token not found"));

        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
    }

    @Transactional
    public TokenResponseDto refreshToken(String requestRefreshToken) {
        return refreshTokenRepository.findByToken(requestRefreshToken)
                .map(this::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String accessToken = jwtTokenProvider.generateAccessTokenFromEmail(user.getEmail());

                    return TokenResponseDto.builder()
                            .accessToken(accessToken)
                            .refreshToken(requestRefreshToken)
                            .build();
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken, "Refresh token not found"));
    }

    @Transactional
    public void revokeAllUserRefreshTokens(User user) {
        refreshTokenRepository.revokeAllUserTokens(user);
    }

    // Cleanup expired tokens every 24 hours
    @Transactional
    @Scheduled(fixedRate = 24 * 60 * 60 * 1000)
    public void cleanupExpiredTokens() {
        refreshTokenRepository.deleteAllExpiredTokens(Instant.now());
    }
}