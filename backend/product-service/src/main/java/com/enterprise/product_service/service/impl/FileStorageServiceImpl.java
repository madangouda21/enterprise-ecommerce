package com.enterprise.product_service.service.impl;

import com.enterprise.product_service.service.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageServiceImpl
        implements FileStorageService {

    private final Path uploadDirectory =
            Paths.get("uploads/products")
                    .toAbsolutePath()
                    .normalize();

    @Override
    public String storeFile(
            MultipartFile file,
            String folder) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "File cannot be empty"
            );
        }

        Path folderPath =
                uploadDirectory
                        .resolve(folder)
                        .normalize();

        Files.createDirectories(folderPath);

        String originalFileName =
                file.getOriginalFilename();

        String extension = "";

        if (originalFileName != null &&
                originalFileName.contains(".")) {

            extension =
                    originalFileName.substring(
                            originalFileName.lastIndexOf(".")
                    );
        }

        String fileName =
                UUID.randomUUID() + extension;

        Path targetPath =
                folderPath.resolve(fileName)
                        .normalize();

        /*
         * Prevent the file from being written
         * outside our upload directory.
         */
        if (!targetPath.startsWith(
                folderPath)) {

            throw new IOException(
                    "Invalid file path"
            );
        }

        Files.copy(
                file.getInputStream(),
                targetPath,
                StandardCopyOption.REPLACE_EXISTING
        );

        return "uploads/products/"
                + folder
                + "/"
                + fileName;
    }

    @Override
    public void deleteFile(
            String filePath) throws IOException {

        if (filePath == null ||
                filePath.isBlank()) {

            return;
        }

        Path path =
                Paths.get(filePath)
                        .toAbsolutePath()
                        .normalize();

        if (Files.exists(path)) {
            Files.delete(path);
        }
    }
}