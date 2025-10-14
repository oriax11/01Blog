package com.example.test.service;

import java.util.Map;

import com.example.test.dto.LoginDto;
import com.example.test.dto.RegisterDto;

public interface AuthService {
    Map<String, String> register(RegisterDto registerDto);

    Map<String, String> login(LoginDto loginDto);
}