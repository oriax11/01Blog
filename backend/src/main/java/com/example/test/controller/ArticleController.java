package com.example.test.controller;

import com.example.test.dto.ArticleDTO;
import com.example.test.model.Article;
import com.example.test.dto.ArticleRequest;

import com.example.test.model.User;
import com.example.test.service.ArticleService;
import com.example.test.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;
    private final UserService userService;

    public ArticleController(ArticleService articleService, UserService userService) {
        this.articleService = articleService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<ArticleDTO> createArticle(@Valid @RequestBody ArticleRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username);

        Article article = new Article();
        article.setTitle(request.getTitle());
        article.setContent(request.getContent());
        article.setCreator(user);

        ArticleDTO saved = articleService.createArticle(article);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
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
            @Valid @RequestBody Article article,
            Authentication authentication) {
        String username = authentication.getName();
        Article updated = articleService.updateArticle(id, article, username);
        return ResponseEntity.ok(updated);
    }

    // @DeleteMapping("/{id}")
    // public ResponseEntity<Void> deleteArticle(@PathVariable Long id,
    // Authentication authentication) {
    // String username = authentication.getName();
    // articleService.deleteArticle(id, username);
    // return ResponseEntity.noContent().build();
    // }
}
