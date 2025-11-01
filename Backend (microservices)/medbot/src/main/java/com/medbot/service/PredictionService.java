package com.medbot.service;

import com.medbot.dto.HealthRecord;
import com.medbot.dto.PredictionResponse;
import ml.dmlc.xgboost4j.java.Booster;
import ml.dmlc.xgboost4j.java.DMatrix;
import ml.dmlc.xgboost4j.java.XGBoost;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@Service
public class PredictionService {
    private Booster model;
    private double[] scalerMeans;
    private double[] scalerStds;

    @PostConstruct
    public void init() throws Exception {
        try (InputStream modelStream = getClass().getResourceAsStream("/model.json")) {
            if (modelStream == null) {
                throw new IllegalArgumentException("model.json not found in resources");
            }
            this.model = XGBoost.loadModel(modelStream);
        }

        scalerMeans = new double[]{
                53.561934411571166, 133.42083179822853, 3.290263101026517, 145.87632758466876,
                27.59021092690132, 315.6976306565412
        };
        scalerStds = new double[]{
                12.522074324666445, 38.252686702130454, 1.6037072754870243, 29.156524438809672,
                6.605567052183025, 92.58089559773687
        };
    }

    public PredictionResponse predict(HealthRecord record) {
        if (record == null) {
            throw new IllegalArgumentException("No health record provided");
        }

        Map<String, Object> data = new HashMap<>();
        data.put("age", record.getAge() != null ? record.getAge() : scalerMeans[0]);
        data.put("thalach", record.getThalach() != null ? record.getThalach() : scalerMeans[1]);
        data.put("oldpeak", record.getOldpeak() != null ? record.getOldpeak() : scalerMeans[2]);
        data.put("trestbps", record.getTrestbps() != null ? record.getTrestbps() : scalerMeans[3]);
        data.put("bmi", record.getBmi() != null ? record.getBmi() : scalerMeans[4]);
        data.put("chol", record.getChol() != null ? record.getChol() : scalerMeans[5]);

        double[][] clips = {{35.0, 70.0}, {90.0, 180.0}, {0.0, 4.0}, {110.0, 160.0}, {20.0, 35.0}, {150.0, 300.0}};
        String[] numNames = {"age", "thalach", "oldpeak", "trestbps", "bmi", "chol"};
        for (int i = 0; i < numNames.length; i++) {
            double val = (Double) data.get(numNames[i]);
            val = Math.max(clips[i][0], Math.min(clips[i][1], val));
            data.put(numNames[i], val);
        }

        float[] features = new float[10];
        for (int i = 0; i < 6; i++) {
            double val = (Double) data.get(numNames[i]);
            features[i] = (float) ((val - scalerMeans[i]) / scalerStds[i]);
        }
        features[6] = record.getCa() != null ? record.getCa().floatValue() : 0f;
        features[7] = record.getThal() != null ? record.getThal().floatValue() : 3f;
        features[8] = record.getRestecg() != null ? record.getRestecg().floatValue() : 0f;
        features[9] = record.getCp() != null ? record.getCp().floatValue() : 2f;

        try {
            DMatrix dmatrix = new DMatrix(features, 1, features.length, Float.NaN);
            float[][] prediction = model.predict(dmatrix);
            double proba = prediction[0][0];  // Binary: [0][0] for positive class
            int risk = (proba > 0.5) ? 1 : 0;

            String explanation = generateExplanation(risk, record);

            return new PredictionResponse(risk, proba, explanation);
        } catch (Exception e) {
            throw new RuntimeException("Prediction failed: " + e.getMessage(), e);
        }
    }

    private String generateExplanation(int risk, HealthRecord record) {
        StringBuilder sb = new StringBuilder(risk == 1 ? "High" : "Low");
        sb.append(" risk of heart disease. Key factors: ");

        if (risk == 1) {
            // High risk: Highlight 2-3 top risks from data
            String[] risks = new String[0];
            if (record.getAge() != null && record.getAge() > 60) {
                risks = append(risks, "Advanced age (" + record.getAge() + ")");
            }
            if (record.getOldpeak() != null && record.getOldpeak() > 2.0) {
                risks = append(risks, "Elevated ST depression (" + record.getOldpeak() + ")");
            }
            if (record.getThalach() != null && record.getThalach() < 120) {
                risks = append(risks, "Low max heart rate (" + record.getThalach() + " bpm)");
            }
            if (record.getTrestbps() != null && record.getTrestbps() > 160) {
                risks = append(risks, "High resting BP (" + record.getTrestbps() + " mmHg)");
            }
            if (record.getChol() != null && record.getChol() > 300) {
                risks = append(risks, "High cholesterol (" + record.getChol() + " mg/dl)");
            }
            if (record.getCa() != null && record.getCa() > 1) {
                risks = append(risks, record.getCa() + " major vessels colored");
            }
            sb.append(String.join(", ", risks.length > 0 ? risks : new String[]{"General health indicators"}));
        } else {
            // Low risk: Highlight positives
            String[] positives = new String[0];
            if (record.getThalach() != null && record.getThalach() > 150) {
                positives = append(positives, "Good max heart rate (" + record.getThalach() + " bpm)");
            }
            if (record.getOldpeak() != null && record.getOldpeak() < 1.0) {
                positives = append(positives, "Minimal ST depression (" + record.getOldpeak() + ")");
            }
            if (record.getBmi() != null && record.getBmi() < 25) {
                positives = append(positives, "Healthy BMI (" + record.getBmi() + ")");
            }
            if (record.getChol() != null && record.getChol() < 200) {
                positives = append(positives, "Low cholesterol (" + record.getChol() + " mg/dl)");
            }
            if (record.getCa() != null && record.getCa() == 0) {
                positives = append(positives, "No major vessels affected");
            }
            sb.append(String.join(", ", positives.length > 0 ? positives : new String[]{"Overall healthy profile"}));
        }
        return sb.toString() + ".";
    }

    // Helper to append to array (Java doesn't have dynamic arrays easily)
    private String[] append(String[] arr, String item) {
        String[] newArr = new String[arr.length + 1];
        System.arraycopy(arr, 0, newArr, 0, arr.length);
        newArr[arr.length] = item;
        return newArr;
    }
}