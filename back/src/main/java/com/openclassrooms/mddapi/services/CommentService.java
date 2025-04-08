package com.openclassrooms.mddapi.services;

import java.util.List;

import com.openclassrooms.mddapi.dto.request.CommentRequestDto;
import com.openclassrooms.mddapi.dto.response.CommentResponseDto;

public interface CommentService {
    CommentResponseDto createComment(CommentRequestDto commentRequestDto);

    List<CommentResponseDto> getCommentsByPostId(Long postId);
}