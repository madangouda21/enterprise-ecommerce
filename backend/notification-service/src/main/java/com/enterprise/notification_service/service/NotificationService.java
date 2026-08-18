package com.enterprise.notification_service.service;

import com.enterprise.notification_service.dto.request.CreateNotificationRequest;
import com.enterprise.notification_service.dto.request.UpdateNotificationRequest;
import com.enterprise.notification_service.dto.response.NotificationResponse;

import java.util.List;

public interface NotificationService {

    NotificationResponse createNotification(
            CreateNotificationRequest request
    );

    NotificationResponse getNotificationById(Long id);

    List<NotificationResponse> getNotificationsByUserId(
            Long userId
    );

    List<NotificationResponse> getUnreadNotifications(
            Long userId
    );

    NotificationResponse updateNotification(
            Long id,
            UpdateNotificationRequest request
    );

    void deleteNotification(Long id);
}