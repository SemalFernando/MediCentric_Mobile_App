package com.tursa.patient.repository;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.tursa.patient.entity.Patient;
import org.springframework.stereotype.Repository;

import java.util.concurrent.ExecutionException;

@Repository
public class PatientRepository {
    private final Firestore firestore;
    private final CollectionReference patientsCollection;

    public PatientRepository(Firestore firestore) {
        this.firestore = firestore;
        this.patientsCollection = firestore.collection("patients");
    }

    public String save(Patient patient) throws ExecutionException, InterruptedException {
        if (patient.getPatientId() == null) {
            DocumentReference docRef = patientsCollection.document();
            patient.setPatientId(docRef.getId());
        }
        patientsCollection.document(patient.getPatientId()).set(patient).get();
        return patient.getPatientId();
    }

    public Patient findById(String id) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = patientsCollection.document(id).get().get();
        if (doc.exists()) {
            return doc.toObject(Patient.class);
        }
        return null;
    }

    public void deleteById(String id) throws ExecutionException, InterruptedException {
        patientsCollection.document(id).delete().get();
    }
}
