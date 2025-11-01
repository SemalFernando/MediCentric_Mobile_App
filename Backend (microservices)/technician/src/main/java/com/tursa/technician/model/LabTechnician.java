package com.tursa.technician.model;

import com.google.cloud.firestore.annotation.DocumentId;


public class LabTechnician {
    @DocumentId
    private String labTechnicianId;


    private String fullName;

    private String contactInfo;



    private String email;

    private String password;

    // Constructors
    public LabTechnician() {}

    public LabTechnician(String fullName, String contactInfo, String email, String password) {
        this.fullName = fullName;
        this.contactInfo = contactInfo;
        this.email = email;
        this.password = password;
    }

    // Getters and Setters
    public String getLabTechnicianId() { return labTechnicianId; }
    public void setLabTechnicianId(String labTechnicianId) { this.labTechnicianId = labTechnicianId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
