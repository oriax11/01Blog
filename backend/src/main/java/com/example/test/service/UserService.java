package com.example.test.service;

import com.example.test.dto.UserDTO;
import com.example.test.model.Role;
import com.example.test.model.User;
import com.example.test.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }

    public UserDTO getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        return convertToDTO(user);
    }

    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getEmail(),
                user.getArticles() != null ? user.getArticles().size() : 0,
                user.getComments() != null ? user.getComments().size() : 0,
                user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet()));
    }
}