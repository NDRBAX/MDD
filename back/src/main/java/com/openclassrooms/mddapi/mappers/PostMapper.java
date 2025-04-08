package com.openclassrooms.mddapi.mappers;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.openclassrooms.mddapi.dto.request.PostRequestDto;
import com.openclassrooms.mddapi.dto.response.PostResponseDto;
import com.openclassrooms.mddapi.dto.response.PostsFeedResponseDto;
import com.openclassrooms.mddapi.models.Post;

@Mapper(componentModel = "spring", uses = {UserMapper.class, TopicMapper.class, CommentMapper.class})
public interface PostMapper extends EntityMapper<PostsFeedResponseDto, Post> {

     @Override
     @Mapping(target = "author", source = "author.username")
     PostsFeedResponseDto toDto(Post post);

    @Mapping(target = "author", source = "author.username")
    @Mapping(target = "topic", source = "topic.name")
    @Mapping(target = "comments", ignore = true)
    PostResponseDto toDetailDto(Post post);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "author", ignore = true)
    @Mapping(target = "topic", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    Post fromRequestDto(PostRequestDto postRequestDto);

    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "title", ignore = true)
    @Mapping(target = "content", ignore = true)
    @Mapping(target = "author", ignore = true)
    @Mapping(target = "topic", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    Post toEntity(PostsFeedResponseDto dto);
}