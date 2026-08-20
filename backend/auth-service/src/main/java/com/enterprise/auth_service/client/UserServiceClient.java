package com.enterprise.auth_service.client;

import com.enterprise.auth_service.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class UserServiceClient {

    private final RestClient restClient;

    private static final String USER_SERVICE_URL =
            "http://localhost:8082";

    public void createUserProfile(
            RegisterRequest request) {

        Map<String, Object> body =
                new HashMap<>();

        body.put(
                "firstName",
                request.getFirstName()
        );

        body.put(
                "lastName",
                request.getLastName()
        );

        body.put(
                "email",
                request.getEmail()
        );

        body.put(
                "role",
                "CUSTOMER"
        );

        restClient.post()
                .uri(
                        USER_SERVICE_URL +
                                "/api/v1/users/internal"
                )
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }
}