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
                // Allow all requests to the authentication API
                .requestMatchers("/api/auth/**").permitAll()
                // TEST
                .requestMatchers("/api/topics/**").permitAll()
                // Static resources
                .requestMatchers("/", "/index.html", "/favicon.ico", "/*.css", "/*.js", "/assets/**").permitAll()
                // Protect the API
                .requestMatchers("/api/**").authenticated()
                // Allow all other requests
                .anyRequest().permitAll()
            );
        return http.build();
    }
}