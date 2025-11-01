package com.tursa.technician.exception;


public class MedicalStaffNotFoundException extends RuntimeException {
    public MedicalStaffNotFoundException(String message) {
        super(message);
    }
}