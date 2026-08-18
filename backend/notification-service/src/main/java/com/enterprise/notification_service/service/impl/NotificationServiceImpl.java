package com.enterprise.notification_service.service.impl;

import com.enterprise.notification_service.dto.request.CreateNotificationRequest;
import com.enterprise.notification_service.dto.request.UpdateNotificationRequest;
import com.enterprise.notification_service.dto.response.NotificationResponse;
import com.enterprise.notification_service.entity.Notification;
import com.enterprise.notification_service.repository.NotificationRepository;
import com.enterprise.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public NotificationResponse createNotification(
            CreateNotificationRequest request) {

        Notification notification = new Notification();

        notification.setUserId(request.getUserId());
        notification.setType(request.getType());
        notification.setMessage(request.getMessage());
        notification.setRead(false);

        Notification savedNotification =
                notificationRepository.save(notification);

        return mapToResponse(savedNotification);
    }

    @Override
    public NotificationResponse getNotificationById(Long id) {

        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                ));

        return mapToResponse(notification);
    }

    @Override
    public List<NotificationResponse> getNotificationsByUserId(
            Long userId) {

        return notificationRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<NotificationResponse> getUnreadNotifications(
            Long userId) {

        return notificationRepository
                .findByUserIdAndReadFalse(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public NotificationResponse updateNotification(
            Long id,
            UpdateNotificationRequest request) {

        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                ));

        notification.setRead(request.getRead());

        Notification updatedNotification =
                notificationRepository.save(notification);

        return mapToResponse(updatedNotification);
    }

    @Override
    public void deleteNotification(Long id) {

        if (!notificationRepository.existsById(id)) {
            throw new RuntimeException(
                    "Notification not found"
            );
        }

        notificationRepository.deleteById(id);
    }

    private NotificationResponse mapToResponse(
            Notification notification) {

        return new NotificationResponse(
                notification.getId(),
                notification.getUserId(),
                notification.getType(),
                notification.getMessage(),
                notification.isRead()
        );
    }
}