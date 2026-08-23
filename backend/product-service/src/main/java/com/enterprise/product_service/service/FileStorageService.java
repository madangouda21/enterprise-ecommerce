package com.enterprise.product_service.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileStorageService {

    String storeFile(
            MultipartFile file,
            String folder
    ) throws IOException;

    void deleteFile(String filePath) throws IOException;
}