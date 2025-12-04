package com.example.test.controller;

import java.util.Map;

import com.example.test.dto.JwtAuthResponse;
import com.example.test.dto.LoginDto;
import com.example.test.dto.RegisterDto;
import com.example.test.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    final private AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Build Login REST API
    @PostMapping(value = { "/login", "/signin" })
    public ResponseEntity<JwtAuthResponse> login(@Valid @RequestBody LoginDto loginDto) {
        Map<String, String> token = authService.login(loginDto);

        JwtAuthResponse jwtAuthResponse = new JwtAuthResponse(token);

        return ResponseEntity.ok(jwtAuthResponse);
    }

    @PostMapping(value = { "/register", "/signup" })
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterDto registerDto) {
        Map<String, String> response = authService.register(registerDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

}
