package com.tursa.prescription.controller;

import com.tursa.prescription.entity.Prescription;
import com.tursa.prescription.service.PrescriptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/prescriptions")
public class PrescriptionManagementController {
    private final PrescriptionService prescriptionService;

    public PrescriptionManagementController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescription(@PathVariable String id) {
        try {
            Prescription prescription = prescriptionService.getPrescription(id);
            return prescription != null ? ResponseEntity.ok(prescription) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prescription> updatePrescription(@PathVariable String id, @RequestBody Prescription prescription) {
        try {
            Prescription updated = prescriptionService.updatePrescription(id, prescription);
            return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable String id) {
        try {
            prescriptionService.deletePrescription(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
