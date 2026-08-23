package com.enterprise.product_service.service.impl;

import com.enterprise.product_service.dto.request.CreateProductRequest;
import com.enterprise.product_service.dto.request.UpdateProductRequest;
import com.enterprise.product_service.dto.response.ProductResponse;
import com.enterprise.product_service.entity.Product;
import com.enterprise.product_service.repository.ProductRepository;
import com.enterprise.product_service.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.enterprise.product_service.dto.response.ProductMediaResponse;
import com.enterprise.product_service.entity.ProductMedia;
import com.enterprise.product_service.repository.ProductMediaRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMediaRepository productMediaRepository;

    @Override
    public ProductResponse createProduct(CreateProductRequest request) {

        Product product = new Product();

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setCategory(request.getCategory());

        Product savedProduct = productRepository.save(product);

        return mapToResponse(savedProduct);
    }

    @Override
    public ProductResponse getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return mapToResponse(product);
    }

    @Override
    public List<ProductResponse> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ProductResponse updateProduct(
            Long id,
            UpdateProductRequest request) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (request.getName() != null) {
            product.setName(request.getName());
        }

        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }

        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }

        if (request.getQuantity() != null) {
            product.setQuantity(request.getQuantity());
        }

        if (request.getCategory() != null) {
            product.setCategory(request.getCategory());
        }

        Product updatedProduct = productRepository.save(product);

        return mapToResponse(updatedProduct);
    }

    @Override
    public void deleteProduct(Long id) {

        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }

        productRepository.deleteById(id);
    }

    private ProductMediaResponse mapMediaToResponse(
            ProductMedia media) {

        String url =
                "http://localhost:8083/"
                        + media.getFilePath();

        return ProductMediaResponse.builder()

                .id(media.getId())

                .mediaType(
                        media.getMediaType()
                )

                .fileName(
                        media.getFileName()
                )

                .url(url)

                .build();
    }

    private ProductResponse mapToResponse(Product product) {

        List<ProductMediaResponse> media =
                productMediaRepository
                        .findByProductId(product.getId())
                        .stream()
                        .map(this::mapMediaToResponse)
                        .toList();

        return ProductResponse.builder()

                .id(product.getId())

                .name(product.getName())

                .description(product.getDescription())

                .price(product.getPrice())

                .quantity(product.getQuantity())

                .category(product.getCategory())

                .media(media)

                .build();
    }
}