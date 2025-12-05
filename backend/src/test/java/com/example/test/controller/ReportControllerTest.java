package com.example.test.controller;

import java.util.Arrays;

import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.test.model.Report;
import com.example.test.service.ReportService;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
public class ReportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ReportService reportService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    public void createReport_ShouldReturnCreatedReport() throws Exception {
        Report report = new Report();
        report.setReason("Spam");
        report.setTargetId("123");
        report.setType("post");

        when(reportService.createReport(any(Report.class))).thenReturn(report);

        mockMvc.perform(post("/api/reports")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(report)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reason").value("Spam"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void getAllReports_ShouldReturnList() throws Exception {
        Report report1 = new Report();
        report1.setId("1");
        Report report2 = new Report();
        report2.setId("2");

        when(reportService.getAllReports()).thenReturn(Arrays.asList(report1, report2));

        mockMvc.perform(get("/api/reports"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[1].id").value("2"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void resolveReport_ShouldCallService() throws Exception {
        mockMvc.perform(put("/api/reports/1/resolve")
                .param("action", "ban"))
                .andExpect(status().isOk());

        verify(reportService).resolveReport("1", "ban");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void dismissReport_ShouldCallService() throws Exception {
        mockMvc.perform(put("/api/reports/1/dismiss"))
                .andExpect(status().isOk());

        verify(reportService).dismissReport("1");
    }
}
