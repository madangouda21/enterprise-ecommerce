package com.enterprise.inventory_service.service.impl;

import com.enterprise.inventory_service.dto.request.CreateInventoryRequest;
import com.enterprise.inventory_service.dto.request.UpdateInventoryRequest;
import com.enterprise.inventory_service.dto.response.InventoryResponse;
import com.enterprise.inventory_service.entity.Inventory;
import com.enterprise.inventory_service.repository.InventoryRepository;
import com.enterprise.inventory_service.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;

    @Override
    public InventoryResponse createInventory(
            CreateInventoryRequest request) {

        if (inventoryRepository
                .findByProductId(request.getProductId())
                .isPresent()) {

            throw new RuntimeException(
                    "Inventory already exists for product"
            );
        }

        Inventory inventory = new Inventory();

        inventory.setProductId(request.getProductId());
        inventory.setQuantity(request.getQuantity());
        inventory.setReservedQuantity(0);

        Inventory savedInventory =
                inventoryRepository.save(inventory);

        return mapToResponse(savedInventory);
    }

    @Override
    public InventoryResponse getInventoryByProductId(
            Long productId) {

        Inventory inventory =
                inventoryRepository.findByProductId(productId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Inventory not found"
                                ));

        return mapToResponse(inventory);
    }

    @Override
    public List<InventoryResponse> getAllInventory() {

        return inventoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public InventoryResponse updateInventory(
            Long productId,
            UpdateInventoryRequest request) {

        Inventory inventory =
                inventoryRepository.findByProductId(productId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Inventory not found"
                                ));

        inventory.setQuantity(request.getQuantity());

        Inventory updatedInventory =
                inventoryRepository.save(inventory);

        return mapToResponse(updatedInventory);
    }

    @Override
    public void deleteInventory(Long productId) {

        Inventory inventory =
                inventoryRepository.findByProductId(productId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Inventory not found"
                                ));

        inventoryRepository.delete(inventory);
    }

    private InventoryResponse mapToResponse(
            Inventory inventory) {

        return new InventoryResponse(
                inventory.getId(),
                inventory.getProductId(),
                inventory.getQuantity(),
                inventory.getReservedQuantity()
        );
    }
}