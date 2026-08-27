package com.enterprise.notification_service.kafka;

import com.enterprise.notification_service.event.OrderCreatedEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderEventConsumer {

    @KafkaListener(
            topics = "order-events",
            groupId = "notification-service"
    )
    public void consumeOrderCreated(OrderCreatedEvent event) {

        System.out.println(
                "Notification Service received order: "
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

        // Notification logic will be added later
    }
}