package com.openclassrooms.mddapi.services.implementations;

import java.util.List;

import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.dto.TopicDto;
import com.openclassrooms.mddapi.mappers.TopicMapper;
import com.openclassrooms.mddapi.repositories.TopicRepository;
import com.openclassrooms.mddapi.services.ITopicService;

@Service
public class TopicService implements ITopicService {

    private final TopicRepository topicRepository;
    private final TopicMapper topicMapper;

    public TopicService(TopicRepository topicRepository, TopicMapper topicMapper) {
        this.topicRepository = topicRepository;
        this.topicMapper = topicMapper;
    }

    @Override
    public List<TopicDto> getAllTopics() {
        return topicMapper.toDto(topicRepository.findAll());
    }
}
