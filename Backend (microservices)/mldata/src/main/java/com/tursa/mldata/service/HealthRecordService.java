package com.tursa.mldata.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.tursa.mldata.entity.HealthRecord;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ExecutionException;

@Service
public class HealthRecordService {

    private final Firestore firestore;

    public HealthRecordService(Firestore firestore) {
        this.firestore = firestore;
    }

    public String saveRecord(HealthRecord record) throws ExecutionException, InterruptedException {
        // No manual timestamp—@ServerTimestamp auto-sets
        DocumentReference docRef = firestore.collection("health_records").document();
        ApiFuture<WriteResult> future = docRef.set(record);
        return "Record saved at: " + future.get().getUpdateTime();
    }

    //retrive data for the ml model
    public HealthRecord getLatestRecord(String userId) throws ExecutionException, InterruptedException {
        Query query = firestore.collection("health_records")
                .whereEqualTo("userId", userId)
                .orderBy("timestamp", Query.Direction.DESCENDING)
                .limit(1);

        ApiFuture<QuerySnapshot> future = query.get();
        QuerySnapshot snapshot = future.get();  // Block and get snapshot

        if (!snapshot.isEmpty()) {
            QueryDocumentSnapshot document = snapshot.getDocuments().get(0);  // First (latest) document
            return document.toObject(HealthRecord.class);
        }
        return null;  // No record found
    }

}

