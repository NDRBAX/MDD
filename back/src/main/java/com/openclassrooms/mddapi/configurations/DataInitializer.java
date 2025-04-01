package com.openclassrooms.mddapi.configurations;

import java.util.Arrays;
import java.util.concurrent.Flow;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.openclassrooms.mddapi.models.Subscription;
import com.openclassrooms.mddapi.models.Topic;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repositories.SubscriptionRepository;
import com.openclassrooms.mddapi.repositories.TopicRepository;
import com.openclassrooms.mddapi.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @Profile("!prod")
    public CommandLineRunner initializeUsers() {
        return _ -> {
            if (userRepository.count() == 0) {
                User admin = User.builder()
                        .email("admin@mdd.com")
                        .username("admin")
                        .password(passwordEncoder.encode("Password1!"))
                        .build();

                User user1 = User.builder()
                        .email("user1@example.com")
                        .username("user1")
                        .password(passwordEncoder.encode("Password1!"))
                        .build();

                userRepository.save(admin);
                userRepository.save(user1);

                Topic blockchain = topicRepository.findByName("Blockchain").orElse(null);
                Topic iot = topicRepository.findByName("IoT").orElse(null);
                Topic architecture = topicRepository.findByName("Architecture").orElse(null);

                if (blockchain != null && iot != null) {
                    Subscription sub1 = Subscription.builder()
                            .user(admin)
                            .topic(blockchain)
                            .build();
                    Subscription sub2 = Subscription.builder()
                            .user(admin)
                            .topic(iot)
                            .build();
                    subscriptionRepository.saveAll(Arrays.asList(sub1, sub2));
                }

                if (architecture != null) {
                    Subscription sub3 = Subscription.builder()
                            .user(user1)
                            .topic(architecture)
                            .build();
                    subscriptionRepository.save(sub3);
                }

                log.info("Default users created");
            }
        };
    }
}