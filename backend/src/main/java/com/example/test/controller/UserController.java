package com.example.test.controller;

import com.example.test.dto.UserDTO;
import com.example.test.service.UserService;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable UUID id) {
        UserDTO user = userService.getUserDTOById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<Void> followUser(@PathVariable UUID id, @AuthenticationPrincipal UserDetails userDetails) {


        userService.follow(userDetails.getUsername(), id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{id}/unfollow")
    public ResponseEntity<Void> unfollowUser(@PathVariable UUID id, @AuthenticationPrincipal UserDetails userDetails) {
        userService.unfollow(userDetails.getUsername(), id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{id}/is-following")
    public ResponseEntity<Boolean> isFollowing(@PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        boolean isFollowing = userService.isFollowing(userDetails.getUsername(), id);
        return new ResponseEntity<>(isFollowing, HttpStatus.OK);
    }
}