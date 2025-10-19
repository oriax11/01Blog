package com.example.test.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// Response DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MediaUploadResponse {
    private Long id;
    private String fileUrl;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private LocalDateTime createdAt;
    private boolean temporary;
}

// Error Response DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
class ErrorResponse {
    private String message;
    private int status;
    private LocalDateTime timestamp;
}