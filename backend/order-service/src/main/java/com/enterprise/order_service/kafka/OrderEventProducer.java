package com.enterprise.order_service.kafka;


import com.enterprise.order_service.event.OrderCreatedEvent;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;


@Component
public class OrderEventProducer {

    private static final String TOPIC =
            "order-events";


    private final KafkaTemplate<String, OrderCreatedEvent>
            kafkaTemplate;


    public OrderEventProducer(
            KafkaTemplate<String, OrderCreatedEvent> kafkaTemplate
    ) {
        this.kafkaTemplate = kafkaTemplate;
    }


    public void publishOrderCreated(
            OrderCreatedEvent event
    ) {

        kafkaTemplate.send(
                TOPIC,
                String.valueOf(event.getOrderId()),
                event
        );
    }
}