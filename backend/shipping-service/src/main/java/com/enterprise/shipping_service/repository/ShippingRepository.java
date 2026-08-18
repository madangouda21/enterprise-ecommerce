package com.enterprise.shipping_service.repository;

import com.enterprise.shipping_service.entity.Shipping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShippingRepository extends JpaRepository<Shipping, Long> {

    Optional<Shipping> findByOrderId(Long orderId);

    List<Shipping> findByUserId(Long userId);

    Optional<Shipping> findByTrackingNumber(String trackingNumber);
}