package com.enterprise.cart_service.controller;

import com.enterprise.cart_service.dto.request.AddToCartRequest;
import com.enterprise.cart_service.dto.request.UpdateCartItemRequest;
import com.enterprise.cart_service.dto.response.CartResponse;
import com.enterprise.cart_service.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<CartResponse> getCart(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                cartService.getCart(userId)
        );
    }

    @PostMapping("/{userId}/items")
    public ResponseEntity<CartResponse> addToCart(
            @PathVariable Long userId,
            @Valid @RequestBody AddToCartRequest request) {

        return ResponseEntity.ok(
                cartService.addToCart(userId, request)
        );
    }

    @PutMapping("/{userId}/items/{itemId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable Long userId,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {

        return ResponseEntity.ok(
                cartService.updateCartItem(
                        userId,
                        itemId,
                        request
                )
        );
    }

    @DeleteMapping("/{userId}/items/{itemId}")
    public ResponseEntity<Void> removeCartItem(
            @PathVariable Long userId,
            @PathVariable Long itemId) {

        cartService.removeCartItem(userId, itemId);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{userId}/items")
    public ResponseEntity<Void> clearCart(
            @PathVariable Long userId) {

        cartService.clearCart(userId);

        return ResponseEntity.noContent().build();
    }
}