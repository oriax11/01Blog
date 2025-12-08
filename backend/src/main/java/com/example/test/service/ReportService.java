package com.example.test.service;

import java.util.List;

import com.example.test.dto.ReportDTO;
import com.example.test.model.Report;

public interface ReportService {
    Report createReportPost(ReportDTO report, String reportedByUsername);
    Report createReportUser(ReportDTO report, String reportedByUsername);

    List<Report> getAllReports();

    void resolveReport(String id, String action);

    void dismissReport(String id);

    int getReportCount();
}
