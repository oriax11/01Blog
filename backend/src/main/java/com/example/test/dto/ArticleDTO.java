package com.example.test.dto;

public class ArticleDTO {
    private Long id;
    private String title;
    private String content;
    private long authorId;

    // Constructors
    public ArticleDTO() {}

    public ArticleDTO(Long id, String title, String content, long authorId) {
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

    public long getauthorId() {
        return authorId;
    }

    public void setauthorId(long authorId) {
        this.authorId = authorId;
    }
}