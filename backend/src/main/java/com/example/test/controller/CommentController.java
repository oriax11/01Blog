package com.example.test.controller;

import com.example.test.dto.CommentDTO;
import com.example.test.dto.CommentRequest;
import com.example.test.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles/{articleId}/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<CommentDTO> createComment(@PathVariable Long articleId, @Valid @RequestBody CommentRequest commentRequest, Authentication authentication) {
        String username = authentication.getName();
        CommentDTO createdComment = commentService.createComment(articleId, commentRequest, username);
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CommentDTO>> getCommentsByArticleId(@PathVariable Long articleId) {
        List<CommentDTO> comments = commentService.getCommentsByArticleId(articleId);
        return ResponseEntity.ok(comments);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long articleId, @PathVariable Long commentId, Authentication authentication) {
        String username = authentication.getName();
        commentService.deleteComment(commentId, username);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{commentId}/like")
    public ResponseEntity<Void> likeComment(@PathVariable Long articleId, @PathVariable Long commentId, Authentication authentication) {
        String username = authentication.getName();
        commentService.likeComment(commentId, username);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{commentId}/like")
    public ResponseEntity<Void> unlikeComment(@PathVariable Long articleId, @PathVariable Long commentId, Authentication authentication) {
        String username = authentication.getName();
        commentService.unlikeComment(commentId, username);
        return ResponseEntity.ok().build();
    }
}
