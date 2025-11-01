package com.medbot.dto;

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

    // Constructors
    public HealthRecord() {}

    // Getters/Setters
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
}