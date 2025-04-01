package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.dto.request.UserUpdateDto;
import com.openclassrooms.mddapi.dto.response.UserResponseDto;

public interface UserService {
    UserResponseDto findByEmail(String email);
    UserResponseDto update(String email, UserUpdateDto updateDto);
}
