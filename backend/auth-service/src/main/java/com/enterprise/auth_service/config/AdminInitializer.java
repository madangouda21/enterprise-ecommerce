package com.enterprise.auth_service.config;

import com.enterprise.auth_service.entity.Role;
import com.enterprise.auth_service.entity.User;
import com.enterprise.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        String adminEmail = "admin@ecommerce.com";

        if (userRepository.existsByEmail(adminEmail)) {
            System.out.println("ADMIN already exists.");
            return;
        }

        User admin = User.builder()
                .firstName("E-Commerce")
                .lastName("Admin")
                .email(adminEmail)
                .password(passwordEncoder.encode("Admin@123"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .build();

        userRepository.save(admin);

        System.out.println("=================================");
        System.out.println("ADMIN CREATED");
        System.out.println("Email: admin@ecommerce.com");
        System.out.println("Password: Admin@123");
        System.out.println("Role: ROLE_ADMIN");
        System.out.println("=================================");
    }
}