package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.dto.request.UserLoginRequestDto;
import com.openclassrooms.mddapi.dto.request.UserRegistrationRequestDto;
import com.openclassrooms.mddapi.dto.response.AuthResponseDto;
import com.openclassrooms.mddapi.dto.response.UserResponseDto;
import com.openclassrooms.mddapi.models.User;


public interface AuthService {
    AuthResponseDto register(UserRegistrationRequestDto registrationDto);
    AuthResponseDto login(UserLoginRequestDto loginDto);
    UserResponseDto getCurrentAuthenticatedUser();
    void logout(String token);
    AuthResponseDto authenticateUser(String email, User loadedUser);
}
