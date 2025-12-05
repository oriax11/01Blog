package com.example.test.service;

import java.util.HashSet;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.example.test.model.Article;
import com.example.test.model.Notification;
import com.example.test.model.User;
import com.example.test.repository.NotificationRepository;
import com.example.test.repository.UserRepository;

@SpringBootTest
@Transactional
public class NotificationTest {

    @Autowired
    private ArticleService articleService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Test
    public void testNotificationOnPostCreation() {
        // 1. Create two users
        User author = new User();
        author.setName("Author Name");
        author.setUsername("author");
        author.setEmail("author@example.com");
        author.setPassword("password");
        author.setFollowers(new HashSet<>());
        userRepository.save(author);

        User follower = new User();
        follower.setName("Follower Name");
        follower.setUsername("follower");
        follower.setEmail("follower@example.com");
        follower.setPassword("password");
        follower.setFollowing(new HashSet<>());
        userRepository.save(follower);

        // 2. Follower follows author
        // We need to establish the relationship manually for the test since we are not
        // using the controller
        author.getFollowers().add(follower);
        follower.getFollowing().add(author);
        userRepository.save(author);
        userRepository.save(follower);

        // 3. Author creates an article
        Article article = new Article();
        article.setTitle("New Post");
        article.setContent("This is a sufficiently long content for the article.");
        article.setCreator(author);

        articleService.createArticle(article, author.getId());

        // 4. Verify notification created for follower
        List<Notification> notifications = notificationRepository.findByRecipientOrderByCreatedAtDesc(follower);
        assertEquals(1, notifications.size());
        assertEquals("POST", notifications.get(0).getType());
        assertFalse(notifications.get(0).isRead());
    }
}
