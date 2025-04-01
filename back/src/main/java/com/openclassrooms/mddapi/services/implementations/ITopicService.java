package com.openclassrooms.mddapi.services.implementations;

import java.util.List;

import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.dto.response.TopicResponseDto;
import com.openclassrooms.mddapi.mappers.TopicMapper;
import com.openclassrooms.mddapi.repositories.TopicRepository;
import com.openclassrooms.mddapi.services.TopicService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ITopicService implements TopicService {

    private final TopicRepository topicRepository;
    private final TopicMapper topicMapper;

    @Override
    public List<TopicResponseDto> getAllTopics() {
        return topicMapper.toDto(topicRepository.findAll());
    }
}
