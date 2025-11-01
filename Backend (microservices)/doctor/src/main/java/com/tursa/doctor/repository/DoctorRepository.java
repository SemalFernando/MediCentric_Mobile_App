package com.tursa.doctor.repository;

import com.tursa.doctor.entity.Doctor;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class DoctorRepository {
    private final CollectionReference doctorsCollection;

    public DoctorRepository(Firestore firestore) {
        this.doctorsCollection = firestore.collection("doctors");
    }

    public Doctor save(Doctor doctor) throws ExecutionException, InterruptedException {
        ApiFuture<WriteResult> result;
        if (doctor.getDoctorId() == null) {
            DocumentReference docRef = doctorsCollection.document();
            doctor.setDoctorId(docRef.getId());
            result = docRef.set(doctor);
        } else {
            result = doctorsCollection.document(doctor.getDoctorId()).set(doctor);
        }
        result.get();
        return doctor;
    }

    public Doctor findById(String id) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = doctorsCollection.document(id).get().get();
        return doc.exists() ? doc.toObject(Doctor.class) : null;
    }

    public List<Doctor> findAll() throws ExecutionException, InterruptedException {
        List<Doctor> doctors = new ArrayList<>();
        ApiFuture<QuerySnapshot> query = doctorsCollection.get();
        QuerySnapshot querySnapshot = query.get();

        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            doctors.add(document.toObject(Doctor.class));
        }
        return doctors;
    }

    public void deleteById(String id) throws ExecutionException, InterruptedException {
        doctorsCollection.document(id).delete().get();
    }

    public List<Doctor> findByEmail(String email) throws ExecutionException, InterruptedException {
        List<Doctor> matchedDoctors = new ArrayList<>();
        ApiFuture<QuerySnapshot> query = doctorsCollection.whereEqualTo("email", email).get();
        QuerySnapshot querySnapshot = query.get();

        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            matchedDoctors.add(document.toObject(Doctor.class));
        }
        return matchedDoctors;
    }

}