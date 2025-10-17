package com.example.test.dto;

import java.util.Set;
import java.util.UUID;

public class UserDTO {
    private UUID id;
    private String name;
    private String username;
    private String email;
    private Integer articlesCount;
    private Integer followersCount;
    private Integer followingCount;
    private Set<String> roles;

    // Constructors
    public UserDTO() {
    }

    public UserDTO(UUID id, String name, String username, String email,
            Integer articlesCount, Integer followersCount, Integer followingCount, Set<String> roles) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.articlesCount = articlesCount;
        this.roles = roles;
        this.followersCount = followersCount;
        this.followingCount = followingCount;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getarticlesCount() {
        return articlesCount;
    }

    public void setarticlesCount(Integer articlesCount) {
        this.articlesCount = articlesCount;
    }

    public Integer getFollowersCount() {
        return followersCount;
    }

    public void setFollowersCount(Integer followersCount) {
        this.followersCount = followersCount;
    }

    public Integer getFollowingCount() {
        return followingCount;
    }

    public void setFollowingCount(Integer followingCount) {
        this.followingCount = followingCount;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}