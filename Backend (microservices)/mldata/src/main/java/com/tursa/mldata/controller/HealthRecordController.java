package com.tursa.mldata.controller;

import com.google.cloud.firestore.FirestoreException;
import com.tursa.mldata.entity.HealthRecord;
import com.tursa.mldata.service.HealthRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/health")
public class HealthRecordController {

    private final HealthRecordService service;

    public HealthRecordController(HealthRecordService service) {
        this.service = service;
    }

    @PostMapping("/record")
    public ResponseEntity<String> addRecord(@RequestBody HealthRecord record, @RequestParam(defaultValue = "demoUser") String userId) {
        try {
            record.setUserId(userId);  // Set userId from param
            String result = service.saveRecord(record);
            return ResponseEntity.ok(result);
        } catch (ExecutionException | InterruptedException | FirestoreException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error saving record: " + e.getMessage());
        }
    }

    // NEW: GET for latest record (supports GET method)
    @GetMapping("/record/latest")
    public ResponseEntity<HealthRecord> getLatestRecord(@RequestParam String userId) {
        try {
            HealthRecord record = service.getLatestRecord(userId);
            if (record != null) {
                return ResponseEntity.ok(record);
            }
            return ResponseEntity.notFound().build();  // 404 if no record
        } catch (ExecutionException | InterruptedException | FirestoreException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
}