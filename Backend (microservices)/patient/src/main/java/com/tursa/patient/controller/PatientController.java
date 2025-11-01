package com.tursa.patient.controller;

import com.tursa.patient.entity.Patient;
import com.tursa.patient.entity.PatientRegistrationDTO;
import com.tursa.patient.service.PatientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping
    public ResponseEntity<Patient> registerPatient(@RequestBody PatientRegistrationDTO dto) {
        try {
            Patient patient = patientService.registerPatient(dto);
            return ResponseEntity.ok(patient);
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace(); // Log the error for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatient(@PathVariable String id) {
        try {
            Patient patient = patientService.getPatient(id);
            if (patient != null) {
                return ResponseEntity.ok(patient);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable String id, @RequestBody PatientRegistrationDTO dto) {
        try {
            Patient updated = patientService.updatePatient(id, dto);
            if (updated != null) {
                return ResponseEntity.ok(updated);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable String id) {
        try {
            patientService.deletePatient(id);
            return ResponseEntity.noContent().build();
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/model-info")
    public ResponseEntity<Map<String, String>> getModelInfo() {
        Map<String, String> info = new HashMap<>();
        info.put("modelName", "Heart Disease Prediction Model");
        info.put("version", "1.0");
        info.put("accuracy", "85%");
        info.put("lastTrained", "2024-01-01");
        return ResponseEntity.ok(info);
    }

    @PostMapping("/train")
    public ResponseEntity<Map<String, String>> trainModel() {
        Map<String, String> result = new HashMap<>();
        result.put("status", "Training initiated");
        result.put("estimatedTime", "30 minutes");
        return ResponseEntity.ok(result);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody PatientRegistrationDTO dto) {
        try {
            Patient patient = patientService.login(dto.getEmail(), dto.getPassword());
            if (patient != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("patientId", patient.getPatientId());
                response.put("email", patient.getEmail());
                response.put("fullName", patient.getFullName());
                response.put("message", "Login successful");
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Invalid email or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error during login: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // UPDATED: Changed to POST method with request body for QR code scanning
    @PostMapping("/qr")
    public ResponseEntity<Patient> getPatientByQRCode(@RequestBody Map<String, String> request) {
        try {
            String qrCodeData = request.get("qrCodeData");
            System.out.println("Received QR code data: " + qrCodeData);

            if (qrCodeData == null || qrCodeData.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }

            Patient patient = patientService.getPatientByQRCode(qrCodeData);
            if (patient != null) {
                System.out.println("Patient found: " + patient.getFullName());
                return ResponseEntity.ok(patient);
            } else {
                System.out.println("Patient not found for QR code");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // UPDATED: Changed to POST method with request body for minimal QR code scanning
    @PostMapping("/qr-minimal")
    public ResponseEntity<Map<String, Object>> getMinimalPatientInfoByQRCode(@RequestBody Map<String, String> request) {
        try {
            String qrCodeData = request.get("qrCodeData");
            System.out.println("Received minimal QR code data: " + qrCodeData);

            if (qrCodeData == null || qrCodeData.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }

            Patient patient = patientService.getPatientByQRCode(qrCodeData);
            if (patient != null) {
                Map<String, Object> minimalInfo = new HashMap<>();
                minimalInfo.put("patientId", patient.getPatientId());
                minimalInfo.put("fullName", patient.getFullName());
                minimalInfo.put("bloodType", patient.getBloodType());
                minimalInfo.put("emergencyContact", patient.getContactInfo());
                minimalInfo.put("status", "VALID");

                System.out.println("Minimal patient info found: " + patient.getFullName());
                return ResponseEntity.ok(minimalInfo);
            } else {
                System.out.println("Patient not found for minimal QR code");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // KEEP the existing GET endpoints for backward compatibility (optional)
    @GetMapping("/qr/{qrCodeData}")
    public ResponseEntity<Patient> getPatientByQRCodeGet(@PathVariable String qrCodeData) {
        try {
            Patient patient = patientService.getPatientByQRCode(qrCodeData);
            if (patient != null) {
                return ResponseEntity.ok(patient);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/qr-minimal/{qrCodeData}")
    public ResponseEntity<Map<String, Object>> getMinimalPatientInfoByQRCodeGet(@PathVariable String qrCodeData) {
        try {
            Patient patient = patientService.getPatientByQRCode(qrCodeData);
            if (patient != null) {
                Map<String, Object> minimalInfo = new HashMap<>();
                minimalInfo.put("patientId", patient.getPatientId());
                minimalInfo.put("fullName", patient.getFullName());
                minimalInfo.put("bloodType", patient.getBloodType());
                minimalInfo.put("emergencyContact", patient.getContactInfo());
                minimalInfo.put("status", "VALID");

                return ResponseEntity.ok(minimalInfo);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}