package com.enterprise.notification_service.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateNotificationRequest {

    @NotNull
    private Boolean read;
}