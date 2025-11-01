package com.tursa.patient.service;

import org.springframework.stereotype.Service;
import com.google.gson.Gson;
import java.util.HashMap;
import java.util.Map;

@Service
public class QRCodeService {
    private final Gson gson = new Gson();

    public String generateQRCode(String patientId, String accessKey) {
        // Create a structured JSON object for QR code content
        Map<String, String> qrData = new HashMap<>();
        qrData.put("patientId", patientId);
        qrData.put("accessKey", accessKey);
        qrData.put("type", "medical_id");
        qrData.put("timestamp", String.valueOf(System.currentTimeMillis()));

        return gson.toJson(qrData);
    }

    // Optional: Method to parse QR code data
    public Map<String, String> parseQRCode(String qrCodeData) {
        return gson.fromJson(qrCodeData, Map.class);
    }
}