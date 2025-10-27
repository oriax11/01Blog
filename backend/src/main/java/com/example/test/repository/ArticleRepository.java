package com.example.test.repository;

import java.util.List;
import java.util.Set;

import com.example.test.model.Article;
import com.example.test.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    // Find articles with exact title match
    List<Article> findByTitle(String title);

    // Optional: Find articles containing a keyword in title
    List<Article> findByTitleContaining(String keyword);

    List<Article> findByCreatorIn(Set<User> authors);

}
