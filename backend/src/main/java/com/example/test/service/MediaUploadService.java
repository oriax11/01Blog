package com.example.test.service;

import com.example.test.dto.MediaUploadResponse;
import com.example.test.model.MediaUpload;
import com.example.test.repository.MediaUploadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MediaUploadService {

    private final MediaUploadRepository mediaUploadRepository;
    private final FileStorageService fileStorageService;

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    /**
     * Upload file to temporary storage
     */
    @Transactional
    public MediaUploadResponse uploadTemporaryFile(MultipartFile file, UUID userId) throws IOException {
        // Validate file
        validateFile(file);

        // Store file
        String fileUrl = fileStorageService.storeTemporaryFile(file);

        // Create database record
        MediaUpload mediaUpload = new MediaUpload();
        mediaUpload.setUserId(userId);
        mediaUpload.setFileUrl(fileUrl);
        mediaUpload.setFileName(file.getOriginalFilename());
        mediaUpload.setFileType(file.getContentType());
        mediaUpload.setFileSize(file.getSize());
        mediaUpload.setTmp(true);

        MediaUpload savedUpload = mediaUploadRepository.save(mediaUpload);

        return mapToResponse(savedUpload);
    }

    /**
     * Associate files with post
     */
    @Transactional
    public void associateFilesWithPost(List<String> fileUrls, Long postId, UUID userId) throws IOException {
        for (String tmpfileUrl : fileUrls) {
            // Verify file belongs to user and is temporary
            String fileUrl = tmpfileUrl.replace("http://localhost:8080/api/media", "");
            System.out.println(fileUrl + "helmqfkjsdmlj fqlskdj mqlsj fqmlsj");
            MediaUpload upload = mediaUploadRepository.findByFileUrl(fileUrl)
                    .orElseThrow(() -> new IllegalArgumentException("File not found: " + fileUrl));

            if (!upload.getUserId().equals(userId)) {
                throw new IllegalArgumentException("Unauthorized access to file: " + fileUrl);
            }

            if (!upload.getTmp()) {
                throw new IllegalArgumentException("File is already associated with a post: " + fileUrl);
            }

            // Move file to post directory
            // String newFileUrl = fileStorageService.moveToPostDirectory(fileUrl, postId);

            // Update database
            upload.setPostId(postId);
            upload.setTmp(false);
            // upload.setFileUrl(newFileUrl);
            mediaUploadRepository.save(upload);
        }
    }

    /**
     * Get user's temporary uploads
     */
    public List<MediaUploadResponse> getUserTemporaryUploads(UUID userId) {
        List<MediaUpload> uploads = mediaUploadRepository.findByUserIdAndTmpTrue(userId);
        return uploads.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Delete temporary file
     */
    @Transactional
    public void deleteTemporaryFile(String fileUrl, Long userId) {
        MediaUpload upload = mediaUploadRepository.findByFileUrl(fileUrl)
                .orElseThrow(() -> new IllegalArgumentException("File not found: " + fileUrl));

        if (!upload.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized access to file: " + fileUrl);
        }

        if (!upload.getTmp()) {
            throw new IllegalArgumentException("Cannot delete non-temporary file");
        }

        // Delete from storage
        fileStorageService.deleteFile(fileUrl);

        // Delete from database
        mediaUploadRepository.delete(upload);
    }

    /**
     * Cleanup old temporary files (to be called by scheduled task)
     */
    @Transactional
    public void cleanupOldTemporaryFiles(int hoursOld) {
        LocalDateTime cutoffTime = LocalDateTime.now().minusHours(hoursOld);
        List<MediaUpload> oldUploads = mediaUploadRepository.findByTmpTrueAndCreatedAtBefore(cutoffTime);

        for (MediaUpload upload : oldUploads) {
            fileStorageService.deleteFile(upload.getFileUrl());
            mediaUploadRepository.delete(upload);
        }
    }

    /**
     * Validate uploaded file
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (!fileStorageService.isValidFileType(file)) {
            throw new IllegalArgumentException("Invalid file type. Only images or videos.");
        }

        if (!fileStorageService.isValidFileSize(file, MAX_FILE_SIZE)) {
            throw new IllegalArgumentException(
                    "File size exceeds maximum limit of " + (MAX_FILE_SIZE / 1024 / 1024) + "MB");
        }
    }

    /**
     * Map entity to response DTO
     */
    private MediaUploadResponse mapToResponse(MediaUpload upload) {
        return new MediaUploadResponse(
                upload.getId(),
                upload.getFileUrl(),
                upload.getFileName(),
                upload.getFileType(),
                upload.getFileSize(),
                upload.getCreatedAt(),
                upload.getTmp());
    }

    public List<String> getFileUrlsByPostId(Long postId) {
        return mediaUploadRepository.findByPostId(postId)
                .stream()
                .map(MediaUpload::getFileUrl)
                .collect(Collectors.toList());
    }

    public void updateMediaForArticle(List<String> addedUrls, List<String> removedUrls, Long articleId, UUID userId)
            throws IOException {
        // Associate new files

        if (addedUrls != null) {
            for (String url : addedUrls) {
                MediaUpload upload = mediaUploadRepository.findByFileUrl(url)
                        .orElseThrow(() -> new IllegalArgumentException("File not found: " + url));
                upload.setPostId(articleId);
                upload.setUserId(userId);
                mediaUploadRepository.save(upload);
            }
        }

        // Remove disassociated files
        if (removedUrls != null) {
            for (String url : removedUrls) {
                MediaUpload upload = mediaUploadRepository.findByFileUrl(url)
                        .orElseThrow(() -> new IllegalArgumentException("File not found: " + url));
                upload.setPostId(null);
                upload.setTmp(true);
                mediaUploadRepository.save(upload);
            }
        }
    }

}