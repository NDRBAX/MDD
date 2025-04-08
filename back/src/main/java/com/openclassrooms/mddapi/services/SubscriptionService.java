package com.openclassrooms.mddapi.services;

import java.util.List;

import com.openclassrooms.mddapi.dto.request.SubscriptionRequestDto;
import com.openclassrooms.mddapi.dto.response.SubscriptionResponseDto;

public interface SubscriptionService {

    List<SubscriptionResponseDto> getAuthenticatedUserSubscriptions(String email);

    void createSubscription(SubscriptionRequestDto subscriptionRequestDto);

    void deleteSubscription(Long topicId);

}
