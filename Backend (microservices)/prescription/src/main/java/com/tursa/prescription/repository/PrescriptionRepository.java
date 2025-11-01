package com.tursa.prescription.repository;

import com.google.cloud.firestore.*;
import com.tursa.prescription.entity.Prescription;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class PrescriptionRepository {
    private final CollectionReference prescriptionsCollection;

    public PrescriptionRepository(Firestore firestore) {
        this.prescriptionsCollection = firestore.collection("prescriptions");
    }

    public String save(Prescription prescription) throws ExecutionException, InterruptedException {
        if (prescription.getPrescriptionId() == null) {
            DocumentReference docRef = prescriptionsCollection.document();
            prescription.setPrescriptionId(docRef.getId());
        }
        prescriptionsCollection.document(prescription.getPrescriptionId()).set(prescription).get();
        return prescription.getPrescriptionId();
    }

    public List<Prescription> findByPatientId(String patientId) throws ExecutionException, InterruptedException {
        Query query = prescriptionsCollection.whereEqualTo("patientId", patientId);
        QuerySnapshot querySnapshot = query.get().get();
        return querySnapshot.toObjects(Prescription.class);
    }

    public Prescription findById(String id) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = prescriptionsCollection.document(id).get().get();
        return doc.exists() ? doc.toObject(Prescription.class) : null;
    }

    public void deleteById(String id) throws ExecutionException, InterruptedException {
        prescriptionsCollection.document(id).delete().get();
    }

    // NEW: Find prescription by QR code
    public Prescription findByQRCode(String qrCode) throws ExecutionException, InterruptedException {
        Query query = prescriptionsCollection.whereEqualTo("qrCode", qrCode);
        QuerySnapshot querySnapshot = query.get().get();

        if (!querySnapshot.isEmpty()) {
            DocumentSnapshot doc = querySnapshot.getDocuments().get(0);
            return doc.toObject(Prescription.class);
        }
        return null;
    }
}