package com.enterprise.product_service.service;

import com.enterprise.product_service.dto.response.ProductMediaResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductMediaService {

    ProductMediaResponse uploadMedia(
            Long productId,
            MultipartFile file
    );

    List<ProductMediaResponse> getProductMedia(
            Long productId
    );

    void deleteMedia(Long mediaId);
}