package com.tursa.lab.service;

import com.tursa.lab.entity.LabReport;
import com.tursa.lab.repository.LabReportRepository;
import com.google.api.services.drive.model.File;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class LabReportService {
    private final LabReportRepository repository;
    private final GoogleDriveService driveService;

    public LabReportService(LabReportRepository repository, GoogleDriveService driveService) {
        this.repository = repository;
        this.driveService = driveService;
    }

    /** Add a new lab report */
    public LabReport addLabReport(String patientId, LabReport labReport, MultipartFile file)
            throws IOException, InterruptedException, ExecutionException {
        labReport.setPatientId(patientId);

        if (file != null && !file.isEmpty()) {
            File uploaded = driveService.uploadFile(
                    file,
                    "lab_" + System.currentTimeMillis() + "_" + file.getOriginalFilename(),
                    file.getContentType()
            );
            labReport.setFileUrl(uploaded.getWebViewLink());
        }

        // Save to Firestore
        String id = repository.save(labReport);
        labReport.setLabReportId(id); // set the generated ID
        return labReport;
    }

    /** Get all lab reports for a patient */
    public List<LabReport> getPatientLabReports(String patientId) throws ExecutionException, InterruptedException {
        return repository.findByPatientId(patientId);
    }

    /** Get a lab report by ID */
    public LabReport getLabReport(String id) throws ExecutionException, InterruptedException {
        return repository.findById(id);
    }

    /** Update an existing lab report */
    public LabReport updateLabReport(String id, LabReport labReport, MultipartFile file)
            throws IOException, InterruptedException, ExecutionException {
        LabReport existing = repository.findById(id);
        if (existing != null) {
            labReport.setLabReportId(id); // use the correct ID field
            labReport.setPatientId(existing.getPatientId());

            if (file != null && !file.isEmpty()) {
                // Delete old file from Drive
                if (existing.getFileUrl() != null) {
                    String oldFileId = driveService.extractFileIdFromUrl(existing.getFileUrl());
                    if (oldFileId != null) driveService.deleteFile(oldFileId);
                }

                // Upload new file
                File uploaded = driveService.uploadFile(
                        file,
                        "lab_" + System.currentTimeMillis() + "_" + file.getOriginalFilename(),
                        file.getContentType()
                );
                labReport.setFileUrl(uploaded.getWebViewLink());
            } else {
                labReport.setFileUrl(existing.getFileUrl());
            }

            repository.save(labReport);
        }
        return labReport;
    }

    /** Delete a lab report */
    public void deleteLabReport(String id) throws IOException, InterruptedException, ExecutionException {
        LabReport labReport = repository.findById(id);
        if (labReport != null) {
            if (labReport.getFileUrl() != null) {
                String fileId = driveService.extractFileIdFromUrl(labReport.getFileUrl());
                if (fileId != null) driveService.deleteFile(fileId);
            }
            repository.deleteById(id);
        }
    }
}
