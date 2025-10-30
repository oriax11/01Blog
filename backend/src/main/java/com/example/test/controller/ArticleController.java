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
import java.util.Optional;
import java.util.UUID;
import com.example.test.utils.MediaUtils;

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
        ArticleDTO saved = articleService.createArticle(article, user.getId());

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
    public ResponseEntity<List<ArticleDTO>> getSubscribedArticles(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = authentication.getName();
        List<ArticleDTO> response = articleService.getArticlesFromSubscribedUsers(username);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticleDTO> getArticleById(@PathVariable Long id, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = authentication.getName();

        return articleService.getArticleById(id, username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Article> updateArticle(@PathVariable Long id,
            @Valid @RequestBody ArticleRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Article> originalOpt = articleService.getArticleById(id);
        if (originalOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Article original = originalOpt.get();
        Article updated = articleService.updateArticle(id, request, username);

        List<String> oldUrls = mediaUploadService.getFileUrlsByPostId(original.getId());
        List<String> newUrls = request.getFileUrls();

        MediaUtils.UrlDiff diff = MediaUtils.diffUrls(oldUrls, newUrls);

        try {
            mediaUploadService.updateMediaForArticle(diff.getAdded(), diff.getRemoved(), updated.getId(), user.getId());
        } catch (IOException e) {
            System.err.println("Error updating media for article " + updated.getId() + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

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
    public ResponseEntity<List<ArticleDTO>> getArticlesByUser(
            @PathVariable UUID userId, Authentication authentication) {

        User user = userService.getUserEntityById(userId);
        String loggedUsername = authentication.getName();

        List<ArticleDTO> articleDTOs = articleService.getArticlesByUser(user, loggedUsername);

        return ResponseEntity.ok(articleDTOs);
    }

}
