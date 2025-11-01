package com.tursa.allergy.repository;

import com.google.cloud.firestore.*;
import com.tursa.allergy.entity.Allergy;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class AllergyRepository {
    private final CollectionReference allergiesCollection;

    public AllergyRepository(Firestore firestore) {
        this.allergiesCollection = firestore.collection("allergies");
    }

    public String save(Allergy allergy) throws ExecutionException, InterruptedException {
        if (allergy.getAllergyId() == null) {
            DocumentReference docRef = allergiesCollection.document();
            allergy.setAllergyId(docRef.getId());
        }
        allergiesCollection.document(allergy.getAllergyId()).set(allergy).get();
        return allergy.getAllergyId();
    }

    public List<Allergy> findByPatientId(String patientId) throws ExecutionException, InterruptedException {
        Query query = allergiesCollection.whereEqualTo("patientId", patientId);
        QuerySnapshot querySnapshot = query.get().get();
        return querySnapshot.toObjects(Allergy.class);
    }

    public Allergy findById(String id) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = allergiesCollection.document(id).get().get();
        return doc.exists() ? doc.toObject(Allergy.class) : null;
    }

    public void deleteById(String id) throws ExecutionException, InterruptedException {
        allergiesCollection.document(id).delete().get();
    }
}

