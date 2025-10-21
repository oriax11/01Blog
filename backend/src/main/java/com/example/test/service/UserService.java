package com.example.test.service;

import com.example.test.dto.UserDTO;
import com.example.test.model.Role;
import com.example.test.model.User;
import com.example.test.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public UserDTO getUserDTOById(UUID id) {
        return userRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User getUserEntityById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Transactional
    public void follow(String followerUsername, UUID followeeId) {
        User follower = findByUsername(followerUsername);
        User followee = getUserEntityById(followeeId);
        if (follower.getId().equals(followee.getId())) {
            throw new IllegalArgumentException("You cannot follow yourself.");
        }

        follower.getFollowing().add(followee);
        followee.getFollowers().add(follower);

        userRepository.save(follower);
        userRepository.save(followee);
    }

    @Transactional
    public void unfollow(String followerUsername, UUID followeeId) {
        User follower = findByUsername(followerUsername);
        User followee = getUserEntityById(followeeId);

        follower.getFollowing().remove(followee);
        followee.getFollowers().remove(follower);

        userRepository.save(follower);
        userRepository.save(followee);
    }

    @Transactional(readOnly = true)
    public boolean isFollowing(String followerUsername, UUID followeeId) {
        User follower = findByUsername(followerUsername);
        User followee = getUserEntityById(followeeId);

        return follower.getFollowing().contains(followee);
    }

    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getEmail(),
                user.getArticles() != null ? user.getArticles().size() : 0,
                user.getFollowers() != null ? user.getFollowers().size() : 0,
                user.getFollowing() != null ? user.getFollowing().size() : 0,
                user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet()));
    }
}