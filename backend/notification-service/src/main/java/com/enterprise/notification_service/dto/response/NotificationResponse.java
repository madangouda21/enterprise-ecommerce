package com.enterprise.notification_service.dto.response;

import com.enterprise.notification_service.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NotificationResponse {

    private Long id;
    private Long userId;
    private NotificationType type;
    private String message;
    private boolean read;
}