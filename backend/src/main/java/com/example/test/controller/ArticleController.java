package com.example.test.controller;

import com.example.test.dto.ArticleDTO;
import com.example.test.model.Article;
import com.example.test.dto.ArticleRequest;
import com.example.test.model.User;
import com.example.test.service.ArticleService;
import com.example.test.service.ArticleService.DeleteArticleResult;
import com.example.test.service.MediaUploadService;
import com.example.test.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;
    private final UserService userService;
    private final MediaUploadService mediaUploadService;

    public ArticleController(ArticleService articleService, UserService userService,
            MediaUploadService mediaUploadService) {
        this.articleService = articleService;
        this.userService = userService;
        this.mediaUploadService = mediaUploadService;
    }

    @PostMapping
    public ResponseEntity<ArticleDTO> createArticle(@Valid @RequestBody ArticleRequest request,
            Authentication authentication) {
        // Ensure the user is authenticated
        String username = authentication != null ? authentication.getName() : null;
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Build the article entity
        Article article = new Article();
        article.setTitle(request.getTitle());
        article.setContent(request.getContent());
        article.setCreator(user);

        // Save the article
        ArticleDTO saved = articleService.createArticle(article);

        // Associate uploaded files (if any)
        List<String> fileUrls = request.getFileUrls();
        if (fileUrls != null && !fileUrls.isEmpty()) {
            try {
                mediaUploadService.associateFilesWithPost(fileUrls, saved.getId(), user.getId());
            } catch (IOException e) {
                // Log the error instead of swallowing it silently
                System.err.println("Error associating media with article " + saved.getId() + ": " + e.getMessage());
                e.printStackTrace();
                // Optional: return an error response instead
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<Article>> getAllArticles() {
        return ResponseEntity.ok(articleService.getAllArticles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        return articleService.getArticleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Article> updateArticle(@PathVariable Long id,
            @Valid @RequestBody ArticleRequest article,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Article updated = articleService.updateArticle(id, article, username);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteArticle(@PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        DeleteArticleResult result = articleService.deleteArticle(id, username);
        switch (result) {
            case NOT_FOUND:
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Article not found");
            case UNAUTHORIZED:
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("You are not allowed to delete this article");
            case SUCCESS:
                return ResponseEntity.ok("Article deleted successfully");
            default:
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unknown error");
        }

    }

    // Get articles by user UUID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Article>> getArticlesByUser(@PathVariable UUID userId) {

        User user = userService.getUserEntityById(userId);
        List<Article> articles = user.getArticles();
        return ResponseEntity.ok(articles);
    }
}
