package com.enterprise.shipping_service.service.impl;

import com.enterprise.shipping_service.dto.request.CreateShippingRequest;
import com.enterprise.shipping_service.dto.request.UpdateShippingStatusRequest;
import com.enterprise.shipping_service.dto.response.ShippingResponse;
import com.enterprise.shipping_service.entity.Shipping;
import com.enterprise.shipping_service.repository.ShippingRepository;
import com.enterprise.shipping_service.service.ShippingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ShippingServiceImpl implements ShippingService {

    private final ShippingRepository shippingRepository;

    @Override
    public ShippingResponse createShipping(
            CreateShippingRequest request) {

        if (shippingRepository
                .findByOrderId(request.getOrderId())
                .isPresent()) {

            throw new RuntimeException(
                    "Shipping already exists for this order"
            );
        }

        Shipping shipping = new Shipping();

        shipping.setOrderId(request.getOrderId());
        shipping.setUserId(request.getUserId());
        shipping.setShippingAddress(request.getShippingAddress());
        shipping.setCity(request.getCity());
        shipping.setState(request.getState());
        shipping.setPostalCode(request.getPostalCode());

        shipping.setTrackingNumber(
                generateTrackingNumber()
        );

        Shipping savedShipping =
                shippingRepository.save(shipping);

        return mapToResponse(savedShipping);
    }

    @Override
    public ShippingResponse getShippingById(Long id) {

        Shipping shipping = shippingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Shipping not found"
                        ));

        return mapToResponse(shipping);
    }

    @Override
    public ShippingResponse getShippingByOrderId(Long orderId) {

        Shipping shipping =
                shippingRepository.findByOrderId(orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Shipping not found for order"
                                ));

        return mapToResponse(shipping);
    }

    @Override
    public List<ShippingResponse> getShippingByUserId(
            Long userId) {

        return shippingRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<ShippingResponse> getAllShipping() {

        return shippingRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ShippingResponse updateShippingStatus(
            Long id,
            UpdateShippingStatusRequest request) {

        Shipping shipping = shippingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Shipping not found"
                        ));

        shipping.setStatus(request.getStatus());

        Shipping updatedShipping =
                shippingRepository.save(shipping);

        return mapToResponse(updatedShipping);
    }

    @Override
    public void deleteShipping(Long id) {

        if (!shippingRepository.existsById(id)) {
            throw new RuntimeException(
                    "Shipping not found"
            );
        }

        shippingRepository.deleteById(id);
    }

    private String generateTrackingNumber() {

        return "TRK-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();
    }

    private ShippingResponse mapToResponse(
            Shipping shipping) {

        return new ShippingResponse(
                shipping.getId(),
                shipping.getOrderId(),
                shipping.getUserId(),
                shipping.getShippingAddress(),
                shipping.getCity(),
                shipping.getState(),
                shipping.getPostalCode(),
                shipping.getStatus(),
                shipping.getTrackingNumber()
        );
    }
}