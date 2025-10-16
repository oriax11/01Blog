package com.example.test.dto;

import java.util.UUID;

public class ArticleDTO {
    private Long id;
    private String title;
    private String content;
    private UUID authorId;

    // Constructors
    public ArticleDTO() {}

    public ArticleDTO(Long id, String title, String content, UUID authorId) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.authorId = authorId;
    }
    

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public UUID getauthorId() {
        return authorId;
    }

    public void setauthorId(UUID authorId) {
        this.authorId = authorId;
    }
}