package com.tursa.technician.repository;

import com.tursa.technician.model.LabTechnician;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class LabTechnicianRepository {
    private final CollectionReference labTechniciansCollection;

    public LabTechnicianRepository(Firestore firestore) {
        this.labTechniciansCollection = firestore.collection("labTechnicians");
    }

    public LabTechnician save(LabTechnician labTechnician) throws ExecutionException, InterruptedException {
        ApiFuture<WriteResult> result;
        if (labTechnician.getLabTechnicianId() == null) {
            DocumentReference docRef = labTechniciansCollection.document();
            labTechnician.setLabTechnicianId(docRef.getId());
            result = docRef.set(labTechnician);
        } else {
            result = labTechniciansCollection.document(labTechnician.getLabTechnicianId()).set(labTechnician);
        }
        result.get();
        return labTechnician;
    }

    public LabTechnician findById(String id) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = labTechniciansCollection.document(id).get().get();
        return doc.exists() ? doc.toObject(LabTechnician.class) : null;
    }

    public List<LabTechnician> findAll() throws ExecutionException, InterruptedException {
        List<LabTechnician> labTechnicians = new ArrayList<>();
        ApiFuture<QuerySnapshot> query = labTechniciansCollection.get();
        QuerySnapshot querySnapshot = query.get();

        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            labTechnicians.add(document.toObject(LabTechnician.class));
        }
        return labTechnicians;
    }

    public void deleteById(String id) throws ExecutionException, InterruptedException {
        labTechniciansCollection.document(id).delete().get();
    }
}