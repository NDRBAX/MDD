package com.openclassrooms.mddapi.mappers;

import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

import com.openclassrooms.mddapi.dto.response.TopicResponseDto;
import com.openclassrooms.mddapi.models.Topic;

@Component
@Mapper(componentModel = "spring")
public interface TopicMapper extends EntityMapper<TopicResponseDto, Topic> {

        @Override
        TopicResponseDto toDto(Topic topic);
        
        @Override
        Topic toEntity(TopicResponseDto dto);
}
