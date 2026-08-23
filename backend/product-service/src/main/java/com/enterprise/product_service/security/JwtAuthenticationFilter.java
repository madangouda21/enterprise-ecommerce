package com.enterprise.product_service.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {


    private final JwtService jwtService;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        // =================================================
        // GET AUTHORIZATION HEADER
        // =================================================

        String authHeader =
                request.getHeader("Authorization");


        // =================================================
        // NO TOKEN
        // =================================================

        if (
                authHeader == null ||
                        !authHeader.startsWith("Bearer ")
        ) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // =================================================
        // EXTRACT TOKEN
        // =================================================

        String token =
                authHeader.substring(7);


        try {

            // =============================================
            // VALIDATE TOKEN
            // =============================================

            if (!jwtService.isTokenValid(token)) {

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }


            // =============================================
            // EXTRACT USERNAME
            // =============================================

            String username =
                    jwtService.extractUsername(token);


            // =============================================
            // EXTRACT ROLE
            // =============================================

            String role =
                    jwtService.extractRole(token);


            // =============================================
            // CREATE AUTHORITY
            // =============================================

            SimpleGrantedAuthority authority =
                    new SimpleGrantedAuthority(role);


            // =============================================
            // CREATE AUTHENTICATION
            // =============================================

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(

                            username,

                            null,

                            List.of(authority)
                    );


            // =============================================
            // SET SECURITY CONTEXT
            // =============================================

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(
                            authentication
                    );


        } catch (Exception e) {

            // Invalid token
            SecurityContextHolder
                    .clearContext();
        }


        // =================================================
        // CONTINUE FILTER CHAIN
        // =================================================

        filterChain.doFilter(
                request,
                response
        );
    }
}