package com.tursa.lab.repository;

import com.google.cloud.firestore.*;
import com.tursa.lab.entity.LabReport;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class LabReportRepository {
    private final CollectionReference labReportsCollection;

    public LabReportRepository(Firestore firestore) {
        this.labReportsCollection = firestore.collection("labReports");
    }

    public String save(LabReport labReport) throws ExecutionException, InterruptedException {
        // Generate new ID if not present
        if (labReport.getLabReportId() == null) {
            DocumentReference docRef = labReportsCollection.document();
            labReport.setLabReportId(docRef.getId());
        }
        labReportsCollection.document(labReport.getLabReportId()).set(labReport).get();
        return labReport.getLabReportId();
    }

    public List<LabReport> findByPatientId(String patientId) throws ExecutionException, InterruptedException {
        Query query = labReportsCollection.whereEqualTo("patientId", patientId);
        QuerySnapshot querySnapshot = query.get().get();
        List<LabReport> reports = new ArrayList<>();
        for (DocumentSnapshot doc : querySnapshot.getDocuments()) {
            reports.add(doc.toObject(LabReport.class));
        }
        return reports;
    }

    public LabReport findById(String id) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = labReportsCollection.document(id).get().get();
        return doc.exists() ? doc.toObject(LabReport.class) : null;
    }

    public void deleteById(String id) throws ExecutionException, InterruptedException {
        labReportsCollection.document(id).delete().get();
    }
}
