package com.openclassrooms.mddapi.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class TokenRefreshResponseDto {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
}