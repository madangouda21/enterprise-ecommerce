package com.enterprise.user_service.controller;

import com.enterprise.user_service.dto.request.CreateUserRequest;
import com.enterprise.user_service.dto.request.UpdateUserRequest;
import com.enterprise.user_service.dto.response.UserResponse;
import com.enterprise.user_service.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    // =====================================================
    // GET ALL USERS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }


    // =====================================================
    // CREATE USER PROFILE
    // Called by Auth Service during registration
    // =====================================================

    @PostMapping("/internal")
    public ResponseEntity<UserResponse> createUserProfile(
            @Valid @RequestBody CreateUserRequest request) {

        return ResponseEntity.ok(
                userService.createUserProfile(request)
        );
    }


    // =====================================================
    // GET MY PROFILE
    // =====================================================

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getMyProfile(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                userService.getUserByEmail(email)
        );
    }


    // =====================================================
    // UPDATE MY PROFILE
    // =====================================================

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateMyProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateUserRequest request) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                userService.updateUserByEmail(
                        email,
                        request
                )
        );
    }


    // =====================================================
    // GET USER BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.getUserById(id)
        );
    }


    // =====================================================
    // GET USER BY EMAIL
    // =====================================================

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(
            @PathVariable String email) {

        return ResponseEntity.ok(
                userService.getUserByEmail(email)
        );
    }


    // =====================================================
    // UPDATE USER BY ID
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {

        return ResponseEntity.ok(
                userService.updateUser(
                        id,
                        request
                )
        );
    }


    // =====================================================
    // DELETE USER
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id) {

        userService.deleteUser(id);

        return ResponseEntity.noContent().build();
    }
}