package com.enterprise.shipping_service.dto.response;

import com.enterprise.shipping_service.entity.ShippingStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ShippingResponse {

    private Long id;
    private Long orderId;
    private Long userId;
    private String shippingAddress;
    private String city;
    private String state;
    private String postalCode;
    private ShippingStatus status;
    private String trackingNumber;
}