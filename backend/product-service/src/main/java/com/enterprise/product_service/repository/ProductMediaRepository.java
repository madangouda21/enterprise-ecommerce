package com.enterprise.product_service.repository;

import com.enterprise.product_service.entity.ProductMedia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductMediaRepository
        extends JpaRepository<ProductMedia, Long> {

    List<ProductMedia> findByProductId(Long productId);
}