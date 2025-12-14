package com.example.test.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.test.dto.LoginDto;
import com.example.test.dto.RegisterDto;
import com.example.test.exception.BlogAPIException;
import com.example.test.exception.UserBannedException;
import com.example.test.model.Status;
import com.example.test.model.User;
import com.example.test.repository.UserRepository;
import com.example.test.security.JwtTokenProvider;
import com.example.test.service.AuthService;

import org.apache.commons.validator.routines.EmailValidator;

@Service
public class AuthServiceImpl implements AuthService {

    private AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtTokenProvider jwtTokenProvider;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public Map<String, String> login(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDto.getUsernameOrEmail(), loginDto.getPassword()));

        User user = userRepository
                .findByUsernameOrEmail(loginDto.getUsernameOrEmail(), loginDto.getUsernameOrEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() == Status.BANNED) {
            throw new UserBannedException();
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return response;

    }

    @Override
    public Map<String, String> register(RegisterDto registerDto) {

        // Validate username
        if (!registerDto.getUsername().matches("^[a-zA-Z0-9_.-]{3,30}$")) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Username contains invalid characters.");
        }

        // Validate name
        if (!registerDto.getName().matches("^[a-zA-Z '-]{1,50}$")) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Name contains invalid characters.");
        }

        // Validate email
        EmailValidator validator = EmailValidator.getInstance();
        if (!validator.isValid(registerDto.getEmail())) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Email format is invalid.");
        }

        // Validate password
        if (registerDto.getPassword().length() < 8) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Password must be at least 8 characters.");
        }
        // Check for username exists in database
        if (userRepository.existsByUsername(registerDto.getUsername())) {
            throw new BlogAPIException(HttpStatus.CONFLICT, "Username is already taken!.");
        }

        // Check for email exists in database
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new BlogAPIException(HttpStatus.CONFLICT, "Email is already used!.");
        }
        User user = new User();
        user.setName(registerDto.getName());
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));

        // endpoint for the roles or something similar
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully!");
        return response;
    }
}