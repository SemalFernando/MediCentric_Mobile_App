package com.tursa.scan.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tursa.scan.entity.ScanReport;
import com.tursa.scan.service.ScanReportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/patients/{patientId}/scan-reports")
public class ScanReportController {

    private final ScanReportService service;
    private final ObjectMapper objectMapper;

    public ScanReportController(ScanReportService service) {
        this.service = service;
        this.objectMapper = new ObjectMapper();
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ScanReport> add(
            @PathVariable String patientId,
            @RequestPart String scanReport,
            @RequestPart(required = false) MultipartFile file) {
        try {
            ScanReport report = objectMapper.readValue(scanReport, ScanReport.class);
            return ResponseEntity.ok(service.addScanReport(patientId, report, file));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping
    public ResponseEntity<List<ScanReport>> getAll(@PathVariable String patientId) {
        try {
            return ResponseEntity.ok(service.getPatientScanReports(patientId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScanReport> getOne(@PathVariable String id) {
        try {
            ScanReport report = service.getScanReport(id);
            if (report != null) {
                return ResponseEntity.ok(report);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ScanReport> update(
            @PathVariable String id,
            @RequestPart String scanReport,
            @RequestPart(required = false) MultipartFile file) {
        try {
            ScanReport report = objectMapper.readValue(scanReport, ScanReport.class);
            ScanReport updated = service.updateScanReport(id, report, file);
            if (updated != null) {
                return ResponseEntity.ok(updated);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            service.deleteScanReport(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}