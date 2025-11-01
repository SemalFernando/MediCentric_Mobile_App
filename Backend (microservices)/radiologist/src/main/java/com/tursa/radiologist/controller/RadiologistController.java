package com.tursa.radiologist.controller;

import com.tursa.radiologist.model.Radiologist;
import com.tursa.radiologist.service.RadiologistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/radiologists")
public class RadiologistController {
    private final RadiologistService radiologistService;

    public RadiologistController(RadiologistService radiologistService) {
        this.radiologistService = radiologistService;
    }

    @PostMapping
    public ResponseEntity<Radiologist> createRadiologist(@RequestBody Radiologist radiologist) {
        try {
            Radiologist saved = radiologistService.createRadiologist(radiologist);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Radiologist> getRadiologist(@PathVariable String id) {
        try {
            Radiologist radiologist = radiologistService.getRadiologist(id);
            return ResponseEntity.ok(radiologist);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Radiologist>> getAllRadiologists() {
        try {
            List<Radiologist> radiologists = radiologistService.getAllRadiologists();
            return ResponseEntity.ok(radiologists);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Radiologist> updateRadiologist(
            @PathVariable String id,
            @RequestBody Radiologist radiologist
    ) {
        try {
            Radiologist updated = radiologistService.updateRadiologist(id, radiologist);
            return ResponseEntity.ok(updated);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRadiologist(@PathVariable String id) {
        try {
            radiologistService.deleteRadiologist(id);
            return ResponseEntity.noContent().build();
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginRadiologist(@RequestBody Radiologist loginRequest) {
        try {
            Radiologist radiologist = radiologistService.loginRadiologist(
                    loginRequest.getEmail(), loginRequest.getPassword()
            );
            if (radiologist != null) {
                radiologist.setPassword(null); // hide password in response
                return ResponseEntity.ok(radiologist);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
            }
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed: " + e.getMessage());
        }
    }
}