package com.openclassrooms.mddapi.services.implementations;

import java.util.Collections;
import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.dto.request.UserLoginDto;
import com.openclassrooms.mddapi.dto.request.UserRegistrationDto;
import com.openclassrooms.mddapi.dto.response.AuthResponseDto;
import com.openclassrooms.mddapi.dto.response.UserResponseDto;
import com.openclassrooms.mddapi.exceptions.ResourceNotFoundException;
import com.openclassrooms.mddapi.exceptions.UserAlreadyExistsException;
import com.openclassrooms.mddapi.mappers.UserMapper;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repositories.UserRepository;
import com.openclassrooms.mddapi.security.JwtTokenProvider;
import com.openclassrooms.mddapi.security.RefreshTokenService;
import com.openclassrooms.mddapi.services.AuthService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IAuthService implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional
    public AuthResponseDto register(UserRegistrationDto registrationDto) {
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new UserAlreadyExistsException("Email déjà utilisé");
        }

        if (userRepository.existsByUsername(registrationDto.getUsername())) {
            throw new UserAlreadyExistsException("Nom d'utilisateur déjà utilisé");
        }

        User user = userMapper.toEntity(registrationDto);
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user = userRepository.save(user);

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    registrationDto.getEmail(),
                    registrationDto.getPassword()));

        return authenticateUser(user.getEmail(), user);
    }

    @Override
    public AuthResponseDto login(UserLoginDto loginDto) {
        // Check if identifier is email or username
        Optional<User> user;
        if (loginDto.getIdentifier().contains("@")) {
            user = userRepository.findByEmail(loginDto.getIdentifier());
        } else {
            user = userRepository.findByUsername(loginDto.getIdentifier());
        }

        if (user.isEmpty()) {
            throw new ResourceNotFoundException("Utilisateur non trouvé");
        }

        // Authentication
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    user.get().getEmail(),
                    loginDto.getPassword()));

        // Fetch user with subscriptions
        User userWithSubscriptions = userRepository.findUserWithSubscriptionsByEmail(user.get().getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        return authenticateUser(userWithSubscriptions.getEmail(), userWithSubscriptions);
    }


    @Override
    @Transactional
    public void logout(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwtToken = token.substring(7);
            String email = jwtTokenProvider.getUsernameFromToken(jwtToken);

            jwtTokenProvider.revokeToken(jwtToken);

            // Revoke all refresh tokens for the user
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

            refreshTokenService.revokeAllUserRefreshTokens(user);
        }
    }

    @Override
    public UserResponseDto getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User authenticatedUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur authentifié non trouvé"));

        return userMapper.toDto(authenticatedUser);
    }


    @Override
    public AuthResponseDto authenticateUser(String email, User loadedUser) {
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                email, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Access token generation
        String accessToken = jwtTokenProvider.generateAccessToken(authentication);

        // Refresh token generation
        String refreshToken = refreshTokenService.createRefreshToken(email).getToken();

        return AuthResponseDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(userMapper.toDto(loadedUser))
                .build();
    }
}
