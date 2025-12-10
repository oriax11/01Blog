package com.example.test.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.test.model.Notification;
import com.example.test.model.User;
import com.example.test.repository.NotificationRepository;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void createNotification(User recipient, User sender, String type, String message, String relatedEntityId) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setSender(sender);
        notification.setType(type);
        notification.setMessage(message);
        notification.setRelatedEntityId(relatedEntityId);
        notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(User recipient) {
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(recipient);
    }

    public void markAsRead(UUID notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

    public void markAsUnread(UUID notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(false);
            notificationRepository.save(notification);
        });
    }

}
