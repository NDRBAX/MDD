package com.openclassrooms.mddapi.services;

import java.util.List;

import com.openclassrooms.mddapi.dto.TopicDto;

public interface ITopicService {
    List<TopicDto> getAllTopics();
}
