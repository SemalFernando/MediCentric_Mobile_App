package com.tursa.radiologist.repository;


import com.tursa.radiologist.model.Radiologist;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class RadiologistRepository {
    private final CollectionReference radiologistsCollection;

    public RadiologistRepository(Firestore firestore) {
        this.radiologistsCollection = firestore.collection("radiologists");
    }

    public Radiologist save(Radiologist radiologist) throws ExecutionException, InterruptedException {
        ApiFuture<WriteResult> result;
        if (radiologist.getRadiologistId() == null) {
            DocumentReference docRef = radiologistsCollection.document();
            radiologist.setRadiologistId(docRef.getId());
            result = docRef.set(radiologist);
        } else {
            result = radiologistsCollection.document(radiologist.getRadiologistId()).set(radiologist);
        }
        result.get();
        return radiologist;
    }

    public Radiologist findById(String id) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = radiologistsCollection.document(id).get().get();
        return doc.exists() ? doc.toObject(Radiologist.class) : null;
    }

    public List<Radiologist> findAll() throws ExecutionException, InterruptedException {
        List<Radiologist> radiologists = new ArrayList<>();
        ApiFuture<QuerySnapshot> query = radiologistsCollection.get();
        QuerySnapshot querySnapshot = query.get();

        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            radiologists.add(document.toObject(Radiologist.class));
        }
        return radiologists;
    }

    public void deleteById(String id) throws ExecutionException, InterruptedException {
        radiologistsCollection.document(id).delete().get();
    }
}