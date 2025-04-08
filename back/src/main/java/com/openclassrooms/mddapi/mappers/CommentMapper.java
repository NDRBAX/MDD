package com.openclassrooms.mddapi.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.openclassrooms.mddapi.dto.request.CommentRequestDto;
import com.openclassrooms.mddapi.dto.response.CommentResponseDto;
import com.openclassrooms.mddapi.models.Comment;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface CommentMapper extends EntityMapper<CommentResponseDto, Comment> {
    
     @Mapping(target = "id", ignore = true)
     @Mapping(target = "creationDate", ignore = true)
     @Mapping(target = "author", ignore = true)
     @Mapping(target = "post", ignore = true)
     Comment fromRequestDto(CommentRequestDto commentRequestDto);
 
     @Override
     @Mapping(target = "author", source = "author.username")
     CommentResponseDto toDto(Comment comment);

     @Override
     @Mapping(target = "author", ignore = true)
     @Mapping(target = "post", ignore = true)
     Comment toEntity(CommentResponseDto dto);
}