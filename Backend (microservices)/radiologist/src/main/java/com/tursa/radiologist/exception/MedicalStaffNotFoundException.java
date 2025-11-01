package com.tursa.radiologist.exception;

public class MedicalStaffNotFoundException extends RuntimeException {
    public MedicalStaffNotFoundException(String message) {
        super(message);
    }
}