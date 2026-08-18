package com.enterprise.shipping_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateShippingRequest {

    @NotNull
    private Long orderId;

    @NotNull
    private Long userId;

    @NotBlank
    private String shippingAddress;

    @NotBlank
    private String city;

    @NotBlank
    private String state;

    @NotBlank
    private String postalCode;
}