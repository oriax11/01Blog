package com.example.test.service;

import com.example.test.dto.CommentDTO;
import com.example.test.dto.CommentRequest;
import com.example.test.model.Article;
import com.example.test.model.Comment;
import com.example.test.model.CommentLike;
import com.example.test.model.User;
import com.example.test.repository.ArticleRepository;
import com.example.test.repository.CommentLikeRepository;
import com.example.test.repository.CommentRepository;
import com.example.test.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final CommentLikeRepository commentLikeRepository;

    public CommentService(CommentRepository commentRepository, ArticleRepository articleRepository, UserRepository userRepository, CommentLikeRepository commentLikeRepository) {
        this.commentRepository = commentRepository;
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
        this.commentLikeRepository = commentLikeRepository;
    }

    public CommentDTO createComment(Long articleId, CommentRequest commentRequest, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        Comment comment = new Comment();
        comment.setContent(commentRequest.getContent());
        comment.setCommenter(user);
        comment.setArticle(article);

        Comment savedComment = commentRepository.save(comment);
        return toDto(savedComment);
    }

    public List<CommentDTO> getCommentsByArticleId(Long articleId) {
        return commentRepository.findByArticleId(articleId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public void deleteComment(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getCommenter().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    public void likeComment(long commentId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (commentLikeRepository.findByCommentIdAndUserId(commentId, user.getId()).isPresent()) {
            throw new RuntimeException("You have already liked this comment");
        }

        CommentLike commentLike = new CommentLike(user, comment);
        commentLikeRepository.save(commentLike);

        comment.setLikeCount(comment.getLikeCount() + 1);
        commentRepository.save(comment);
    }

    public void unlikeComment(long commentId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        CommentLike commentLike = commentLikeRepository.findByCommentIdAndUserId(commentId, user.getId())
                .orElseThrow(() -> new RuntimeException("You have not liked this comment"));

        commentLikeRepository.delete(commentLike);

        comment.setLikeCount(comment.getLikeCount() - 1);
        commentRepository.save(comment);
    }

    private CommentDTO toDto(Comment comment) {
        return new CommentDTO(
                comment.getId(),
                comment.getContent(),
                comment.getCommenter().getId(),
                comment.getArticle().getId(),
                comment.getCreatedAt(),
                comment.getLikeCount(),
                comment.getCommenter().getUsername()
        );
    }
}
