package com.enterprise.order_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OrderItemResponse {

    private Long id;
    private Long productId;
    private Integer quantity;
    private Double price;
}