package com.openclassrooms.mddapi.dto.response;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private Long id;
    private String email;
    private String username;
    private String newAccessToken;
    private String newRefreshToken; 
    private Set<SubscriptionResponseDto> subscriptions;
}