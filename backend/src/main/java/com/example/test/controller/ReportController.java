package com.example.test.controller;

import com.example.test.model.Report;
import com.example.test.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<Report> createReport(@RequestBody Report report) {
        return ResponseEntity.ok(reportService.createReport(report));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> resolveReport(@PathVariable String id, @RequestParam String action) {
        reportService.resolveReport(id, action);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/dismiss")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> dismissReport(@PathVariable String id) {
        reportService.dismissReport(id);
        return ResponseEntity.ok().build();
    }
}
