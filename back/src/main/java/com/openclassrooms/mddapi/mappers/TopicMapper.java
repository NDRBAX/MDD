package com.openclassrooms.mddapi.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.springframework.stereotype.Component;

import com.openclassrooms.mddapi.dto.TopicDto;
import com.openclassrooms.mddapi.models.Topic;

@Component
@Mapper(componentModel = "spring")
public abstract class TopicMapper implements EntityMapper<TopicDto, Topic> {

        @Mappings({
                @Mapping(target = "id", source = "id"),
                @Mapping(target = "name", source = "name"),
                @Mapping(target = "description", source = "description")
        })
        @Override
        public abstract TopicDto toDto(Topic topic);

        protected boolean isCurrentUserSubscribed(Topic topic) {
                return true;
        }

}
