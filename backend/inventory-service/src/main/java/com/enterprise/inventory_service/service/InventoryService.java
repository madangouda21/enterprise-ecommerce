package com.enterprise.inventory_service.service;

import com.enterprise.inventory_service.dto.request.CreateInventoryRequest;
import com.enterprise.inventory_service.dto.request.UpdateInventoryRequest;
import com.enterprise.inventory_service.dto.response.InventoryResponse;

import java.util.List;

public interface InventoryService {

    InventoryResponse createInventory(
            CreateInventoryRequest request
    );

    InventoryResponse getInventoryByProductId(
            Long productId
    );

    List<InventoryResponse> getAllInventory();

    InventoryResponse updateInventory(
            Long productId,
            UpdateInventoryRequest request
    );

    void deleteInventory(Long productId);
}