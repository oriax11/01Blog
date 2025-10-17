package com.example.test.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.test.dto.ArticleDTO;
import com.example.test.dto.ArticleRequest;
import com.example.test.model.Article;
import com.example.test.repository.ArticleRepository;

@Service
public class ArticleService {
    public enum DeleteArticleResult {
        SUCCESS,
        NOT_FOUND,
        UNAUTHORIZED
    }

    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public ArticleDTO createArticle(Article article) {
        Article saved = articleRepository.save(article);
        return new ArticleDTO(
                saved.getId(),
                saved.getTitle(),
                saved.getContent(),
                saved.getCreator().getId());
    }

    // Get all
    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    // Get by ID
    public Optional<Article> getArticleById(Long id) {
        return articleRepository.findById(id);
    }

    public Article updateArticle(Long id, ArticleRequest updatedArticle, String username) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));

        if (!article.getCreator().getUsername().equals(username)) {
            throw new RuntimeException("You are not allowed to edit this article");
        }

        article.setTitle(updatedArticle.getTitle());
        article.setContent(updatedArticle.getContent());

        return articleRepository.save(article);
    }

    public DeleteArticleResult deleteArticle(Long id, String username) {
        Article article = articleRepository.findById(id).orElse(null);
        if (article == null) {
            return DeleteArticleResult.NOT_FOUND;
        }
        if (!article.getCreator().getUsername().equals(username)) {
            return DeleteArticleResult.UNAUTHORIZED;
        }
        articleRepository.deleteById(id);
        return DeleteArticleResult.SUCCESS;
    }

}
