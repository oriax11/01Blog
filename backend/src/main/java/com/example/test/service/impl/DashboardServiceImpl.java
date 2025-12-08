package com.example.test.service.impl;

import org.springframework.stereotype.Service;

import com.example.test.dto.DashboardDTO;
import com.example.test.repository.ArticleRepository;
import com.example.test.repository.ReportRepository;
import com.example.test.repository.UserRepository;
import com.example.test.service.DashboardService;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;
    private final ReportRepository reportRepository;

    public DashboardServiceImpl(UserRepository userRepository, ArticleRepository articleRepository, ReportRepository reportRepository) {
        this.userRepository = userRepository;
        this.articleRepository = articleRepository;
        this.reportRepository = reportRepository;
    }

    @Override
    public DashboardDTO getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalPosts = articleRepository.count();
        long totalReports = reportRepository.count();

        return new DashboardDTO(totalUsers, totalPosts, totalReports);
    }
}
