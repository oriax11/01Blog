package com.example.test.dto;

import java.time.LocalDateTime;

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

    public ArticleDTO() {
    }

    public ArticleDTO(Long id, String title, String content, UserDTO creator,
            LocalDateTime createdAt, int likeCount, int commentsCount, Boolean isLiked) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.creator = creator;
        this.createdAt = createdAt;
        this.likeCount = likeCount;
        this.commentsCount = commentsCount;
        this.isLiked = isLiked;
    }
}
