package com.example.test.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentDTO {
    private Long id;
    private String content;
    private UUID commenterId;
    private String commenterUsername;
    private Long articleId;
    private LocalDateTime timestamp;
    private Integer likes;

    public CommentDTO() {
    }

    public CommentDTO(Long id, String content, UUID commenterId, Long articleId, LocalDateTime createdAt,
            Integer likes, String commenterUsername) {
        this.id = id;
        this.content = content;
        this.commenterId = commenterId;
        this.articleId = articleId;
        this.timestamp = createdAt;
        this.likes = likes;
        this.commenterUsername = commenterUsername;
    }

}
