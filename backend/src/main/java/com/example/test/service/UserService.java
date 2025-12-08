package com.example.test.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.test.dto.UserDTO;
import com.example.test.model.Follow;
import com.example.test.model.User;
import com.example.test.repository.FollowRepository;
import com.example.test.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;

    public UserService(UserRepository userRepository, FollowRepository followRepository) {
        this.userRepository = userRepository;
        this.followRepository = followRepository;
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

        Follow follow = new Follow(follower, followee);
        followRepository.save(follow);

        userRepository.save(follower);
        userRepository.save(followee);
    }

    @Transactional
    public void unfollow(String followerUsername, UUID followeeId) {
        User follower = findByUsername(followerUsername);
        User followee = getUserEntityById(followeeId);
        if (follower.getId().equals(followee.getId())) {
            throw new IllegalArgumentException("You cannot unfollow yourself.");
        }

        follower.getFollowing().remove(followee);
        followee.getFollowers().remove(follower);

        userRepository.save(follower);
        userRepository.save(followee);
    }

    public List<UserDTO> searchUsers(String query) {
        // Search by username, email, or display name
        return userRepository.findByUsernameContainingIgnoreCase(query)
                .stream()
                .filter(user -> user.getStatus() != com.example.test.model.Status.BANNED)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean isFollowing(String followerUsername, UUID followeeId) {
        User follower = findByUsername(followerUsername);
        User followee = getUserEntityById(followeeId);

        return follower.getFollowing().contains(followee);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()

                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void banUser(UUID id) {
        User user = getUserEntityById(id);
        user.setStatus(com.example.test.model.Status.BANNED);
        userRepository.save(user);
    }

    public void unbanUser(UUID id) {
        User user = getUserEntityById(id);
        user.setStatus(com.example.test.model.Status.ACTIVE);
        userRepository.save(user);
    }

    public void deleteUser(UUID id) {
        User user = getUserEntityById(id);
        userRepository.delete(user);
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
                user.getRole(),
                user.getStatus());
    }
}