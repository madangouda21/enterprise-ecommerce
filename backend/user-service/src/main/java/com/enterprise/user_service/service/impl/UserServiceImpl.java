package com.enterprise.user_service.service.impl;

import com.enterprise.user_service.dto.request.CreateUserRequest;
import com.enterprise.user_service.dto.request.UpdateUserRequest;
import com.enterprise.user_service.dto.response.UserResponse;
import com.enterprise.user_service.entity.Role;
import com.enterprise.user_service.entity.User;
import com.enterprise.user_service.repository.UserRepository;
import com.enterprise.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;


    // =====================================================
    // CREATE USER PROFILE
    // Called by Auth Service during registration
    // =====================================================

    @Override
    public UserResponse createUserProfile(
            CreateUserRequest request) {

        /*
         * Check whether a profile already exists
         * for this email.
         */
        if (userRepository.existsByEmail(
                request.getEmail())) {

            throw new RuntimeException(
                    "User profile already exists with email: "
                            + request.getEmail()
            );
        }


        /*
         * Create User entity.
         */
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

                .phone(
                        request.getPhone()
                )

                .address(
                        request.getAddress()
                )

                .city(
                        request.getCity()
                )

                .state(
                        request.getState()
                )

                .country(
                        request.getCountry()
                )

                .postalCode(
                        request.getPostalCode()
                )

                /*
                 * Use the role sent by Auth Service.
                 *
                 * If no role is sent, make the user
                 * a CUSTOMER.
                 */
                .role(
                        request.getRole() != null
                                ? request.getRole()
                                : Role.CUSTOMER
                )

                .build();


        /*
         * Save profile into User Service DB.
         */
        User savedUser =
                userRepository.save(user);


        /*
         * Return saved profile.
         */
        return mapToResponse(savedUser);
    }


    // =====================================================
    // GET USER BY ID
    // =====================================================

    @Override
    public UserResponse getUserById(Long id) {

        User user =
                userRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with id: "
                                                + id
                                )
                        );

        return mapToResponse(user);
    }


    // =====================================================
    // GET USER BY EMAIL
    // =====================================================

    @Override
    public UserResponse getUserByEmail(
            String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with email: "
                                                + email
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

        User user =
                userRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with id: "
                                                + id
                                )
                        );

        updateUserFields(
                user,
                request
        );

        User updatedUser =
                userRepository.save(user);

        return mapToResponse(updatedUser);
    }


    // =====================================================
    // UPDATE USER BY EMAIL
    // =====================================================

    @Override
    public UserResponse updateUserByEmail(
            String email,
            UpdateUserRequest request) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with email: "
                                                + email
                                )
                        );

        updateUserFields(
                user,
                request
        );

        User updatedUser =
                userRepository.save(user);

        return mapToResponse(updatedUser);
    }


    // =====================================================
    // UPDATE USER FIELDS
    // =====================================================

    private void updateUserFields(
            User user,
            UpdateUserRequest request) {

        /*
         * Update first name.
         */
        user.setFirstName(
                request.getFirstName()
        );


        /*
         * Update last name.
         */
        user.setLastName(
                request.getLastName()
        );


        /*
         * Do NOT update email.
         *
         * Authentication uses email as the
         * identity, so changing it here can
         * cause JWT/profile mismatch.
         */


        /*
         * Update phone.
         */
        user.setPhone(
                request.getPhone()
        );


        /*
         * Update address.
         */
        user.setAddress(
                request.getAddress()
        );


        /*
         * Update city.
         */
        user.setCity(
                request.getCity()
        );


        /*
         * Update state.
         */
        user.setState(
                request.getState()
        );


        /*
         * Update country.
         */
        user.setCountry(
                request.getCountry()
        );


        /*
         * Update postal code.
         */
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
                    "User not found with id: "
                            + id
            );
        }

        userRepository.deleteById(id);
    }


    // =====================================================
    // MAP USER → RESPONSE
    // =====================================================

    private UserResponse mapToResponse(
            User user) {

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