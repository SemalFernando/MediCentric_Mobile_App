package com.tursa.scan.service;

import com.tursa.scan.entity.ScanReport;
import com.tursa.scan.repository.ScanReportRepository;
import com.google.api.services.drive.model.File;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class ScanReportService {

    private final ScanReportRepository repository;
    private final GoogleDriveService driveService;

    public ScanReportService(ScanReportRepository repository, GoogleDriveService driveService) {
        this.repository = repository;
        this.driveService = driveService;
    }

    /** Add a new scan report */
    public ScanReport addScanReport(String patientId, ScanReport scanReport, MultipartFile file)
            throws IOException, InterruptedException, ExecutionException {
        scanReport.setPatientId(patientId);

        if (file != null && !file.isEmpty()) {
            File uploaded = driveService.uploadFile(
                    file,
                    "scan_" + System.currentTimeMillis() + "_" + file.getOriginalFilename(),
                    file.getContentType()
            );
            scanReport.setFileUrl(uploaded.getWebViewLink());
        }

        // Save to Firestore
        String id = repository.save(scanReport);
        scanReport.setScanId(id); // set the generated scanId
        return scanReport;
    }

    /** Get all scan reports for a patient */
    public List<ScanReport> getPatientScanReports(String patientId) throws ExecutionException, InterruptedException {
        return repository.findByPatientId(patientId);
    }

    /** Get a scan report by ID */
    public ScanReport getScanReport(String id) throws ExecutionException, InterruptedException {
        return repository.findById(id);
    }

    /** Update an existing scan report */
    public ScanReport updateScanReport(String id, ScanReport scanReport, MultipartFile file)
            throws IOException, InterruptedException, ExecutionException {
        ScanReport existing = repository.findById(id);
        if (existing != null) {
            scanReport.setScanId(id);
            scanReport.setPatientId(existing.getPatientId());

            if (file != null && !file.isEmpty()) {
                // Delete old file from Drive
                if (existing.getFileUrl() != null) {
                    String oldFileId = driveService.extractFileIdFromUrl(existing.getFileUrl());
                    if (oldFileId != null) driveService.deleteFile(oldFileId);
                }

                // Upload new file
                File uploaded = driveService.uploadFile(
                        file,
                        "scan_" + System.currentTimeMillis() + "_" + file.getOriginalFilename(),
                        file.getContentType()
                );
                scanReport.setFileUrl(uploaded.getWebViewLink());
            } else {
                scanReport.setFileUrl(existing.getFileUrl());
            }

            repository.save(scanReport);
        }
        return scanReport;
    }

    /** Delete a scan report */
    public void deleteScanReport(String id) throws IOException, InterruptedException, ExecutionException {
        ScanReport scanReport = repository.findById(id);
        if (scanReport != null) {
            if (scanReport.getFileUrl() != null) {
                String fileId = driveService.extractFileIdFromUrl(scanReport.getFileUrl());
                if (fileId != null) driveService.deleteFile(fileId);
            }
            repository.deleteById(id);
        }
    }
}
