package com.enterprise.shipping_service.dto.request;

import com.enterprise.shipping_service.entity.ShippingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateShippingStatusRequest {

    @NotNull
    private ShippingStatus status;
}