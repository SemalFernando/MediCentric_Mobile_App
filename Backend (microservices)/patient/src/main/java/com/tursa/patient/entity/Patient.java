package com.tursa.patient.entity;

import java.util.Date;

public class Patient {

    private String patientId;
    private String fullName;
    private String gender;
    private Date dob;
    private String contactInfo;
    private String bloodType;
    private String address;
    private String patientNic;
    private String qrCode;
    private String accessKey;
    private Date expirationDate;
    private String qrCodeImage;
    private String status;

    // Add email and password fields
    private String email;
    private String password;

    // Constructors
    public Patient() {
    }

    public Patient(String fullName, String gender, Date dob, String contactInfo,
                   String bloodType, String address, String patientNic) {
        this.fullName = fullName;
        this.gender = gender;
        this.dob = dob;
        this.contactInfo = contactInfo;
        this.bloodType = bloodType;
        this.address = address;
        this.patientNic = patientNic;
        this.status = "ACTIVE";
    }

    // Getters and Setters
    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public String getBloodType() {
        return bloodType;
    }

    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPatientNic() {
        return patientNic;
    }

    public void setPatientNic(String patientNic) {
        this.patientNic = patientNic;
    }

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }

    public String getAccessKey() {
        return accessKey;
    }

    public void setAccessKey(String accessKey) {
        this.accessKey = accessKey;
    }

    public Date getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(Date expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getQrCodeImage() {
        return qrCodeImage;
    }

    public void setQrCodeImage(String qrCodeImage) {
        this.qrCodeImage = qrCodeImage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
