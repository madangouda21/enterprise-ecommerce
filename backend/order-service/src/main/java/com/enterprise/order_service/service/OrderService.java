package com.enterprise.order_service.service;

import com.enterprise.order_service.dto.request.CreateOrderRequest;
import com.enterprise.order_service.dto.request.UpdateOrderStatusRequest;
import com.enterprise.order_service.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {

    OrderResponse createOrder(CreateOrderRequest request);

    OrderResponse getOrderById(Long id);

    List<OrderResponse> getOrdersByUserId(Long userId);

    List<OrderResponse> getAllOrders();

    OrderResponse updateOrderStatus(
            Long id,
            UpdateOrderStatusRequest request
    );

    void deleteOrder(Long id);
}