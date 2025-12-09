package com.example.test.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.test.dto.ArticleDTO;
import com.example.test.dto.ArticleRequest;
import com.example.test.dto.UserDTO;
import com.example.test.model.Article;
import com.example.test.model.Follow;
import com.example.test.model.Like;
import com.example.test.model.PostStatus;
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
        private final NotificationService notificationService;

        public ArticleService(ArticleRepository articleRepository, LikeRepository likeRepository,
                        UserRepository userRepository, CommentRepository commentRepository,
                        NotificationService notificationService) {
                this.articleRepository = articleRepository;
                this.likeRepository = likeRepository;
                this.userRepository = userRepository;
                this.commentRepository = commentRepository;
                this.notificationService = notificationService;
        }

        // public String getArticleTitleById(Long id) {
        // Article article = articleRepository.findById(id)
        // .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));

        // return article.getTitle();
        // }

        public ArticleDTO createArticle(Article article, UUID currentUserId) {
                Article saved = articleRepository.save(article);
                User user = userRepository.getReferenceById(currentUserId);

                // Count likes from the Like table
                UserDTO creatorDTO = new UserDTO(
                                user.getId(),
                                user.getName(),
                                user.getUsername(),
                                user.getEmail(),
                                user.getArticles() != null ? user.getArticles().size() : 0,
                                user.getFollowers() != null ? user.getFollowers().size() : 0,
                                user.getFollowing() != null ? user.getFollowing().size() : 0,
                                user.getRole(), user.getStatus());

                // Notify followers
                if (user.getFollowers() != null && !user.getFollowers().isEmpty()) {
                        user.getFollowers().forEach(follow -> {
                                notificationService.createNotification(
                                                follow.getFollower(),
                                                user,
                                                "POST",
                                                user.getUsername() + " published a new article",
                                                saved.getId().toString());
                        });
                }

                return new ArticleDTO(
                                saved.getId(),
                                saved.getTitle(),
                                saved.getContent(),
                                creatorDTO,
                                saved.getCreatedAt(),
                                0,
                                0,
                                false, saved.getStatus());
        }

        // Get all
        public List<Article> getAllArticles() {
                return articleRepository.findAll();
        }

        public List<ArticleDTO> getAllArticlesDTO() {
                return articleRepository.findAll().stream().map(article -> {
                        boolean isLiked = false; // Admin view doesn't need personal like status
                        int likeCount = likeRepository.countByArticleId(article.getId());
                        int commentsCount = commentRepository.countByArticleId(article.getId());

                        User creator = article.getCreator();
                        UserDTO creatorDTO = new UserDTO(
                                        creator.getId(),
                                        creator.getName(),
                                        creator.getUsername(),
                                        creator.getEmail(),
                                        creator.getArticles() != null ? creator.getArticles().size() : 0,
                                        creator.getFollowers() != null ? creator.getFollowers().size() : 0,
                                        creator.getFollowing() != null ? creator.getFollowing().size() : 0,
                                        creator.getRole(), creator.getStatus());

                        return new ArticleDTO(
                                        article.getId(),
                                        article.getTitle(),
                                        article.getContent(),
                                        creatorDTO,
                                        article.getCreatedAt(),
                                        likeCount,
                                        commentsCount,
                                        isLiked , article.getStatus());
                }).toList();
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

        public DeleteArticleResult deleteArticle(Long id, String username, boolean isAdmin) {
                Article article = articleRepository.findById(id).orElse(null);
                if (article == null) {
                        return DeleteArticleResult.NOT_FOUND;
                }
                if (article.getStatus().equals("hidden") && !isAdmin) {
                        return DeleteArticleResult.NOT_FOUND;
                }

                if (!article.getCreator().getUsername().equals(username)) {
                        return DeleteArticleResult.UNAUTHORIZED;
                }
                articleRepository.deleteById(id);
                return DeleteArticleResult.SUCCESS;
        }

        public void hideArticle(Long id) {
                Article article = articleRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Article not found"));
                article.setStatus(PostStatus.HIDDEN);
                articleRepository.save(article);
        }

        public void unhideArticle(Long id) {
                Article article = articleRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Article not found"));
                article.setStatus(PostStatus.PUBLISHED);
                articleRepository.save(article);
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

        public List<ArticleDTO> getArticlesFromSubscribedUsers(String username) {

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                Set<User> subscriptions = user.getFollowing() != null
                                ? user.getFollowing().stream()
                                                .map(Follow::getFollowing)
                                                .collect(Collectors.toSet())
                                : new HashSet<>();

                List<Article> articles = articleRepository
                                .findByCreatorInAndStatusNot(subscriptions, PostStatus.HIDDEN);

                return articles.stream().map(article -> {

                        boolean isLiked = likeRepository
                                        .existsByArticleIdAndUserUsername(article.getId(), username);

                        int likeCount = likeRepository
                                        .countByArticleId(article.getId());

                        int commentsCount = commentRepository
                                        .countByArticleId(article.getId());

                        User creator = article.getCreator();

                        UserDTO creatorDTO = new UserDTO(
                                        creator.getId(),
                                        creator.getName(),
                                        creator.getUsername(),
                                        creator.getEmail(),
                                        creator.getArticles() != null ? creator.getArticles().size() : 0,
                                        creator.getFollowers() != null ? creator.getFollowers().size() : 0,
                                        creator.getFollowing() != null ? creator.getFollowing().size() : 0,
                                        creator.getRole(), creator.getStatus());

                        return new ArticleDTO(
                                        article.getId(),
                                        article.getTitle(),
                                        article.getContent(),
                                        creatorDTO,
                                        article.getCreatedAt(),
                                        likeCount,
                                        commentsCount,
                                        isLiked, article.getStatus());

                }).toList();
        }

        public Optional<ArticleDTO> getArticleById(Long id, String username, boolean isAdmin) {
                Optional<Article> articleOpt = articleRepository.findById(id);

                if (articleOpt.isEmpty()) {
                        return Optional.empty();
                }

                Article article = articleOpt.get();
                if (article.getStatus() == PostStatus.HIDDEN && !isAdmin) {
                        return Optional.empty();
                }

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
                                user.getRole(), user.getStatus());

                ArticleDTO dto = new ArticleDTO(
                                article.getId(),
                                article.getTitle(),
                                article.getContent(),
                                creatorDTO,
                                article.getCreatedAt(),
                                likeCount,
                                commentsCount,
                                isLiked,
                                article.getStatus());

                return Optional.of(dto);
        }

        public List<ArticleDTO> getArticlesByUser(User user, String loggedUsername) {

                return user.getArticles()
                                .stream()
                                .filter(article -> !article.getStatus().equals(PostStatus.HIDDEN))
                                .map(article -> {

                                        boolean isLiked = likeRepository
                                                        .existsByArticleIdAndUserUsername(article.getId(),
                                                                        loggedUsername);

                                        int likeCount = likeRepository
                                                        .countByArticleId(article.getId());

                                        int commentsCount = commentRepository
                                                        .countByArticleId(article.getId());

                                        User creator = article.getCreator();

                                        UserDTO creatorDTO = new UserDTO(
                                                        creator.getId(),
                                                        creator.getName(),
                                                        creator.getUsername(),
                                                        creator.getEmail(),
                                                        creator.getArticles() != null ? creator.getArticles().size()
                                                                        : 0,
                                                        creator.getFollowers() != null ? creator.getFollowers().size()
                                                                        : 0,
                                                        creator.getFollowing() != null ? creator.getFollowing().size()
                                                                        : 0,
                                                        creator.getRole(),
                                                        creator.getStatus());

                                        return new ArticleDTO(
                                                        article.getId(),
                                                        article.getTitle(),
                                                        article.getContent(),
                                                        creatorDTO,
                                                        article.getCreatedAt(),
                                                        likeCount,
                                                        commentsCount,
                                                        isLiked, article.getStatus());

                                }).toList();
        }

}
