package com.openclassrooms.mddapi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostRequestDto {
    
    @NotNull(message = "L'ID du topic ne peut pas être vide")
    private Long topicId;
    
    @NotBlank(message = "Le titre ne peut pas être vide")
    @Size(min = 5, max = 100, message = "Le titre doit contenir entre 5 et 100 caractères")
    private String title;
    
    @NotBlank(message = "Le contenu ne peut pas être vide")
    @Size(min = 20, message = "Le contenu doit contenir au moins 20 caractères")
    private String content;
}