package com.openclassrooms.mddapi.services.implementations;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.dto.request.UserUpdateDto;
import com.openclassrooms.mddapi.dto.response.AuthResponseDto;
import com.openclassrooms.mddapi.dto.response.UserResponseDto;
import com.openclassrooms.mddapi.exceptions.ResourceNotFoundException;
import com.openclassrooms.mddapi.exceptions.UserAlreadyExistsException;
import com.openclassrooms.mddapi.mappers.UserMapper;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repositories.UserRepository;
import com.openclassrooms.mddapi.services.AuthService;
import com.openclassrooms.mddapi.services.UserService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IUserService implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDto findByEmail(String email) {
        return userRepository.findUserWithSubscriptionsByEmail(email)
                .map(userMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'email: " + email));
    }

    @Override
    @Transactional
    public UserResponseDto update(String email, UserUpdateDto updateDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'email: " + email));

        boolean emailChanged = false;

        // Update user's email if provided and not already used
        if (updateDto.getEmail() != null && !updateDto.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(updateDto.getEmail())) {
                throw new UserAlreadyExistsException("Email déjà utilisé");
            }

            emailChanged = true;
            user.setEmail(updateDto.getEmail());
        }

        // Update user's username if provided and not already used
        if (updateDto.getUsername() != null && !updateDto.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(updateDto.getUsername())) {
                throw new UserAlreadyExistsException("Nom d'utilisateur déjà utilisé");
            }
            user.setUsername(updateDto.getUsername());
        }

        // Update user's password if provided
        if (updateDto.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(updateDto.getPassword()));
        }

        user = userRepository.save(user);

        User userWithSubscriptions = userRepository.findUserWithSubscriptionsByEmail(user.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        UserResponseDto responseDto = userMapper.toDto(userWithSubscriptions);

        if (emailChanged) {
            AuthResponseDto authResponse = authService.authenticateUser(user.getEmail(), userWithSubscriptions);
            responseDto.setNewAccessToken(authResponse.getAccessToken());
            responseDto.setNewRefreshToken(authResponse.getRefreshToken());
        }

        return responseDto;
    }
}
