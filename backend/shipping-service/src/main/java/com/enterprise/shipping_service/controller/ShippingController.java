package com.enterprise.shipping_service.controller;

import com.enterprise.shipping_service.dto.request.CreateShippingRequest;
import com.enterprise.shipping_service.dto.request.UpdateShippingStatusRequest;
import com.enterprise.shipping_service.dto.response.ShippingResponse;
import com.enterprise.shipping_service.service.ShippingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shipping")
@RequiredArgsConstructor
public class ShippingController {

    private final ShippingService shippingService;

    @PostMapping
    public ResponseEntity<ShippingResponse> createShipping(
            @Valid @RequestBody CreateShippingRequest request) {

        return new ResponseEntity<>(
                shippingService.createShipping(request),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<ShippingResponse>> getAllShipping() {

        return ResponseEntity.ok(
                shippingService.getAllShipping()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShippingResponse> getShippingById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                shippingService.getShippingById(id)
        );
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ShippingResponse> getShippingByOrderId(
            @PathVariable Long orderId) {

        return ResponseEntity.ok(
                shippingService.getShippingByOrderId(orderId)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ShippingResponse>> getShippingByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                shippingService.getShippingByUserId(userId)
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ShippingResponse> updateShippingStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateShippingStatusRequest request) {

        return ResponseEntity.ok(
                shippingService.updateShippingStatus(
                        id,
                        request
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShipping(
            @PathVariable Long id) {

        shippingService.deleteShipping(id);

        return ResponseEntity.noContent().build();
    }
}