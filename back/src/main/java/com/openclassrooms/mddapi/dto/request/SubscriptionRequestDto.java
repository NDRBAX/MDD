package com.openclassrooms.mddapi.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionRequestDto {
    
    @NotNull(message = "L'ID du sujet est obligatoire")
    private Long topicId;
}