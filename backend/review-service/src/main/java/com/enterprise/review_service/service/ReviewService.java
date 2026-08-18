package com.enterprise.review_service.service;

import com.enterprise.review_service.dto.request.CreateReviewRequest;
import com.enterprise.review_service.dto.request.UpdateReviewRequest;
import com.enterprise.review_service.dto.response.ReviewResponse;

import java.util.List;

public interface ReviewService {

    ReviewResponse createReview(
            CreateReviewRequest request
    );

    ReviewResponse getReviewById(Long id);

    List<ReviewResponse> getReviewsByProductId(
            Long productId
    );

    List<ReviewResponse> getReviewsByUserId(
            Long userId
    );

    ReviewResponse updateReview(
            Long id,
            UpdateReviewRequest request
    );

    void deleteReview(Long id);
}