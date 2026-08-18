package com.enterprise.payment_service.dto.request;

import com.enterprise.payment_service.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreatePaymentRequest {

    @NotNull
    private Long orderId;

    @NotNull
    private Long userId;

    @NotNull
    @Positive
    private Double amount;

    @NotNull
    private PaymentMethod paymentMethod;
}