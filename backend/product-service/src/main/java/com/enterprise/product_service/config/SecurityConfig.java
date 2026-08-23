package com.enterprise.product_service.config;

import com.enterprise.product_service.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                .csrf(csrf ->
                        csrf.disable()
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth


                        // =================================
                        // PUBLIC GET
                        // =================================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/products",
                                "/api/v1/products/**"
                        )
                        .permitAll()


                        // =================================
                        // ADMIN CREATE
                        // =================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/products"
                        )
                        .hasAuthority("ROLE_ADMIN")


                        // =================================
                        // ADMIN UPDATE
                        // =================================

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/v1/products/**"
                        )
                        .hasAuthority("ROLE_ADMIN")


                        // =================================
                        // ADMIN DELETE
                        // =================================

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/v1/products/**"
                        )
                        .hasAuthority("ROLE_ADMIN")


                        // =================================
                        // ADMIN IMAGE / VIDEO UPLOAD
                        // =================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/products/*/media"
                        )
                        .hasAuthority("ROLE_ADMIN")


                        // =================================
                        // ADMIN MEDIA DELETE
                        // =================================

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/v1/products/media/**"
                        )
                        .hasAuthority("ROLE_ADMIN")


                        // =================================
                        // EVERYTHING ELSE
                        // =================================

                        .anyRequest()
                        .authenticated()
                )


                // =========================================
                // JWT FILTER
                // =========================================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }
}