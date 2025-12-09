package com.example.test.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.test.dto.ReportDTO;
import com.example.test.model.Report;
import com.example.test.repository.ArticleRepository;
import com.example.test.repository.ReportRepository;
import com.example.test.service.ReportService;
import com.example.test.service.UserService;

@Service
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final UserService userService;
    private final ArticleRepository articleRepository;

    public ReportServiceImpl(ReportRepository reportRepository, UserService userService,
            ArticleRepository articleRepository) {
        this.userService = userService;
        this.reportRepository = reportRepository;
        this.articleRepository = articleRepository;
    }

    @Override
    public int getReportCount() {
        return (int) reportRepository.count();
    }

    @Override
    public Report createReportUser(ReportDTO reportDTO, String reportedByUsername) {
        Report newReport = new Report();
        newReport.setType("user");

        newReport.setReportedBy(reportedByUsername);
        newReport.setStatus("pending");
        newReport.setCreatedAt(LocalDateTime.now());
        newReport.setTargetTitle(
                userService.getUserDTOById(java.util.UUID.fromString(reportDTO.getTargetId())).getUsername());

        // Map other fields from DTO to entity if needed
        newReport.setTargetId(reportDTO.getTargetId());
        newReport.setReason(reportDTO.getReason());

        return reportRepository.save(newReport);
    }

    @Override
    public Report createReportPost(ReportDTO reportDTO, String reportedByUsername) {
        Report newReport = new Report();
        newReport.setType("post");
        newReport.setReportedBy(reportedByUsername);
        newReport.setStatus("pending");
        newReport.setCreatedAt(LocalDateTime.now());

        newReport.setTargetId(reportDTO.getTargetId());

        // Use the injected repository instance
        newReport.setTargetTitle(articleRepository.findTitleById(
                Long.parseLong(reportDTO.getTargetId())));

        newReport.setReason(reportDTO.getReason());

        return reportRepository.save(newReport);
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
