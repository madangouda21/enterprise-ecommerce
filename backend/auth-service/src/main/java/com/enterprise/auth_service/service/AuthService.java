package com.enterprise.auth_service.service;

import com.enterprise.auth_service.dto.AuthResponse;
import com.enterprise.auth_service.dto.LoginRequest;
import com.enterprise.auth_service.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}