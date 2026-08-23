package com.enterprise.product_service.service.impl;

import com.enterprise.product_service.dto.response.ProductMediaResponse;
import com.enterprise.product_service.entity.MediaType;
import com.enterprise.product_service.entity.Product;
import com.enterprise.product_service.entity.ProductMedia;
import com.enterprise.product_service.repository.ProductMediaRepository;
import com.enterprise.product_service.repository.ProductRepository;
import com.enterprise.product_service.service.FileStorageService;
import com.enterprise.product_service.service.MediaValidationService;
import com.enterprise.product_service.service.ProductMediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductMediaServiceImpl
        implements ProductMediaService {

    private final ProductRepository productRepository;

    private final ProductMediaRepository productMediaRepository;

    private final FileStorageService fileStorageService;

    private final MediaValidationService mediaValidationService;


    // =====================================================
    // UPLOAD MEDIA
    // =====================================================

    @Override
    public ProductMediaResponse uploadMedia(
            Long productId,
            MultipartFile file) {

        Product product =
                productRepository.findById(productId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found with id: "
                                                + productId
                                )
                        );

        mediaValidationService.validate(file);

        MediaType mediaType =
                determineMediaType(file);

        String folder =
                mediaType == MediaType.IMAGE
                        ? "images"
                        : "videos";

        try {

            String filePath =
                    fileStorageService.storeFile(
                            file,
                            folder
                    );

            ProductMedia productMedia =
                    ProductMedia.builder()
                            .mediaType(mediaType)
                            .fileName(
                                    file.getOriginalFilename()
                            )
                            .filePath(filePath)
                            .product(product)
                            .build();

            ProductMedia savedMedia =
                    productMediaRepository.save(
                            productMedia
                    );

            return mapToResponse(savedMedia);

        } catch (IOException exception) {

            throw new RuntimeException(
                    "Failed to store media file",
                    exception
            );
        }
    }


    // =====================================================
    // GET PRODUCT MEDIA
    // =====================================================

    @Override
    public List<ProductMediaResponse> getProductMedia(
            Long productId) {

        if (!productRepository.existsById(productId)) {

            throw new RuntimeException(
                    "Product not found with id: "
                            + productId
            );
        }

        return productMediaRepository
                .findByProductId(productId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // DELETE MEDIA
    // =====================================================

    @Override
    public void deleteMedia(Long mediaId) {

        ProductMedia media =
                productMediaRepository.findById(mediaId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Media not found with id: "
                                                + mediaId
                                )
                        );

        try {

            fileStorageService.deleteFile(
                    media.getFilePath()
            );

        } catch (IOException exception) {

            throw new RuntimeException(
                    "Failed to delete media file",
                    exception
            );
        }

        productMediaRepository.delete(media);
    }


    // =====================================================
    // DETERMINE MEDIA TYPE
    // =====================================================

    private MediaType determineMediaType(
            MultipartFile file) {

        String contentType =
                file.getContentType();

        if (contentType == null) {

            throw new IllegalArgumentException(
                    "Unable to determine file type"
            );
        }

        if (contentType.startsWith("image/")) {

            return MediaType.IMAGE;
        }

        if (contentType.startsWith("video/")) {

            return MediaType.VIDEO;
        }

        throw new IllegalArgumentException(
                "Unsupported media type: "
                        + contentType
        );
    }


    // =====================================================
    // MAP ENTITY → RESPONSE
    // =====================================================

    private ProductMediaResponse mapToResponse(
            ProductMedia media) {

        String url =
                "http://localhost:8083/"
                        + media.getFilePath();

        return ProductMediaResponse.builder()

                .id(
                        media.getId()
                )

                .mediaType(
                        media.getMediaType()
                )

                .fileName(
                        media.getFileName()
                )

                .url(
                        url
                )

                .build();
    }
}