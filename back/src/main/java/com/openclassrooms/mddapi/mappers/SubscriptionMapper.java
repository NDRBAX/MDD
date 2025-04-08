package com.openclassrooms.mddapi.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.openclassrooms.mddapi.dto.response.SubscriptionResponseDto;
import com.openclassrooms.mddapi.models.Subscription;

@Mapper(componentModel = "spring", uses = { TopicMapper.class })
public interface SubscriptionMapper extends EntityMapper<SubscriptionResponseDto, Subscription> {

    @Override
    @Mapping(target = "topic", source = "topic.name")
    SubscriptionResponseDto toDto(Subscription subscription);

    @Override
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "topic", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    Subscription toEntity(SubscriptionResponseDto dto);
}