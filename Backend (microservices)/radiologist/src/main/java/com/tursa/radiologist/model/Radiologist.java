package com.tursa.radiologist.model;

import com.google.cloud.firestore.annotation.DocumentId;


public class Radiologist {
    @DocumentId
    private String radiologistId;


    private String fullName;


    private String contactInfo;


    private String licenseNo;


    private String email;


    private String password;

    // Constructors
    public Radiologist() {}

    public Radiologist(String fullName, String contactInfo, String licenseNo, String email, String password) {
        this.fullName = fullName;
        this.contactInfo = contactInfo;
        this.licenseNo = licenseNo;
        this.email = email;
        this.password = password;
    }

    // Getters and Setters
    public String getRadiologistId() { return radiologistId; }
    public void setRadiologistId(String radiologistId) { this.radiologistId = radiologistId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }

    public String getLicenseNo() { return licenseNo; }
    public void setLicenseNo(String licenseNo) { this.licenseNo = licenseNo; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
