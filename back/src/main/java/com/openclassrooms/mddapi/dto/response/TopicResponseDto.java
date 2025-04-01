package com.openclassrooms.mddapi.dto.response;

import lombok.Data;

@Data
public class TopicResponseDto {
    private Long id;
    private String name;
    private String description;
}
