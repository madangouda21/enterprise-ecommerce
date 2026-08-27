package com.enterprise.shipping_service.kafka;

import com.enterprise.shipping_service.event.OrderCreatedEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderEventConsumer {

    @KafkaListener(
            topics = "order-events",
            groupId = "shipping-service"
    )
    public void consumeOrderCreated(OrderCreatedEvent event) {

        System.out.println(
                "Shipping Service received order: "
                        + event.getOrderId()
        );

        System.out.println(
                "User ID: "
                        + event.getUserId()
        );

        System.out.println(
                "Order Status: "
                        + event.getStatus()
        );

        // Shipping logic will be added later
    }
}