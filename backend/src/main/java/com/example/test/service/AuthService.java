package com.example.test.service;

import com.example.test.dto.LoginDto;
import com.example.test.dto.RegisterDto;

public interface AuthService {
    String login(LoginDto loginDto);
    String register(RegisterDto registerDto);

    // TODO: Add methods for other auth-related operations like password reset, etc.
}
