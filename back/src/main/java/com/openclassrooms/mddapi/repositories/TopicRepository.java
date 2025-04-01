package com.openclassrooms.mddapi.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.openclassrooms.mddapi.models.Topic;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    Optional<Topic> findByName(String name);
    
}

