package com.openclassrooms.mddapi.services;

import java.util.List;

import com.openclassrooms.mddapi.dto.response.TopicResponseDto;

public interface TopicService {
    List<TopicResponseDto> getAllTopics();
}
