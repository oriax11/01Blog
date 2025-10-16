package com.example.test.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.test.dto.ArticleDTO;
import com.example.test.dto.ArticleRequest;
import com.example.test.model.Article;
import com.example.test.repository.ArticleRepository;

@Service
public class ArticleService {

    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    // Create
    // public Article createArticle(Article article) {
    // return articleRepository.save(article);
    // }

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

    // Delete
    public void deleteArticle(Long id, String username) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));
  
        if (!articleRepository.existsById(id)) {
            throw new RuntimeException("Article not found with id: " + id);
        }
        if (!article.getCreator().getUsername().equals(username)) {
            throw new RuntimeException("You are not allowed to edit this article");
        }
        articleRepository.deleteById(id);
    }
}
