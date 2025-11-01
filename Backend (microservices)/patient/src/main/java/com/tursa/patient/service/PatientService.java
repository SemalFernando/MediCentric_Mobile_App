package com.tursa.patient.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.gson.Gson;
import com.tursa.patient.entity.Patient;
import com.tursa.patient.entity.PatientRegistrationDTO;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@Service
public class PatientService {

    private final Firestore firestore;
    private final QRCodeService qrCodeService;
    private final Gson gson = new Gson(); // Add Gson instance

    public PatientService(Firestore firestore, QRCodeService qrCodeService) {
        this.firestore = firestore;
        this.qrCodeService = qrCodeService;
    }

    public Patient registerPatient(PatientRegistrationDTO dto) throws ExecutionException, InterruptedException {
        // Check if email already exists
        Query query = firestore.collection("patients")
                .whereEqualTo("email", dto.getEmail())
                .limit(1);

        QuerySnapshot querySnapshot = query.get().get();

        if (!querySnapshot.isEmpty()) {
            throw new IllegalArgumentException("Email already exists");
        }

        Patient patient = new Patient(
                dto.getFullName(),
                dto.getGender(),
                dto.getDob(),
                dto.getContactInfo(),
                dto.getBloodType(),
                dto.getAddress(),
                dto.getPatientNic()
        );

        // Save email and password for login
        patient.setEmail(dto.getEmail());
        patient.setPassword(dto.getPassword());

        // Generate access key
        patient.setAccessKey(generateAccessKey());
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.YEAR, 1);
        patient.setExpirationDate(cal.getTime());

        // Save patient to Firestore first to get the ID
        DocumentReference docRef = firestore.collection("patients").document();
        String patientId = docRef.getId();
        patient.setPatientId(patientId);

        // Generate QR code with the patient ID and access key
        String qrCodeData = qrCodeService.generateQRCode(patientId, patient.getAccessKey());
        patient.setQrCode(qrCodeData);

        // Set status
        patient.setStatus("ACTIVE");

        // Save the complete patient record with QR code
        docRef.set(patient).get();

        return patient;
    }

    public Patient getPatient(String id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection("patients").document(id);
        DocumentSnapshot snapshot = docRef.get().get();
        if (snapshot.exists()) {
            return snapshot.toObject(Patient.class);
        }
        return null;
    }

    public Patient updatePatient(String id, PatientRegistrationDTO dto) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection("patients").document(id);
        DocumentSnapshot snapshot = docRef.get().get();

        if (snapshot.exists()) {
            Patient patient = snapshot.toObject(Patient.class);
            if (patient != null) {
                patient.setFullName(dto.getFullName());
                patient.setGender(dto.getGender());
                patient.setDob(dto.getDob());
                patient.setContactInfo(dto.getContactInfo());
                patient.setBloodType(dto.getBloodType());
                patient.setAddress(dto.getAddress());
                // Update email and password as well
                patient.setEmail(dto.getEmail());
                patient.setPassword(dto.getPassword());

                docRef.set(patient).get();
                return patient;
            }
        }
        return null;
    }

    public void deletePatient(String id) throws ExecutionException, InterruptedException {
        firestore.collection("patients").document(id).delete().get();
    }

    private String generateAccessKey() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
    }

    public Patient login(String email, String password) throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future =
                firestore.collection("patients")
                        .whereEqualTo("email", email)
                        .get();

        QuerySnapshot querySnapshot = future.get();

        if (!querySnapshot.isEmpty()) {
            DocumentSnapshot doc = querySnapshot.getDocuments().get(0);
            Patient patient = doc.toObject(Patient.class);
            if (patient != null && password.equals(patient.getPassword())) {
                return patient; // Return the patient object if login successful
            }
        }

        return null; // Return null if login fails
    }

    // New method to get patient by QR code data
    public Patient getPatientByQRCode(String qrCodeData) throws ExecutionException, InterruptedException {
        try {
            System.out.println("Processing QR code data: " + qrCodeData);

            // Parse the QR code data to extract patientId
            Map<String, Object> qrData = gson.fromJson(qrCodeData, Map.class);
            String patientId = (String) qrData.get("patientId");

            System.out.println("Extracted patientId: " + patientId);

            if (patientId != null && !patientId.isEmpty()) {
                Patient patient = getPatient(patientId);
                System.out.println("Found patient: " + (patient != null ? patient.getFullName() : "null"));
                return patient;
            } else {
                System.out.println("No patientId found in QR code data");
                return null;
            }
        } catch (Exception e) {
            System.err.println("Error parsing QR code data: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}