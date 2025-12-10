package com.example.test.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.test.model.Follow;
import com.example.test.model.User;

public interface FollowRepository extends JpaRepository<Follow, UUID> {

    Optional<Follow> findByFollowerAndFollowing(User follower, User following);

    boolean existsByFollower_UsernameAndFollowing_Id(String followerUsername, UUID followeeId);

    boolean existsByFollowerAndFollowing(User follower, User following);

    void deleteByFollowerAndFollowing(User follower, User following);

    long countByFollower(User follower);

    long countByFollowing(User following);

    List<Follow> findByFollower(User follower);

    List<Follow> findByFollowing(User following);
}