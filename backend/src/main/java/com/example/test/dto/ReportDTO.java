package com.example.test.dto;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportDTO {
    private String type; // "user" or "post"

    @Column(nullable = false)
    private String targetId;

    @Column(nullable = false)
    private String reason;

}
