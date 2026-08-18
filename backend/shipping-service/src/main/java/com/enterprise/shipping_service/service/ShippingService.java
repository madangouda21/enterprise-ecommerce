package com.enterprise.shipping_service.service;

import com.enterprise.shipping_service.dto.request.CreateShippingRequest;
import com.enterprise.shipping_service.dto.request.UpdateShippingStatusRequest;
import com.enterprise.shipping_service.dto.response.ShippingResponse;

import java.util.List;

public interface ShippingService {

    ShippingResponse createShipping(
            CreateShippingRequest request
    );

    ShippingResponse getShippingById(Long id);

    ShippingResponse getShippingByOrderId(Long orderId);

    List<ShippingResponse> getShippingByUserId(Long userId);

    List<ShippingResponse> getAllShipping();

    ShippingResponse updateShippingStatus(
            Long id,
            UpdateShippingStatusRequest request
    );

    void deleteShipping(Long id);
}