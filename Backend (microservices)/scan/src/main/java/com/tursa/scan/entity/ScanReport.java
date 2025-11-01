package com.tursa.scan.entity;

import java.util.Date;

public class ScanReport {
    private String scanId;
    private String patientId;
    private String radiologistId;
    private String scanType;
    private String scanDescription;
    private Date scanDate;
    private String scanResults;
    private String fileUrl;
    private String comments;
    private String status;
    private String category;

    // Constructors
    public ScanReport() {}

    public ScanReport(String patientId, String radiologistId, String scanType, String scanDescription, String category) {
        this.patientId = patientId;
        this.radiologistId = radiologistId;
        this.scanType = scanType;
        this.scanDescription = scanDescription;
        this.category = category;
        this.scanDate = new Date();
        this.status = "PENDING";
    }

    // Getters and Setters
    public String getScanId() { return scanId; }
    public void setScanId(String scanId) { this.scanId = scanId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getRadiologistId() { return radiologistId; }
    public void setRadiologistId(String radiologistId) { this.radiologistId = radiologistId; }

    public String getScanType() { return scanType; }
    public void setScanType(String scanType) { this.scanType = scanType; }

    public String getScanDescription() { return scanDescription; }
    public void setScanDescription(String scanDescription) { this.scanDescription = scanDescription; }

    public Date getScanDate() { return scanDate; }
    public void setScanDate(Date scanDate) { this.scanDate = scanDate; }

    public String getScanResults() { return scanResults; }
    public void setScanResults(String scanResults) { this.scanResults = scanResults; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}