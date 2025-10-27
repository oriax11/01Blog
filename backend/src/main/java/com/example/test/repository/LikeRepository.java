package com.example.test.repository;

import com.example.test.model.Like;
import com.example.test.model.Article;
import com.example.test.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByArticleAndUser(Article article, User user);

    boolean existsByArticleIdAndUserUsername(Long articleId, String username);

    int countByArticleId(Long articleId);

    Long countByArticle(Article article);
}
