package com.openclassrooms.mddapi.services.implementations;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.openclassrooms.mddapi.dto.request.SubscriptionRequestDto;
import com.openclassrooms.mddapi.dto.response.SubscriptionResponseDto;
import com.openclassrooms.mddapi.exceptions.ResourceNotFoundException;
import com.openclassrooms.mddapi.exceptions.SubscriptionException;
import com.openclassrooms.mddapi.mappers.SubscriptionMapper;
import com.openclassrooms.mddapi.models.Subscription;
import com.openclassrooms.mddapi.models.Topic;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repositories.SubscriptionRepository;
import com.openclassrooms.mddapi.repositories.TopicRepository;
import com.openclassrooms.mddapi.repositories.UserRepository;
import com.openclassrooms.mddapi.services.SubscriptionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ISubscriptionService implements SubscriptionService {

        private final SubscriptionRepository subscriptionRepository;
        private final SubscriptionMapper subscriptionMapper;
        private final UserRepository userRepository;
        private final TopicRepository topicRepository;

        @Transactional(readOnly = true)
        @Override
        public List<SubscriptionResponseDto> getAuthenticatedUserSubscriptions(String email) {
                User currentUser = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

                return subscriptionMapper.toDto(subscriptionRepository.findByUser(currentUser));
        }

        @Override
        public void createSubscription(SubscriptionRequestDto subscriptionRequestDto) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String email = authentication.getName();

                User currentUser = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

                Topic topic = topicRepository.findById(subscriptionRequestDto.getTopicId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Topic non trouvé avec l'ID: " + subscriptionRequestDto.getTopicId()));

                if (subscriptionRepository.existsByUserAndTopic(currentUser, topic)) {
                        throw new SubscriptionException("Vous êtes déjà abonné à ce topic");
                }

                Subscription subscription = Subscription.builder()
                                .user(currentUser)
                                .topic(topic)
                                .build();

                subscriptionRepository.save(subscription);
        }

        @Override
        public void deleteSubscription(Long topicId) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String email = authentication.getName();

                User currentUser = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

                Topic topic = topicRepository.findById(topicId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Topic non trouvé avec l'ID: " + topicId));

                Subscription subscription = subscriptionRepository.findByUserAndTopic(currentUser, topic)
                                .orElseThrow(() -> new SubscriptionException("Vous n'êtes pas abonné à ce topic"));

                subscriptionRepository.delete(subscription);
        }
}
