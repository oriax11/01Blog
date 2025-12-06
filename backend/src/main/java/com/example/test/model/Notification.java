package com.example.test.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User recipient;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User sender;

    @Column(nullable = false)
    private String type; // e.g., "POST", "FOLLOW"

    @Column(nullable = false)
    private String message;

    private String relatedEntityId; // e.g., Post ID

    private boolean isRead = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}
