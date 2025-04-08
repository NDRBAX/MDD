package com.openclassrooms.mddapi.configurations;

import java.time.LocalDateTime;
import java.util.Arrays;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.openclassrooms.mddapi.models.Comment;
import com.openclassrooms.mddapi.models.Post;
import com.openclassrooms.mddapi.models.Subscription;
import com.openclassrooms.mddapi.models.Topic;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repositories.CommentRepository;
import com.openclassrooms.mddapi.repositories.PostRepository;
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
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @Profile("!prod")
    public CommandLineRunner initializeData() {
        return _ -> {
            User admin = createUsersIfNotExist();

            createPostsAndCommentsIfNotExist(admin);
            
            log.info("Initialization complete");
        };
    }
    
    private User createUsersIfNotExist() {
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
            return admin;
        }
        
        return userRepository.findByUsername("admin").orElse(null);
    }
    
    private void createPostsAndCommentsIfNotExist(User author) {
        if (postRepository.count() == 0 && author != null) {
            Topic topic1 = topicRepository.findByName("Blockchain").orElse(null);
            Topic topic2 = topicRepository.findByName("IoT").orElse(null);
            Topic topic3 = topicRepository.findByName("Architecture").orElse(null);
            
            if (topic1 != null && topic2 != null && topic3 != null) {
                Post post1 = new Post();
                post1.setTitle("Introduction à Spring Boot");
                post1.setContent("Spring Boot est un framework qui simplifie le développement d'applications Spring en fournissant des configurations par défaut et en éliminant une grande partie du travail de configuration. Ce framework vous permet de démarrer rapidement avec un minimum de configuration.");
                post1.setAuthor(author);
                post1.setTopic(topic1);
                post1.setCreationDate(LocalDateTime.now().minusDays(2));
                
                Post post2 = new Post();
                post2.setTitle("Les bases de React");
                post2.setContent("React est une bibliothèque JavaScript pour construire des interfaces utilisateur, particulièrement pour les applications d'une seule page. React vous permet de créer des composants réutilisables et de gérer efficacement l'état de votre application.");
                post2.setAuthor(author);
                post2.setTopic(topic2);
                post2.setCreationDate(LocalDateTime.now().minusDays(1));
                
                Post post3 = new Post();
                post3.setTitle("Sécurité avec JWT");
                post3.setContent("Les JSON Web Tokens (JWT) sont un standard ouvert pour créer des tokens d'accès qui peuvent être utilisés pour authentifier et autoriser les utilisateurs. Cet article explique comment implémenter JWT dans vos applications.");
                post3.setAuthor(author);
                post3.setTopic(topic3);
                post3.setCreationDate(LocalDateTime.now().minusHours(5));
                
                post1 = postRepository.save(post1);
                post2 = postRepository.save(post2);
                post3 = postRepository.save(post3);
                
                log.info("Sample posts created");
                
                createComments(post1, author);
                createComments(post2, author);
                createComments(post3, author);
                
                log.info("Sample comments created");
            } else {
                log.warn("Cannot create posts: some topics are missing");
            }
        }
    }
    
    private void createComments(Post post, User author) {
        Comment comment1 = new Comment();
        comment1.setContent("Excellent article ! Très instructif et bien écrit.");
        comment1.setAuthor(author);
        comment1.setPost(post);
        comment1.setCreationDate(LocalDateTime.now().minusHours(2));
        
        Comment comment2 = new Comment();
        comment2.setContent("J'aimerais en savoir plus sur ce sujet. Pourriez-vous faire un article plus détaillé ?");
        comment2.setAuthor(author);
        comment2.setPost(post);
        comment2.setCreationDate(LocalDateTime.now().minusHours(1));
        
        commentRepository.save(comment1);
        commentRepository.save(comment2);
    }
}