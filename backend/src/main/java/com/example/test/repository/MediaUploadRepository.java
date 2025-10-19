package com.example.test.repository;

import com.example.test.model.MediaUpload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MediaUploadRepository extends JpaRepository<MediaUpload, Long> {
    
    // Find by file URL
    Optional<MediaUpload> findByFileUrl(String fileUrl);
    
    // Find all temp files for a user
    List<MediaUpload> findByUserIdAndTmpTrue(UUID userId);
    
    // Find all files for a post
    List<MediaUpload> findByPostId(Long postId);
    
    // Find temp files older than given date
    List<MediaUpload> findByTmpTrueAndCreatedAtBefore(LocalDateTime dateTime);
    
    // Update post association
    @Modifying
    @Query("UPDATE MediaUpload m SET m.postId = :postId, m.tmp = false, m.fileUrl = :newFileUrl WHERE m.fileUrl = :oldFileUrl AND m.userId = :userId AND m.tmp = true")
    int updatePostAssociation(@Param("postId") Long postId, 
                              @Param("newFileUrl") String newFileUrl, 
                              @Param("oldFileUrl") String oldFileUrl, 
                              @Param("userId") UUID userId);
    
    // Delete by file URLs
    @Modifying
    @Query("DELETE FROM MediaUpload m WHERE m.fileUrl IN :fileUrls AND m.userId = :userId")
    int deleteByFileUrlsAndUserId(@Param("fileUrls") List<String> fileUrls, @Param("userId") UUID userId);
    
    // Check if file belongs to user
    boolean existsByFileUrlAndUserId(String fileUrl, UUID userId);
}