package com.example.test.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.test.dto.ReportDTO;
import com.example.test.dto.UserDTO;
import com.example.test.exception.BlogAPIException;
import com.example.test.model.Article;
import com.example.test.model.Report;
import com.example.test.model.User;
import com.example.test.service.ArticleService;
import com.example.test.service.ReportService;
import com.example.test.service.UserService;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final UserService userService;
    private final ArticleService articleService;

    public ReportController(ReportService reportService, UserService userService, ArticleService articleService) {
        this.reportService = reportService;
        this.userService = userService;
        this.articleService = articleService;
    }

    @PostMapping
    public ResponseEntity<Report> createReport(@RequestBody ReportDTO report, Authentication authentication) {

        String loggedUsername = authentication.getName();

        User reportedBy = userService.findByUsername(loggedUsername);

        if (reportedBy == null) {
            throw new BlogAPIException(HttpStatus.UNAUTHORIZED, "You must be valid user to report content.");
        }
        if (!report.getType().equals("user") && !report.getType().equals("post")) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Report type must be either 'user' or 'post'.");
        }
        if (report.getTargetId() == null || report.getTargetId().isEmpty()) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Target ID must be provided.");
        }
        if (report.getReason() == null || report.getReason().isEmpty()) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Reason for report must be provided.");
        }
        if (report.getType().equals("user")) {
            UserDTO targetUser = userService.getUserDTOById(UUID.fromString(report.getTargetId()));
            if (targetUser == null) {
                throw new BlogAPIException(HttpStatus.BAD_REQUEST, "The user you are trying to report does not exist.");
            }

            return ResponseEntity.ok(reportService.createReportUser(report, loggedUsername));

        } else if (report.getType().equals("post")) {
            Optional<Article> targetPost = articleService
                    .getArticleById(Long.parseLong(report.getTargetId().toString()));
            if (targetPost == null) {
                throw new BlogAPIException(HttpStatus.BAD_REQUEST, "The post you are trying to report does not exist.");
            }
            return ResponseEntity.ok(reportService.createReportPost(report, loggedUsername));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();}

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
