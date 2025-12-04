package com.example.test.service;

import com.example.test.model.Report;
import java.util.List;

public interface ReportService {
    Report createReport(Report report);

    List<Report> getAllReports();

    void resolveReport(String id, String action);

    void dismissReport(String id);
}
