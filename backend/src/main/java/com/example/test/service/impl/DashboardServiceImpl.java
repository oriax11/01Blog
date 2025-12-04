package com.example.test.service.impl;

import com.example.test.dto.DashboardDTO;
import com.example.test.repository.ArticleRepository;
import com.example.test.repository.UserRepository;
import com.example.test.service.DashboardService;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;

    public DashboardServiceImpl(UserRepository userRepository, ArticleRepository articleRepository) {
        this.userRepository = userRepository;
        this.articleRepository = articleRepository;
    }

    @Override
    public DashboardDTO getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalPosts = articleRepository.count();
        long totalReports = 0; // Reports are not yet implemented

        return new DashboardDTO(totalUsers, totalPosts, totalReports);
    }
}
