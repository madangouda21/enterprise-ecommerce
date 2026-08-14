package com.enterprise.cart_service.service;

import com.enterprise.cart_service.dto.request.AddToCartRequest;
import com.enterprise.cart_service.dto.request.UpdateCartItemRequest;
import com.enterprise.cart_service.dto.response.CartResponse;

public interface CartService {

    CartResponse getCart(Long userId);

    CartResponse addToCart(Long userId, AddToCartRequest request);

    CartResponse updateCartItem(
            Long userId,
            Long itemId,
            UpdateCartItemRequest request
    );

    void removeCartItem(Long userId, Long itemId);

    void clearCart(Long userId);
}