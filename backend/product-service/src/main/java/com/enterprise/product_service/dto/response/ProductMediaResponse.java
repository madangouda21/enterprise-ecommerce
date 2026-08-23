package com.enterprise.product_service.dto.response;

import com.enterprise.product_service.entity.MediaType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductMediaResponse {

    private Long id;

    private MediaType mediaType;

    private String fileName;

    private String url;
}