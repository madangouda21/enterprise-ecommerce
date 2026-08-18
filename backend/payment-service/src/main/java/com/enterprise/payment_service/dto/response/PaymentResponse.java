package com.enterprise.payment_service.dto.response;

import com.enterprise.payment_service.entity.PaymentMethod;
import com.enterprise.payment_service.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PaymentResponse {

    private Long id;
    private Long orderId;
    private Long userId;
    private Double amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
}