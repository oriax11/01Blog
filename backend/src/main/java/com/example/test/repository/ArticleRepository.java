package com.example.test.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.test.model.Article;
import com.example.test.model.User;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    // Find articles with exact title match
    List<Article> findByTitle(String title);
    String findTitleById(Long id);

    // Optional: Find articles containing a keyword in title
    List<Article> findByTitleContaining(String keyword);

    List<Article> findByCreatorIn(Set<User> authors);

}
