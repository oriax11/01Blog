package com.example.test.dto;

import java.time.LocalDateTime;

import com.example.test.model.PostStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArticleDTO {
    private Long id;
    private String title;
    private String content;
    private UserDTO creator;
    private LocalDateTime createdAt;
    private int likeCount;
    private int commentsCount;
    private Boolean isLiked;
    private PostStatus status;

    public ArticleDTO() {
    }

    public ArticleDTO(Long id, String title, String content, UserDTO creator,
            LocalDateTime createdAt, int likeCount, int commentsCount, Boolean isLiked, PostStatus status) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.creator = creator;
        this.createdAt = createdAt;
        this.likeCount = likeCount;
        this.commentsCount = commentsCount;
        this.isLiked = isLiked;
        this.status = status;
    }
}
