package com.enterprise.payment_service.service;

import com.enterprise.payment_service.dto.request.CreatePaymentRequest;
import com.enterprise.payment_service.dto.request.UpdatePaymentStatusRequest;
import com.enterprise.payment_service.dto.response.PaymentResponse;

import java.util.List;

public interface PaymentService {

    PaymentResponse createPayment(CreatePaymentRequest request);

    PaymentResponse getPaymentById(Long id);

    PaymentResponse getPaymentByOrderId(Long orderId);

    List<PaymentResponse> getPaymentsByUserId(Long userId);

    List<PaymentResponse> getAllPayments();

    PaymentResponse updatePaymentStatus(
            Long id,
            UpdatePaymentStatusRequest request
    );

    void deletePayment(Long id);
}