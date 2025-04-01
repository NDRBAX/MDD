package com.openclassrooms.mddapi.repositories;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.openclassrooms.mddapi.models.RefreshToken;
import com.openclassrooms.mddapi.models.User;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    List<RefreshToken> findByUser(User user);
    
    @Modifying
    @Query("UPDATE RefreshToken r SET r.revoked = TRUE WHERE r.user = ?1 AND r.revoked = FALSE")
    void revokeAllUserTokens(User user);
    
    @Modifying
    @Query("DELETE FROM RefreshToken r WHERE r.expiryDate < ?1")
    void deleteAllExpiredTokens(Instant now);
}