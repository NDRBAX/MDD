package com.openclassrooms.mddapi.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginDto {
    
    @NotBlank(message = "L'identifiant est obligatoire")
    private String identifier;
    
    @NotBlank(message = "Le mot de passe est obligatoire")
    private String password;
}