package com.openclassrooms.mddapi.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionResponseDto {
    private Long id;
    private TopicResponseDto topic;
    private LocalDateTime creationDate;
}