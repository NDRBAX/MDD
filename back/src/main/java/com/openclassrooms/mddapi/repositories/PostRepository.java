package com.openclassrooms.mddapi.repositories;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.openclassrooms.mddapi.models.Post;
import com.openclassrooms.mddapi.models.Topic;
import com.openclassrooms.mddapi.models.User;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p WHERE p.topic IN (SELECT s.topic FROM Subscription s WHERE s.user = :user) ORDER BY p.creationDate DESC")
    List<Post> findPostsFromSubscribedTopics(@Param("user") User user, Pageable pageable);
    
    @Query("SELECT p FROM Post p JOIN FETCH p.author JOIN FETCH p.topic WHERE p.id = :id")
    Post findPostWithAuthorAndTopic(@Param("id") Long id);
    
    List<Post> findByTopicOrderByCreationDateDesc(Topic topic);
}