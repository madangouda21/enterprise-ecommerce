package com.enterprise.order_service.dto.response;

import com.enterprise.order_service.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class OrderResponse {

    private Long id;
    private Long userId;
    private OrderStatus status;
    private Double totalAmount;
    private List<OrderItemResponse> items;
}