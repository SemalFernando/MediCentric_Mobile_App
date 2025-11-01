package com.tursa.mldata.entity;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.annotation.ServerTimestamp;

public class HealthRecord {

    private Double age;
    private Double thalach;
    private Double oldpeak;
    private Double trestbps;
    private Double bmi;
    private Double chol;
    private Integer ca;
    private Integer thal;
    private Integer restecg;
    private Integer cp;
    private String userId;  // NEW: For filtering

    // NEW: Auto-set by Firestore on save
    @ServerTimestamp
    private Timestamp timestamp;  // Changed type

    // Constructors (update to exclude timestamp)
    public HealthRecord() {}

    public HealthRecord(Double age, Double thalach, Double oldpeak, Double trestbps,
                        Double bmi, Double chol, Integer ca, Integer thal,
                        Integer restecg, Integer cp, String userId) {
        this.age = age;
        this.thalach = thalach;
        this.oldpeak = oldpeak;
        this.trestbps = trestbps;
        this.bmi = bmi;
        this.chol = chol;
        this.ca = ca;
        this.thal = thal;
        this.restecg = restecg;
        this.cp = cp;
        this.userId = userId;
        // Timestamp auto-set by @ServerTimestamp—no manual set
    }

    // Getters and setters (existing + new)
    public Double getAge() { return age; }
    public void setAge(Double age) { this.age = age; }
    public Double getThalach() { return thalach; }
    public void setThalach(Double thalach) { this.thalach = thalach; }
    public Double getOldpeak() { return oldpeak; }
    public void setOldpeak(Double oldpeak) { this.oldpeak = oldpeak; }
    public Double getTrestbps() { return trestbps; }
    public void setTrestbps(Double trestbps) { this.trestbps = trestbps; }
    public Double getBmi() { return bmi; }
    public void setBmi(Double bmi) { this.bmi = bmi; }
    public Double getChol() { return chol; }
    public void setChol(Double chol) { this.chol = chol; }
    public Integer getCa() { return ca; }
    public void setCa(Integer ca) { this.ca = ca; }
    public Integer getThal() { return thal; }
    public void setThal(Integer thal) { this.thal = thal; }
    public Integer getRestecg() { return restecg; }
    public void setRestecg(Integer restecg) { this.restecg = restecg; }
    public Integer getCp() { return cp; }
    public void setCp(Integer cp) { this.cp = cp; }
    // NEW
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Timestamp getTimestamp() { return timestamp; }
    public void setTimestamp(Timestamp timestamp) { this.timestamp = timestamp; }
}