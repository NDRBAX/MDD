package com.openclassrooms.mddapi.configurations;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
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

                log.info("Default users created");
            }
        };
    }
}