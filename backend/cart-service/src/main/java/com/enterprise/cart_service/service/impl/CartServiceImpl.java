package com.enterprise.cart_service.service.impl;

import com.enterprise.cart_service.dto.request.AddToCartRequest;
import com.enterprise.cart_service.dto.request.UpdateCartItemRequest;
import com.enterprise.cart_service.dto.response.CartItemResponse;
import com.enterprise.cart_service.dto.response.CartResponse;
import com.enterprise.cart_service.entity.Cart;
import com.enterprise.cart_service.entity.CartItem;
import com.enterprise.cart_service.repository.CartItemRepository;
import com.enterprise.cart_service.repository.CartRepository;
import com.enterprise.cart_service.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    public CartResponse getCart(Long userId) {

        Cart cart = getOrCreateCart(userId);

        return mapToResponse(cart);
    }

    @Override
    public CartResponse addToCart(
            Long userId,
            AddToCartRequest request) {

        Cart cart = getOrCreateCart(userId);

        CartItem cartItem = cart.getItems()
                .stream()
                .filter(item ->
                        item.getProductId().equals(request.getProductId()))
                .findFirst()
                .orElse(null);

        if (cartItem != null) {

            cartItem.setQuantity(
                    cartItem.getQuantity() + request.getQuantity()
            );

        } else {

            cartItem = new CartItem();

            cartItem.setCart(cart);
            cartItem.setProductId(request.getProductId());
            cartItem.setQuantity(request.getQuantity());

            cart.getItems().add(cartItem);
        }

        Cart savedCart = cartRepository.save(cart);

        return mapToResponse(savedCart);
    }

    @Override
    public CartResponse updateCartItem(
            Long userId,
            Long itemId,
            UpdateCartItemRequest request) {

        Cart cart = getOrCreateCart(userId);

        CartItem cartItem = cart.getItems()
                .stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException("Cart item not found"));

        cartItem.setQuantity(request.getQuantity());

        Cart savedCart = cartRepository.save(cart);

        return mapToResponse(savedCart);
    }

    @Override
    public void removeCartItem(Long userId, Long itemId) {

        Cart cart = getOrCreateCart(userId);

        CartItem cartItem = cart.getItems()
                .stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException("Cart item not found"));

        cart.getItems().remove(cartItem);

        cartRepository.save(cart);
    }

    @Override
    public void clearCart(Long userId) {

        Cart cart = getOrCreateCart(userId);

        cart.getItems().clear();

        cartRepository.save(cart);
    }

    private Cart getOrCreateCart(Long userId) {

        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {

                    Cart cart = new Cart();

                    cart.setUserId(userId);

                    return cartRepository.save(cart);
                });
    }

    private CartResponse mapToResponse(Cart cart) {

        List<CartItemResponse> items = cart.getItems()
                .stream()
                .map(item ->
                        new CartItemResponse(
                                item.getId(),
                                item.getProductId(),
                                item.getQuantity()
                        )
                )
                .toList();

        return new CartResponse(
                cart.getId(),
                cart.getUserId(),
                items
        );
    }
}