package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.dto.request.UserLoginDto;
import com.openclassrooms.mddapi.dto.request.UserRegistrationDto;
import com.openclassrooms.mddapi.dto.response.AuthResponseDto;
import com.openclassrooms.mddapi.dto.response.UserResponseDto;


public interface AuthService {
    AuthResponseDto register(UserRegistrationDto registrationDto);
    AuthResponseDto login(UserLoginDto loginDto);
    UserResponseDto getCurrentAuthenticatedUser();
}
