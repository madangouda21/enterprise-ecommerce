package com.enterprise.review_service.service.impl;

import com.enterprise.review_service.dto.request.CreateReviewRequest;
import com.enterprise.review_service.dto.request.UpdateReviewRequest;
import com.enterprise.review_service.dto.response.ReviewResponse;
import com.enterprise.review_service.entity.Review;
import com.enterprise.review_service.repository.ReviewRepository;
import com.enterprise.review_service.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    @Override
    public ReviewResponse createReview(
            CreateReviewRequest request) {

        if (reviewRepository
                .findByProductIdAndUserId(
                        request.getProductId(),
                        request.getUserId()
                )
                .isPresent()) {

            throw new RuntimeException(
                    "User has already reviewed this product"
            );
        }

        Review review = new Review();

        review.setProductId(request.getProductId());
        review.setUserId(request.getUserId());
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review savedReview =
                reviewRepository.save(review);

        return mapToResponse(savedReview);
    }

    @Override
    public ReviewResponse getReviewById(Long id) {

        Review review = reviewRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Review not found"
                        ));

        return mapToResponse(review);
    }

    @Override
    public List<ReviewResponse> getReviewsByProductId(
            Long productId) {

        return reviewRepository
                .findByProductId(productId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<ReviewResponse> getReviewsByUserId(
            Long userId) {

        return reviewRepository
                .findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ReviewResponse updateReview(
            Long id,
            UpdateReviewRequest request) {

        Review review = reviewRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Review not found"
                        ));

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review updatedReview =
                reviewRepository.save(review);

        return mapToResponse(updatedReview);
    }

    @Override
    public void deleteReview(Long id) {

        if (!reviewRepository.existsById(id)) {
            throw new RuntimeException(
                    "Review not found"
            );
        }

        reviewRepository.deleteById(id);
    }

    private ReviewResponse mapToResponse(
            Review review) {

        return new ReviewResponse(
                review.getId(),
                review.getProductId(),
                review.getUserId(),
                review.getRating(),
                review.getComment()
        );
    }
}