package com.enterprise.inventory_service.kafka;

import com.enterprise.inventory_service.event.OrderCreatedEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderEventConsumer {

    @KafkaListener(
            topics = "order-events",
            groupId = "inventory-service",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeOrderCreated(OrderCreatedEvent event) {

        System.out.println(
                "Received OrderCreatedEvent: " +
                        "orderId=" + event.getOrderId() +
                        ", userId=" + event.getUserId() +
                        ", status=" + event.getStatus()
        );
    }
}