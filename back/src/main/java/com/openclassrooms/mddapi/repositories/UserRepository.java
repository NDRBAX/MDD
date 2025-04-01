package com.openclassrooms.mddapi.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.openclassrooms.mddapi.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    @EntityGraph(attributePaths = { "subscriptions", "subscriptions.topic" })
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findUserWithSubscriptionsByEmail(@Param("email") String email);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}