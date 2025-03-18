package com.openclassrooms.mddapi.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class WebSecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(withDefaults()).csrf(csrf -> csrf.disable())
            .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(requests -> requests
                // Permettre l'accès aux URLs d'authentification
                .requestMatchers("/api/auth/**").permitAll()
                // Permettre l'accès aux ressources statiques
                .requestMatchers("/", "/index.html", "/favicon.ico", "/*.css", "/*.js", "/assets/**").permitAll()
                // Protection des endpoints API
                .requestMatchers("/api/**").authenticated()
                // Exiger une authentification pour tout le reste
                .anyRequest().authenticated());
        return http.build();
    }

}
