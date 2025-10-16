package com.example.test.repository;

import java.util.List;

import com.example.test.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    // Find articles with exact title match
    List<Article> findByTitle(String title);

    // Optional: Find articles containing a keyword in title
    List<Article> findByTitleContaining(String keyword);

}
