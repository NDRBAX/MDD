package com.openclassrooms.mddapi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentRequestDto {
    
    @NotNull(message = "L'ID du post est obligatoire")
    private Long postId;
    
    @NotBlank(message = "Le contenu est obligatoire")
    @Size(max = 1000, message = "Le commentaire ne doit pas dépasser 1000 caractères")
    private String content;
}