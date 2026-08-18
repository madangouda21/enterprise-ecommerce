package com.enterprise.notification_service.dto.request;

import com.enterprise.notification_service.entity.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateNotificationRequest {

    @NotNull
    private Long userId;

    @NotNull
    private NotificationType type;

    @NotBlank
    @Size(max = 1000)
    private String message;
}