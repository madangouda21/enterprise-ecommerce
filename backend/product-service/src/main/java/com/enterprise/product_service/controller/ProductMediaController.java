package com.enterprise.product_service.controller;

import com.enterprise.product_service.dto.response.ProductMediaResponse;
import com.enterprise.product_service.service.ProductMediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductMediaController {

    private final ProductMediaService productMediaService;


    // =====================================================
    // UPLOAD PRODUCT MEDIA
    // =====================================================

    @PostMapping("/{productId}/media")
    public ResponseEntity<ProductMediaResponse> uploadMedia(
            @PathVariable Long productId,
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(
                productMediaService.uploadMedia(
                        productId,
                        file
                )
        );
    }


    // =====================================================
    // GET PRODUCT MEDIA
    // =====================================================

    @GetMapping("/{productId}/media")
    public ResponseEntity<List<ProductMediaResponse>> getProductMedia(
            @PathVariable Long productId) {

        return ResponseEntity.ok(
                productMediaService.getProductMedia(
                        productId
                )
        );
    }


    // =====================================================
    // DELETE PRODUCT MEDIA
    // =====================================================

    @DeleteMapping("/media/{mediaId}")
    public ResponseEntity<Void> deleteMedia(
            @PathVariable Long mediaId) {

        productMediaService.deleteMedia(
                mediaId
        );

        return ResponseEntity.noContent().build();
    }
}