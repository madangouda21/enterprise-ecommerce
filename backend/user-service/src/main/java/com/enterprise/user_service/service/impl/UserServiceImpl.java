package com.enterprise.user_service.service.impl;

import com.enterprise.user_service.dto.request.UpdateUserRequest;
import com.enterprise.user_service.dto.response.UserResponse;
import com.enterprise.user_service.entity.User;
import com.enterprise.user_service.repository.UserRepository;
import com.enterprise.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.enterprise.user_service.dto.request.CreateUserRequest;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;


    // =====================================================
    // GET USER BY ID
    // =====================================================

    @Override
    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: " + id
                        )
                );

        return mapToResponse(user);
    }


    // =====================================================
    // GET USER BY EMAIL
    // =====================================================

    @Override
    public UserResponse getUserByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email: " + email
                        )
                );

        return mapToResponse(user);
    }


    // =====================================================
    // GET ALL USERS
    // =====================================================

    @Override
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // UPDATE USER BY ID
    // =====================================================

    @Override
    public UserResponse updateUser(
            Long id,
            UpdateUserRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: " + id
                        )
                );

        updateUserFields(user, request);

        User updatedUser =
                userRepository.save(user);

        return mapToResponse(updatedUser);
    }


    // =====================================================
    // UPDATE MY USER PROFILE BY EMAIL
    // =====================================================

    @Override
    public UserResponse updateUserByEmail(
            String email,
            UpdateUserRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email: " + email
                        )
                );

        updateUserFields(user, request);

        User updatedUser =
                userRepository.save(user);

        return mapToResponse(updatedUser);
    }

    @Override
    public UserResponse createUser(
            CreateUserRequest request) {

        if (userRepository.existsByEmail(
                request.getEmail())) {

            throw new RuntimeException(
                    "User already exists with email: " +
                            request.getEmail()
            );
        }

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

                .role(
                        request.getRole()
                )

                .build();

        User savedUser =
                userRepository.save(user);

        return mapToResponse(savedUser);
    }


    // =====================================================
    // UPDATE USER FIELDS
    // =====================================================

    private void updateUserFields(
            User user,
            UpdateUserRequest request) {

        user.setFirstName(
                request.getFirstName()
        );

        user.setLastName(
                request.getLastName()
        );

        user.setPhone(
                request.getPhone()
        );

        user.setAddress(
                request.getAddress()
        );

        user.setCity(
                request.getCity()
        );

        user.setState(
                request.getState()
        );

        user.setCountry(
                request.getCountry()
        );

        user.setPostalCode(
                request.getPostalCode()
        );
    }


    // =====================================================
    // DELETE USER
    // =====================================================

    @Override
    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {

            throw new RuntimeException(
                    "User not found with id: " + id
            );
        }

        userRepository.deleteById(id);
    }


    // =====================================================
    // MAP USER → RESPONSE
    // =====================================================

    private UserResponse mapToResponse(User user) {

        return UserResponse.builder()

                .id(
                        user.getId()
                )

                .firstName(
                        user.getFirstName()
                )

                .lastName(
                        user.getLastName()
                )

                .email(
                        user.getEmail()
                )

                .phone(
                        user.getPhone()
                )

                .address(
                        user.getAddress()
                )

                .city(
                        user.getCity()
                )

                .state(
                        user.getState()
                )

                .country(
                        user.getCountry()
                )

                .postalCode(
                        user.getPostalCode()
                )

                .role(
                        user.getRole()
                )

                .build();
    }
}