package com.tursa.prescription.service;

import com.tursa.prescription.entity.Prescription;
import com.tursa.prescription.repository.PrescriptionRepository;
import com.google.gson.Gson;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class PrescriptionService {
    private final PrescriptionRepository prescriptionRepository;
    private final QRCodeService qrCodeService; // NEW: QR code service
    private final Gson gson = new Gson();

    public PrescriptionService(PrescriptionRepository prescriptionRepository, QRCodeService qrCodeService) {
        this.prescriptionRepository = prescriptionRepository;
        this.qrCodeService = qrCodeService;
    }

    public Prescription addPrescription(String patientId, Prescription prescription) throws ExecutionException, InterruptedException {
        prescription.setPatientId(patientId);

        // Save prescription first to get the ID
        prescriptionRepository.save(prescription);

        // Generate QR code after prescription is saved and has an ID
        if (prescription.getPrescriptionId() != null) {
            String qrCodeData = qrCodeService.generatePrescriptionQRCode(
                    prescription.getPrescriptionId(),
                    patientId,
                    prescription.getMedicationName()
            );
            prescription.setQrCode(qrCodeData);

            // Update prescription with QR code
            prescriptionRepository.save(prescription);
        }

        return prescription;
    }

    public List<Prescription> getPatientPrescriptions(String patientId) throws ExecutionException, InterruptedException {
        return prescriptionRepository.findByPatientId(patientId);
    }

    public Prescription getPrescription(String id) throws ExecutionException, InterruptedException {
        return prescriptionRepository.findById(id);
    }

    public Prescription updatePrescription(String id, Prescription prescription) throws ExecutionException, InterruptedException {
        Prescription existing = prescriptionRepository.findById(id);
        if (existing != null) {
            prescription.setPrescriptionId(id);
            prescription.setPatientId(existing.getPatientId());
            // Keep the existing QR code when updating
            prescription.setQrCode(existing.getQrCode());
            prescriptionRepository.save(prescription);
        }
        return prescription;
    }

    public void deletePrescription(String id) throws ExecutionException, InterruptedException {
        prescriptionRepository.deleteById(id);
    }

    // NEW: Get prescription by QR code
    public Prescription getPrescriptionByQRCode(String qrCodeData) throws ExecutionException, InterruptedException {
        return prescriptionRepository.findByQRCode(qrCodeData);
    }
}