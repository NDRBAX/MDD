package com.openclassrooms.mddapi.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


import com.openclassrooms.mddapi.dto.request.UserRegistrationDto;
import com.openclassrooms.mddapi.dto.response.UserResponseDto;
import com.openclassrooms.mddapi.models.User;

@Mapper(componentModel = "spring", uses = {SubscriptionMapper.class})
public interface UserMapper extends EntityMapper<UserResponseDto, User> {
    @Override
    UserResponseDto toDto(User user);

    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "subscriptions", ignore = true)
    User toEntity(UserResponseDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "subscriptions", ignore = true)
    User toEntity(UserRegistrationDto dto);
}