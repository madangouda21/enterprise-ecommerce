package com.enterprise.review_service.controller;

import com.enterprise.review_service.dto.request.CreateReviewRequest;
import com.enterprise.review_service.dto.request.UpdateReviewRequest;
import com.enterprise.review_service.dto.response.ReviewResponse;
import com.enterprise.review_service.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody CreateReviewRequest request) {

        return new ResponseEntity<>(
                reviewService.createReview(request),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getReviewById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                reviewService.getReviewById(id)
        );
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByProductId(
            @PathVariable Long productId) {

        return ResponseEntity.ok(
                reviewService.getReviewsByProductId(productId)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                reviewService.getReviewsByUserId(userId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReviewRequest request) {

        return ResponseEntity.ok(
                reviewService.updateReview(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id) {

        reviewService.deleteReview(id);

        return ResponseEntity.noContent().build();
    }
}