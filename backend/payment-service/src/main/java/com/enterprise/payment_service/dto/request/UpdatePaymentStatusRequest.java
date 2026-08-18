package com.enterprise.payment_service.dto.request;

import com.enterprise.payment_service.entity.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdatePaymentStatusRequest {

    @NotNull
    private PaymentStatus status;
}