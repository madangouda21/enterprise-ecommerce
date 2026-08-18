package com.enterprise.notification_service.controller;

import com.enterprise.notification_service.dto.request.CreateNotificationRequest;
import com.enterprise.notification_service.dto.request.UpdateNotificationRequest;
import com.enterprise.notification_service.dto.response.NotificationResponse;
import com.enterprise.notification_service.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(
            @Valid @RequestBody CreateNotificationRequest request) {

        return new ResponseEntity<>(
                notificationService.createNotification(request),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponse> getNotificationById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                notificationService.getNotificationById(id)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>>
    getNotificationsByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationService.getNotificationsByUserId(userId)
        );
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationResponse>>
    getUnreadNotifications(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationService.getUnreadNotifications(userId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<NotificationResponse> updateNotification(
            @PathVariable Long id,
            @Valid @RequestBody UpdateNotificationRequest request) {

        return ResponseEntity.ok(
                notificationService.updateNotification(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long id) {

        notificationService.deleteNotification(id);

        return ResponseEntity.noContent().build();
    }
}