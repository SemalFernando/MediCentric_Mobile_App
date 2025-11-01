package com.tursa.prescription.service;

import com.google.gson.Gson;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class QRCodeService {
    private final Gson gson = new Gson();

    public String generatePrescriptionQRCode(String prescriptionId, String patientId, String medicationName) {
        Map<String, String> qrData = new HashMap<>();
        qrData.put("prescriptionId", prescriptionId);
        qrData.put("patientId", patientId);
        qrData.put("medicationName", medicationName != null ? medicationName : "Unknown Medication");
        qrData.put("type", "prescription");
        qrData.put("timestamp", String.valueOf(System.currentTimeMillis()));

        return gson.toJson(qrData);
    }

    // Optional: Method to parse QR code data
    public Map<String, String> parseQRCode(String qrCodeData) {
        return gson.fromJson(qrCodeData, Map.class);
    }
}