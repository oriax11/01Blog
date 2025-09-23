package com.example.test.exception;

import com.example.test.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BlogAPIException.class)
    public ResponseEntity<ApiResponse> handleBlogAPIException(BlogAPIException ex, WebRequest request) {
        ApiResponse apiResponse = new ApiResponse(ex.getMessage(), ex.getStatus().value());
        return new ResponseEntity<>(apiResponse, ex.getStatus());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGlobalException(Exception ex, WebRequest request) {
        ApiResponse apiResponse = new ApiResponse(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value());
        return new ResponseEntity<>(apiResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
