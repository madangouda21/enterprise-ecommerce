package com.enterprise.product_service.service;

import org.springframework.web.multipart.MultipartFile;

public interface MediaValidationService {

    void validate(MultipartFile file);
}