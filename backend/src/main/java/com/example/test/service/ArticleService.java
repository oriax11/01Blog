package com.example.test.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.hibernate.type.spi.CompositeTypeImplementor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.test.dto.ArticleDTO;
import com.example.test.dto.ArticleRequest;
import com.example.test.dto.UserDTO;
import com.example.test.model.Article;
import com.example.test.model.Like;
import com.example.test.model.Role;
import com.example.test.model.User;
import com.example.test.repository.ArticleRepository;
import com.example.test.repository.CommentRepository;
import com.example.test.repository.LikeRepository;
import com.example.test.repository.UserRepository;

@Service
public class ArticleService {
    public enum DeleteArticleResult {
        SUCCESS,
        NOT_FOUND,
        UNAUTHORIZED
    }

    private final ArticleRepository articleRepository;
    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    public ArticleService(ArticleRepository articleRepository, LikeRepository likeRepository,
            UserRepository userRepository, CommentRepository commentRepository) {
        this.articleRepository = articleRepository;
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    public ArticleDTO createArticle(Article article, UUID currentUserId) {
        Article saved = articleRepository.save(article);
        User user = userRepository.getById(currentUserId);

        // Count likes from the Like table
        UserDTO creatorDTO = new UserDTO(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getEmail(),
                user.getArticles() != null ? user.getArticles().size() : 0,
                user.getFollowers() != null ? user.getFollowers().size() : 0,
                user.getFollowing() != null ? user.getFollowing().size() : 0,
                user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet()));

        return new ArticleDTO(
                saved.getId(),
                saved.getTitle(),
                saved.getContent(),
                creatorDTO,
                saved.getCreatedAt(),
                0,
                0,
                false);
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

    public boolean likeArticle(Long articleId, UUID userId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (likeRepository.findByArticleAndUser(article, user).isPresent()) {
            return false; // already liked
        }

        Like like = Like.builder()
                .article(article)
                .user(user)
                .build();

        likeRepository.save(like);
        return true;
    }

    public boolean unlikeArticle(Long articleId, UUID userId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Like> likeOpt = likeRepository.findByArticleAndUser(article, user);
        if (likeOpt.isEmpty()) {
            return false; // not liked yet
        }

        likeRepository.delete(likeOpt.get());
        return true;
    }

    public Long getLikesCount(Long articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article not found"));
        return likeRepository.countByArticle(article);
    }

    public List<Article> getArticlesFromSubscribedUsers(String username) {
        // 1. Find the logged-in user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 2. Get the list of subscribed users
        Set<User> subscriptions = user.getFollowing();

        // 3. Fetch articles from those users
        return articleRepository.findByCreatorIn(subscriptions);
    }

    public Optional<ArticleDTO> getArticleById(Long id, String username) {
        Optional<Article> articleOpt = articleRepository.findById(id);

        if (articleOpt.isEmpty()) {
            return Optional.empty();
        }

        Article article = articleOpt.get();

        boolean isLiked = likeRepository.existsByArticleIdAndUserUsername(id, username);
        int likeCount = likeRepository.countByArticleId(id);
        int commentsCount = commentRepository.countByArticleId(id);
        User user = article.getCreator();
        UserDTO creatorDTO = new UserDTO(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getEmail(),
                user.getArticles() != null ? user.getArticles().size() : 0,
                user.getFollowers() != null ? user.getFollowers().size() : 0,
                user.getFollowing() != null ? user.getFollowing().size() : 0,
                user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet()));

        ArticleDTO dto = new ArticleDTO(
                article.getId(),
                article.getTitle(),
                article.getContent(),
                creatorDTO,
                article.getCreatedAt(),
                likeCount,
                commentsCount,
                isLiked);

        return Optional.of(dto);
    }

}
