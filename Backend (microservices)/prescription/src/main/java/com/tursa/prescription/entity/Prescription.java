package com.tursa.prescription.entity;

import java.util.Date;

public class Prescription {
    private String prescriptionId;
    private String patientId;
    private String doctorId;
    private Date issueDate = new Date();
    private Long nextReviewDate;
    private String category;
    private String notes;
    private String qrCode; // NEW: QR code field
    private String medicationName; // NEW: Added medication name

    // Constructors
    public Prescription() {}

    public Prescription(String patientId, String doctorId, String medicationName, String category, String notes) {
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.medicationName = medicationName;
        this.category = category;
        this.notes = notes;
    }

    // Getters and Setters
    public String getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(String prescriptionId) { this.prescriptionId = prescriptionId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public Date getIssueDate() { return issueDate; }
    public void setIssueDate(Date issueDate) { this.issueDate = issueDate; }

    public Long getNextReviewDate() { return nextReviewDate; }
    public void setNextReviewDate(Long nextReviewDate) { this.nextReviewDate = nextReviewDate; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    // NEW: QR code getter and setter
    public String getQrCode() { return qrCode; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }

    // NEW: Medication name getter and setter
    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }
}