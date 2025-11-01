package com.tursa.lab.entity;

import java.util.Date;

public class LabReport {
    private String labReportId;
    private String patientId;
    private String nurseId;
    private String labReportType;
    private String labReportDescription;
    private Date labReportDate;
    private String labReportResults;
    private String fileUrl;
    private String comments;
    private String status;
    private String category;

    // Constructors
    public LabReport() {
        this.labReportDate = new Date();
    }

    public LabReport(String patientId, String nurseId, String labReportType, String labReportDescription, String category) {
        this.patientId = patientId;
        this.nurseId = nurseId;
        this.labReportType = labReportType;
        this.labReportDescription = labReportDescription;
        this.category = category;
        this.labReportDate = new Date();
        this.status = "PENDING";
    }

    // Getters and Setters
    public String getLabReportId() { return labReportId; }
    public void setLabReportId(String labReportId) { this.labReportId = labReportId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getNurseId() { return nurseId; }
    public void setNurseId(String nurseId) { this.nurseId = nurseId; }

    public String getLabReportType() { return labReportType; }
    public void setLabReportType(String labReportType) { this.labReportType = labReportType; }

    public String getLabReportDescription() { return labReportDescription; }
    public void setLabReportDescription(String labReportDescription) { this.labReportDescription = labReportDescription; }

    public Date getLabReportDate() { return labReportDate; }
    public void setLabReportDate(Date labReportDate) { this.labReportDate = labReportDate; }

    public String getLabReportResults() { return labReportResults; }
    public void setLabReportResults(String labReportResults) { this.labReportResults = labReportResults; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
