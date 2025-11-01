package com.tursa.scan.repository;

import com.google.cloud.firestore.*;
import com.tursa.scan.entity.ScanReport;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class ScanReportRepository {
    private final CollectionReference scanReportsCollection;

    public ScanReportRepository(Firestore firestore) {
        this.scanReportsCollection = firestore.collection("scanReports");
    }

    public String save(ScanReport scanReport) throws ExecutionException, InterruptedException {
        if (scanReport.getScanId() == null) {
            DocumentReference docRef = scanReportsCollection.document();
            scanReport.setScanId(docRef.getId());
        }
        scanReportsCollection.document(scanReport.getScanId()).set(scanReport).get();
        return scanReport.getScanId();
    }

    public List<ScanReport> findByPatientId(String patientId) throws ExecutionException, InterruptedException {
        Query query = scanReportsCollection.whereEqualTo("patientId", patientId);
        QuerySnapshot querySnapshot = query.get().get();
        List<ScanReport> reports = new ArrayList<>();
        for (DocumentSnapshot doc : querySnapshot.getDocuments()) {
            reports.add(doc.toObject(ScanReport.class));
        }
        return reports;
    }

    public ScanReport findById(String id) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = scanReportsCollection.document(id).get().get();
        return doc.exists() ? doc.toObject(ScanReport.class) : null;
    }

    public void deleteById(String id) throws ExecutionException, InterruptedException {
        scanReportsCollection.document(id).delete().get();
    }
}
