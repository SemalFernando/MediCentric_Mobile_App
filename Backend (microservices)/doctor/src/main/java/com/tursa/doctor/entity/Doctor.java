package com.tursa.doctor.entity;

import com.google.cloud.firestore.annotation.DocumentId;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class Doctor {

    @DocumentId
    private String doctorId;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "License number is required")
    @Pattern(regexp = "^[A-Za-z0-9-]+$", message = "Invalid license number format")
    private String licenseNo;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    public Doctor() {}

    public Doctor(String fullName, String email, String password, String licenseNo, String specialization) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.licenseNo = licenseNo;
        this.specialization = specialization;
    }

    // Getters and setters
    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getLicenseNo() { return licenseNo; }
    public void setLicenseNo(String licenseNo) { this.licenseNo = licenseNo; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
}
