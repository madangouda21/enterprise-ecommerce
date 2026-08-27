package com.enterprise.order_service.service.impl;

import com.enterprise.order_service.dto.request.CreateOrderRequest;
import com.enterprise.order_service.dto.request.UpdateOrderStatusRequest;
import com.enterprise.order_service.dto.response.OrderItemResponse;
import com.enterprise.order_service.dto.response.OrderResponse;
import com.enterprise.order_service.entity.Order;
import com.enterprise.order_service.entity.OrderItem;
import com.enterprise.order_service.event.OrderCreatedEvent;
import com.enterprise.order_service.kafka.OrderEventProducer;
import com.enterprise.order_service.repository.OrderRepository;
import com.enterprise.order_service.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderEventProducer orderEventProducer;

    @Override
    public OrderResponse createOrder(CreateOrderRequest request) {

        Order order = new Order();

        order.setUserId(request.getUserId());

        double totalAmount = 0.0;

        for (CreateOrderRequest.OrderItemRequest itemRequest
                : request.getItems()) {

            OrderItem item = new OrderItem();

            item.setOrder(order);
            item.setProductId(itemRequest.getProductId());
            item.setQuantity(itemRequest.getQuantity());
            item.setPrice(itemRequest.getPrice());

            order.getItems().add(item);

            totalAmount +=
                    itemRequest.getPrice() * itemRequest.getQuantity();
        }

        order.setTotalAmount(totalAmount);

        // Save order in database
        Order savedOrder = orderRepository.save(order);

        // Create Kafka event
        OrderCreatedEvent event = new OrderCreatedEvent(
                savedOrder.getId(),
                savedOrder.getUserId(),
                savedOrder.getStatus().toString()
        );

        // Publish event to Kafka
        orderEventProducer.publishOrderCreated(event);

        return mapToResponse(savedOrder);
    }

    @Override
    public OrderResponse getOrderById(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        return mapToResponse(order);
    }

    @Override
    public List<OrderResponse> getOrdersByUserId(Long userId) {

        return orderRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<OrderResponse> getAllOrders() {

        return orderRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public OrderResponse updateOrderStatus(
            Long id,
            UpdateOrderStatusRequest request) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        order.setStatus(request.getStatus());

        Order updatedOrder = orderRepository.save(order);

        return mapToResponse(updatedOrder);
    }

    @Override
    public void deleteOrder(Long id) {

        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found");
        }

        orderRepository.deleteById(id);
    }

    private OrderResponse mapToResponse(Order order) {

        List<OrderItemResponse> items = order.getItems()
                .stream()
                .map(item ->
                        new OrderItemResponse(
                                item.getId(),
                                item.getProductId(),
                                item.getQuantity(),
                                item.getPrice()
                        )
                )
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getUserId(),
                order.getStatus(),
                order.getTotalAmount(),
                items
        );
    }
}