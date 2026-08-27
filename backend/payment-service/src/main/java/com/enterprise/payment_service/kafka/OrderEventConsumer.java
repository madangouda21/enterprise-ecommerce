package com.enterprise.payment_service.kafka;

import com.enterprise.payment_service.event.OrderCreatedEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderEventConsumer {

    @KafkaListener(
            topics = "order-events",
            groupId = "payment-service"
    )
    public void consumeOrderCreated(OrderCreatedEvent event) {

        System.out.println(
                "Payment Service received order: "
                        + event.getOrderId()
        );

        // Payment processing will be added here
    }
}