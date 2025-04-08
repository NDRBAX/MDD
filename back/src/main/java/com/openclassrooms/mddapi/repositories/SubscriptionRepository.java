package com.openclassrooms.mddapi.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.openclassrooms.mddapi.models.Subscription;
import com.openclassrooms.mddapi.models.Topic;
import com.openclassrooms.mddapi.models.User;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    @EntityGraph(attributePaths = {"topic"})
    List<Subscription> findByUser(User user);

    Optional<Subscription> findByUserAndTopic(User user, Topic topic);

    boolean existsByUserAndTopic(User user, Topic topic);
}
