package com.example.test.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.test.exception.BlogAPIException;
import com.example.test.model.Report;
import com.example.test.model.User;
import com.example.test.repository.ReportRepository;
import com.example.test.service.ReportService;
import com.example.test.service.UserService;

@Service
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final UserService userService;

    public ReportServiceImpl(ReportRepository reportRepository, UserService userService) {
        this.userService = userService;
        this.reportRepository = reportRepository;
    }

    @Override
    public int getReportCount() {
        return (int) reportRepository.count();
    }

    @Override
    public Report createReport(Report report, String reportedByUsername) {
        User reportedBy = userService.findByUsername(reportedByUsername);

        if (reportedBy == null) {
            throw new BlogAPIException(HttpStatus.UNAUTHORIZED, "You must be valid user to report content.");
        }

        String reporter = reportedByUsername;

        


        report.setReportedBy(reporter);
        report.setStatus("pending");
        report.setCreatedAt(LocalDateTime.now());
        return reportRepository.save(report);
    }

    @Override
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    @Override
    public void resolveReport(String id, String action) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus("resolved");
        report.setResolvedAt(LocalDateTime.now());
        // In a real app, we might store the 'action' taken (e.g., "User banned") in a
        // separate field or log
        reportRepository.save(report);
    }

    @Override
    public void dismissReport(String id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus("dismissed");
        reportRepository.save(report);
    }
}
