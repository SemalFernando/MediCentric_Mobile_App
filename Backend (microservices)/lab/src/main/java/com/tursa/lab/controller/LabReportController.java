package com.tursa.lab.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tursa.lab.entity.LabReport;
import com.tursa.lab.service.LabReportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/patients/{patientId}/lab-reports")
public class LabReportController {

    private final LabReportService service;

    public LabReportController(LabReportService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<LabReport> add(
            @PathVariable String patientId,
            @RequestPart("scanReport") String scanReportJson,  // Change to String
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        try {
            // Parse JSON string to LabReport object
            ObjectMapper objectMapper = new ObjectMapper();
            LabReport scanReport = objectMapper.readValue(scanReportJson, LabReport.class);

            return ResponseEntity.ok(service.addLabReport(patientId, scanReport, file));
        } catch (Exception e) {
            e.printStackTrace();  // Log the actual error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<LabReport>> getAll(@PathVariable String patientId) {
        try {
            return ResponseEntity.ok(service.getPatientLabReports(patientId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<LabReport> getOne(@PathVariable String id) {
        try {
            LabReport report = service.getLabReport(id);
            return report != null ? ResponseEntity.ok(report) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<LabReport> update(@PathVariable String id, @RequestPart LabReport scanReport, @RequestPart(required = false) MultipartFile file) {
        try {
            LabReport updated = service.updateLabReport(id, scanReport, file);
            return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            service.deleteLabReport(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}