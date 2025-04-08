package com.openclassrooms.mddapi.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostsFeedResponseDto {
    private Long id;
    private String title;
    private LocalDateTime creationDate;
    private String author;
    private String content;
}