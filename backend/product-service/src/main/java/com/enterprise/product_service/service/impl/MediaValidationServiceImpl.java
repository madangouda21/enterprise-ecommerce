package com.enterprise.product_service.service.impl;

import com.enterprise.product_service.service.MediaValidationService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Service
public class MediaValidationServiceImpl
        implements MediaValidationService {

    private static final Set<String> IMAGE_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private static final Set<String> VIDEO_TYPES = Set.of(
            "video/mp4",
            "video/webm"
    );

    private static final long MAX_IMAGE_SIZE =
            5 * 1024 * 1024;       // 5 MB

    private static final long MAX_VIDEO_SIZE =
            50 * 1024 * 1024;      // 50 MB

    @Override
    public void validate(MultipartFile file) {

        if (file == null || file.isEmpty()) {

            throw new IllegalArgumentException(
                    "File cannot be empty"
            );
        }

        String contentType =
                file.getContentType();

        if (contentType == null) {

            throw new IllegalArgumentException(
                    "Unable to determine file type"
            );
        }

        long fileSize = file.getSize();

        if (IMAGE_TYPES.contains(contentType)) {

            if (fileSize > MAX_IMAGE_SIZE) {

                throw new IllegalArgumentException(
                        "Image size cannot exceed 5 MB"
                );
            }

            return;
        }

        if (VIDEO_TYPES.contains(contentType)) {

            if (fileSize > MAX_VIDEO_SIZE) {

                throw new IllegalArgumentException(
                        "Video size cannot exceed 50 MB"
                );
            }

            return;
        }

        throw new IllegalArgumentException(
                "Unsupported file type: "
                        + contentType
        );
    }
}