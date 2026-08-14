package com.enterprise.product_service.service;

import com.enterprise.product_service.dto.request.CreateProductRequest;
import com.enterprise.product_service.dto.request.UpdateProductRequest;
import com.enterprise.product_service.dto.response.ProductResponse;

import java.util.List;

public interface ProductService {

    ProductResponse createProduct(CreateProductRequest request);

    ProductResponse getProductById(Long id);

    List<ProductResponse> getAllProducts();

    ProductResponse updateProduct(Long id, UpdateProductRequest request);

    void deleteProduct(Long id);
}