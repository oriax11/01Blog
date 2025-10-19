package com.example.test.controller;

import com.example.test.dto.MediaUploadResponse;
import com.example.test.model.User;
import com.example.test.service.MediaUploadService;
import com.example.test.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
// import java.net.MalformedURLException;
// import java.net.http.HttpHeaders;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaUploadController {

    private final MediaUploadService mediaUploadService;
    private final UserService userService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadMedia(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username);

        try {
            MediaUploadResponse response = mediaUploadService.uploadTemporaryFile(file, user.getId());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST.value()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to upload file: " + e.getMessage(),
                            HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    /**
     * Serve uploaded files
     * GET /api/media/uploads/{filename}
     * Example: /api/media/uploads/379be99e-0506-46cc-a143-07e230351b84.png
     */
    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads").resolve(filename).normalize();
            if (!filePath.startsWith(Paths.get("uploads"))) {
                return ResponseEntity.badRequest().build();
            }

            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get user's temporary uploads
     * GET /api/media/temp
     */
    // @GetMapping("/temp")
    // public ResponseEntity<List<MediaUploadResponse>> getTemporaryUploads(
    // Authentication authentication) {
    // String username = authentication.getName();
    // User user = userService.findByUsername(username);
    // List<MediaUploadResponse> uploads =
    // mediaUploadService.getUserTemporaryUploads(user.getId());
    // return ResponseEntity.ok(uploads);
    // }

    // /**
    // * Delete temporary file
    // * DELETE /api/media/temp
    // */
    // @DeleteMapping("/temp")
    // public ResponseEntity<?> deleteTemporaryFile(
    // @RequestParam("fileUrl") String fileUrl,
    // @RequestHeader("User-Id") Long userId) {

    // try {
    // mediaUploadService.deleteTempo // private Map<String, Object>
    // createErrorResponse(String message, int status) {
    // Map<String, Object> error = new HashMap<>();
    // error.put("message", message);
    // error.put("status", status);
    // error.put("timestamp", LocalDateTime.now());
    // return error;
    // }raryFile(fileUrl, userId);
    // return ResponseEntity.ok(Map.of("message", "File deleted successfully"));
    // } catch (IllegalArgumentException e) {
    // return ResponseEntity.badRequest()
    // .body(createErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST.value()));
    // }
    // }

    /**
     * Health check endpoint
     * GET /api/media/health
     */
    // @GetMapping("/health")
    // public ResponseEntity<Map<String, String>> health() {
    // return ResponseEntity.ok(Map.of(
    // "status", "UP",
    // "timestamp", LocalDateTime.now().toString()));
    // }

    /**
     * Create error response
     */
    private Map<String, Object> createErrorResponse(String message, int status) {
        Map<String, Object> error = new HashMap<>();
        error.put("message", message);
        error.put("status", status);
        error.put("timestamp", LocalDateTime.now());
        return error;
    }
}