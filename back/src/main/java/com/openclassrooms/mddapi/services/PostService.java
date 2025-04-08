package com.openclassrooms.mddapi.services;

import java.util.List;

import com.openclassrooms.mddapi.dto.request.PostRequestDto;
import com.openclassrooms.mddapi.dto.response.PostResponseDto;
import com.openclassrooms.mddapi.dto.response.PostsFeedResponseDto;

public interface PostService {
    PostsFeedResponseDto createPost(PostRequestDto postRequestDto);
    
    PostResponseDto getPostById(Long postId);
    
    List<PostsFeedResponseDto> getFeedPosts(String sortDirection);
    
    List<PostsFeedResponseDto> getPostsByTopic(Long topicId);
}