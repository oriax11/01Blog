package com.example.test.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.test.model.Notification;
import com.example.test.model.User;
import com.example.test.service.NotificationService;
import com.example.test.service.UserService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username);
        return ResponseEntity.ok(notificationService.getUserNotifications(user));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/unread")
    public ResponseEntity<Void> markAsUnread(@PathVariable UUID id) {
        notificationService.markAsUnread(id);
        return ResponseEntity.ok().build();
    }

}
