package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.dto.request.SubscriptionRequestDto;


public interface SubscriptionService {

    void createSubscription(SubscriptionRequestDto subscriptionRequestDto);

    void deleteSubscription(Long topicId);

}
