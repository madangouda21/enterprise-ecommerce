package com.enterprise.user_service.service;

import com.enterprise.user_service.dto.request.CreateUserRequest;
import com.enterprise.user_service.dto.request.UpdateUserRequest;
import com.enterprise.user_service.dto.response.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse getUserById(Long id);

    UserResponse getUserByEmail(String email);

    List<UserResponse> getAllUsers();

    UserResponse createUser(CreateUserRequest request);

    UserResponse updateUser(
            Long id,
            UpdateUserRequest request
    );

    UserResponse updateUserByEmail(
            String email,
            UpdateUserRequest request
    );

    void deleteUser(Long id);
}