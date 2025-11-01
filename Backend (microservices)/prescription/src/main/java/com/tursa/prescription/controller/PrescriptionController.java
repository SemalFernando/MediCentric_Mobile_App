package com.tursa.prescription.controller;

import com.tursa.prescription.entity.Prescription;
import com.tursa.prescription.service.PrescriptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/patients/{patientId}/prescriptions")
public class PrescriptionController {
    private final PrescriptionService prescriptionService;

    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @PostMapping
    public ResponseEntity<Prescription> addPrescription(@PathVariable String patientId, @RequestBody Prescription prescription) {
        try {
            Prescription saved = prescriptionService.addPrescription(patientId, prescription);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Prescription>> getPatientPrescriptions(@PathVariable String patientId) {
        try {
            List<Prescription> prescriptions = prescriptionService.getPatientPrescriptions(patientId);
            return ResponseEntity.ok(prescriptions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // NEW: Get prescription by ID
    @GetMapping("/{prescriptionId}")
    public ResponseEntity<Prescription> getPrescription(@PathVariable String patientId, @PathVariable String prescriptionId) {
        try {
            Prescription prescription = prescriptionService.getPrescription(prescriptionId);
            if (prescription != null && prescription.getPatientId().equals(patientId)) {
                return ResponseEntity.ok(prescription);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // NEW: Get prescription by QR code
    @GetMapping("/qr/{qrCodeData}")
    public ResponseEntity<Prescription> getPrescriptionByQRCode(@PathVariable String qrCodeData) {
        try {
            Prescription prescription = prescriptionService.getPrescriptionByQRCode(qrCodeData);
            if (prescription != null) {
                return ResponseEntity.ok(prescription);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}