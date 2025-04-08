package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.dto.request.UserUpdateRequestDto;
import com.openclassrooms.mddapi.dto.response.AuthResponseDto;
import com.openclassrooms.mddapi.dto.response.UserResponseDto;

public interface UserService {
    UserResponseDto findByEmail(String email);
    AuthResponseDto update(String email, UserUpdateRequestDto updateDto);
}
