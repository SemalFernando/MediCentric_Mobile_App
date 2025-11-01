package com.medbot.controller;

import com.medbot.dto.HealthRecord;
import com.medbot.dto.PredictionResponse;
import com.medbot.service.PredictionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
public class PredictionController {
    private final PredictionService predictionService;
    private final RestTemplate restTemplate;

    @Value("${mldata.url:http://localhost:8089}")  // Configurable mldata base URL
    private String mldataUrl;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
        this.restTemplate = new RestTemplate();
    }

    @GetMapping("/predict")
    public ResponseEntity<PredictionResponse> predict(@RequestParam String patientId) {
        try {
            // Fetch from mldata
            String fetchUrl = mldataUrl + "/health/record/latest?userId=" + patientId;
            ResponseEntity<HealthRecord> response = restTemplate.getForEntity(fetchUrl, HealthRecord.class);
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                return ResponseEntity.notFound().build();
            }

            HealthRecord record = response.getBody();
            PredictionResponse pred = predictionService.predict(record);
            return ResponseEntity.ok(pred);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Healthy");
    }
}