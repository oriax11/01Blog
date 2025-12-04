package com.example.test.service.impl;

import com.example.test.model.Report;
import com.example.test.repository.ReportRepository;
import com.example.test.service.ReportService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;

    public ReportServiceImpl(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    @Override
    public Report createReport(Report report) {
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
