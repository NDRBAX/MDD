package com.openclassrooms.mddapi.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.dto.request.SubscriptionRequestDto;
import com.openclassrooms.mddapi.dto.response.SubscriptionResponseDto;
import com.openclassrooms.mddapi.services.SubscriptionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping
    public ResponseEntity<List<SubscriptionResponseDto>> getAuthenticatedUserSubscriptions(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(subscriptionService.getAuthenticatedUserSubscriptions(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<Void> createSubscription(
            @Valid @RequestBody SubscriptionRequestDto subscriptionRequestDto) {
        subscriptionService.createSubscription(subscriptionRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/topic/{topicId}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable("topicId") Long topicId) {
        subscriptionService.deleteSubscription(topicId);
        return ResponseEntity.ok().build();
    }
}