package com.tursa.technician.controller;

import com.tursa.technician.model.LabTechnician;
import com.tursa.technician.service.LabTechnicianService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/lab-technicians")
public class LabTechnicianController {
    private final LabTechnicianService labTechnicianService;

    public LabTechnicianController(LabTechnicianService labTechnicianService) {
        this.labTechnicianService = labTechnicianService;
    }

    @PostMapping
    public ResponseEntity<LabTechnician> createLabTechnician(@RequestBody LabTechnician labTechnician) {
        try {
            LabTechnician saved = labTechnicianService.createLabTechnician(labTechnician);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<LabTechnician> getLabTechnician(@PathVariable String id) {
        try {
            LabTechnician labTechnician = labTechnicianService.getLabTechnician(id);
            return ResponseEntity.ok(labTechnician);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<LabTechnician>> getAllLabTechnicians() {
        try {
            List<LabTechnician> labTechnicians = labTechnicianService.getAllLabTechnicians();
            return ResponseEntity.ok(labTechnicians);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<LabTechnician> updateLabTechnician(
            @PathVariable String id,
            @RequestBody LabTechnician labTechnician
    ) {
        try {
            LabTechnician updated = labTechnicianService.updateLabTechnician(id, labTechnician);
            return ResponseEntity.ok(updated);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLabTechnician(@PathVariable String id) {
        try {
            labTechnicianService.deleteLabTechnician(id);
            return ResponseEntity.noContent().build();
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginLabTechnician(@RequestBody LabTechnician loginRequest) {
        try {
            LabTechnician technician = labTechnicianService.loginLabTechnician(loginRequest.getEmail(), loginRequest.getPassword());
            if (technician != null) {
                technician.setPassword(null); // hide password in response
                return ResponseEntity.ok(technician);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
            }
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed: " + e.getMessage());
        }
    }

}