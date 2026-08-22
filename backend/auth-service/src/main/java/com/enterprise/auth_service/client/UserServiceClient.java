package com.enterprise.auth_service.client;

import com.enterprise.auth_service.dto.RegisterRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class UserServiceClient {

    private final RestClient restClient;

    private final String userServiceUrl;

    public UserServiceClient(
            RestClient restClient,
            @Value("${user-service.url}") String userServiceUrl) {

        this.restClient = restClient;
        this.userServiceUrl = userServiceUrl;
    }

    public void createUserProfile(
            RegisterRequest request) {

        System.out.println(
                "================================================="
        );

        System.out.println(
                "AUTH SERVICE -> USER SERVICE"
        );

        System.out.println(
                "URL = " +
                        userServiceUrl +
                        "/api/v1/users/internal"
        );

        System.out.println(
                "EMAIL = " +
                        request.getEmail()
        );

        System.out.println(
                "================================================="
        );


        try {

            restClient.post()

                    .uri(
                            userServiceUrl +
                                    "/api/v1/users/internal"
                    )

                    .body(request)

                    .retrieve()

                    .toBodilessEntity();


            System.out.println(
                    "USER PROFILE CREATED SUCCESSFULLY"
            );


        } catch (Exception exception) {

            System.out.println(
                    "================================================="
            );

            System.out.println(
                    "USER SERVICE PROFILE CREATION FAILED"
            );

            System.out.println(
                    "ERROR TYPE = " +
                            exception.getClass().getName()
            );

            System.out.println(
                    "ERROR MESSAGE = " +
                            exception.getMessage()
            );

            System.out.println(
                    "================================================="
            );

            throw exception;
        }
    }
}