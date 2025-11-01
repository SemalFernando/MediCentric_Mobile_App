package com.tursa.allergy.controller;

import com.tursa.allergy.entity.Allergy;
import com.tursa.allergy.service.AllergyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patients/{patientId}/allergies")
public class AllergyController {
    private final AllergyService allergyService;

    public AllergyController(AllergyService allergyService) {
        this.allergyService = allergyService;
    }

    @PostMapping
    public ResponseEntity<Allergy> addAllergy(@PathVariable String patientId, @RequestBody Allergy allergy) {
        try {
            Allergy saved = allergyService.addAllergy(patientId, allergy);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Allergy>> getPatientAllergies(@PathVariable String patientId) {
        try {
            List<Allergy> allergies = allergyService.getPatientAllergies(patientId);
            return ResponseEntity.ok(allergies);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
