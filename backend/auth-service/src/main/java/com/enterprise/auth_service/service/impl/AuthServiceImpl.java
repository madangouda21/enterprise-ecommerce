package com.enterprise.auth_service.service.impl;

import com.enterprise.auth_service.client.UserServiceClient;
import com.enterprise.auth_service.dto.AuthResponse;
import com.enterprise.auth_service.dto.LoginRequest;
import com.enterprise.auth_service.dto.RegisterRequest;
import com.enterprise.auth_service.entity.Role;
import com.enterprise.auth_service.entity.User;
import com.enterprise.auth_service.repository.UserRepository;
import com.enterprise.auth_service.security.JwtService;
import com.enterprise.auth_service.service.AuthService;
import com.enterprise.auth_service.exception.EmailAlreadyExistsException;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {


    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    private final UserServiceClient userServiceClient;


    // =====================================================
    // REGISTER
    // =====================================================

    @Override
    public AuthResponse register(RegisterRequest request) {


        // -------------------------------------------------
        // 1. CHECK EMAIL
        // -------------------------------------------------

        if (userRepository.existsByEmail(
                request.getEmail())) {

            throw new EmailAlreadyExistsException(
                    "Email already exists"
            );
        }


        // -------------------------------------------------
        // 2. CREATE AUTH USER
        // -------------------------------------------------

        User user = User.builder()

                .firstName(
                        request.getFirstName()
                )

                .lastName(
                        request.getLastName()
                )

                .email(
                        request.getEmail()
                )

                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )

                .role(
                        Role.ROLE_CUSTOMER
                )

                .build();


        // -------------------------------------------------
        // 3. SAVE USER IN AUTH SERVICE
        // -------------------------------------------------

        User savedUser =
                userRepository.save(user);


        // -------------------------------------------------
        // 4. CREATE PROFILE IN USER SERVICE
        // -------------------------------------------------

        userServiceClient.createUserProfile(
                request
        );


        // -------------------------------------------------
        // 5. CREATE USER DETAILS FOR JWT
        // -------------------------------------------------

        UserDetails userDetails =
                org.springframework.security.core.userdetails.User
                        .builder()

                        .username(
                                savedUser.getEmail()
                        )

                        .password(
                                savedUser.getPassword()
                        )

                        .authorities(
                                savedUser
                                        .getRole()
                                        .name()
                        )

                        .build();


        // -------------------------------------------------
        // 6. GENERATE JWT
        // -------------------------------------------------

        String token =
                jwtService.generateToken(
                        userDetails
                );


        // -------------------------------------------------
        // 7. RETURN AUTH RESPONSE
        // -------------------------------------------------

        return AuthResponse.builder()

                .token(token)

                .type("Bearer")

                .build();
    }


    // =====================================================
    // LOGIN
    // =====================================================

    @Override
    public AuthResponse login(
            LoginRequest request) {


        // -------------------------------------------------
        // 1. AUTHENTICATE
        // -------------------------------------------------

        authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(

                        request.getEmail(),

                        request.getPassword()

                )
        );


        // -------------------------------------------------
        // 2. FIND USER
        // -------------------------------------------------

        User user =
                userRepository.findByEmail(
                                request.getEmail()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        // -------------------------------------------------
        // 3. CREATE USER DETAILS
        // -------------------------------------------------

        UserDetails userDetails =
                org.springframework.security.core.userdetails.User
                        .builder()

                        .username(
                                user.getEmail()
                        )

                        .password(
                                user.getPassword()
                        )

                        .authorities(
                                user
                                        .getRole()
                                        .name()
                        )

                        .build();


        // -------------------------------------------------
        // 4. GENERATE JWT
        // -------------------------------------------------

        String token =
                jwtService.generateToken(
                        userDetails
                );


        // -------------------------------------------------
        // 5. RETURN RESPONSE
        // -------------------------------------------------

        return AuthResponse.builder()

                .token(token)

                .type("Bearer")

                .build();
    }
}