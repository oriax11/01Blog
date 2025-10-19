package com.example.test.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload.dir:uploads}")
    private String uploadDir;

    /**
     * Store file in temporary directory
     */
    public String storeTemporaryFile(MultipartFile file) throws IOException {
        // Create temp directory if not exists
        Path realPath = Paths.get(uploadDir);
        Files.createDirectories(realPath);

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        String uniqueFileName = UUID.randomUUID().toString() + extension;

        // Store file
        Path targetPath = realPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // Return relative URL
        return "/" + uploadDir + "/" + uniqueFileName;
    }

    /**
     * Delete file from storage
     */
    public void deleteFile(String fileUrl) {
        try {
            Path filePath = Paths.get(fileUrl.substring(1)); // Remove leading slash
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log error but don't throw - file might already be deleted
            System.err.println("Failed to delete file: " + fileUrl + " - " + e.getMessage());
        }
    }

    /**
     * Validate file type
     */
    public boolean isValidFileType(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null)
            return false;

        return contentType.startsWith("image/") ||
                contentType.startsWith("video/");
    }

    /**
     * Validate file size (default max: 10MB)
     */
    public boolean isValidFileSize(MultipartFile file, long maxSizeInBytes) {
        return file.getSize() <= maxSizeInBytes;
    }

    /**
     * Get file extension
     */
    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "";
        }
        int lastDotIndex = filename.lastIndexOf('.');
        return (lastDotIndex == -1) ? "" : filename.substring(lastDotIndex);
    }

    /**
     * Get content type from file
     */
    public String getContentType(MultipartFile file) {
        return file.getContentType();
    }
}