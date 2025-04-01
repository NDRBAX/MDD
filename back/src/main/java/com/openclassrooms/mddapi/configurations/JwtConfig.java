package com.openclassrooms.mddapi.configurations;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import com.nimbusds.jose.Algorithm;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class JwtConfig {

    @Value("${app.jwt.public-key}")
    private RSAPublicKey publicKey;

    @Value("${app.jwt.private-key}")
    private RSAPrivateKey privateKey;

    @Value("${app.jwt.key-id}")
    private String keyId;

    @Value("#{'${app.jwt.allowed-issuers}'.split(',')}")
    private List<String> allowedIssuers;

    @Value("${app.jwt.audience}")
    private String audience;

    @Bean
    public JwtDecoder jwtDecoder() {
        log.error("Allowed issuers: {}", allowedIssuers);

        NimbusJwtDecoder decoder = NimbusJwtDecoder.withPublicKey(publicKey).build();
        decoder.setJwtValidator(token ->  {
            log.info("Validation of the token : {}", token);
            // Check the audience of the token (check for null first)
            if (token.getAudience() == null || !token.getAudience().contains(audience)) {
                return OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_audience", 
                    "Token audience is missing or invalid", null));
            }

            // Check the audience of the token
            if (!token.getAudience().contains(audience)) {
                return OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_audience"));
            }

            // Check the issuer of the token
            if (token.getIssuer() == null) {
                return OAuth2TokenValidatorResult.failure(
                    new OAuth2Error("invalid_issuer", "Token issuer is missing", null));
            }

            // Check the issuer of the token
            String issuer = token.getIssuer().toString();
            if (!allowedIssuers.contains(issuer)) {
                log.warn("Token with invalid issuer: {}", issuer);
                return OAuth2TokenValidatorResult.failure(
                    new OAuth2Error("invalid_issuer", "The issuer is not in the list of allowed issuers", null));
            }

            // Check the expiration date of the token
            Instant expiresAt = token.getExpiresAt();
            if (expiresAt != null && expiresAt.isBefore(Instant.now())) {
                return OAuth2TokenValidatorResult.failure(new OAuth2Error("token_expired", "Token has expired", null));
            }

            // Check the not before date of the token
            Instant notBefore = token.getNotBefore();
            if (notBefore != null && notBefore.isAfter(Instant.now())) {
                return OAuth2TokenValidatorResult.failure(new OAuth2Error("token_not_valid_yet", "Token is not valid yet", null));
            }

            return OAuth2TokenValidatorResult.success();
        });
        return decoder;
    }

    @Bean
    public JwtEncoder jwtEncoder() {
        JWK jwk = new RSAKey.Builder(publicKey)
        .privateKey(privateKey)
        .algorithm(new Algorithm("RS256"))
        .keyID(keyId)
        .build();
        JWKSource<SecurityContext> jwkSource = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwkSource);
    }
}