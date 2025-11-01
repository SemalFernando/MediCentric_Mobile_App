package com.medbot.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

public class PatientInput {
    @NotNull
    @DecimalMin("29")
    @DecimalMax("77")
    private Double age;  // Required

    @DecimalMin("71")
    @DecimalMax("202")
    private Double thalach;

    @DecimalMin("0")
    @DecimalMax("6.2")
    private Double oldpeak;

    @DecimalMin("90")
    @DecimalMax("200")
    private Double trestbps;

    @DecimalMin("15")
    @DecimalMax("41")
    private Double bmi;

    @DecimalMin("120")
    @DecimalMax("400")
    private Double chol;

    @Min(0)
    @Max(4)
    private Integer ca;

    @Min(3)
    @Max(7)
    private Integer thal;

    @Min(0)
    @Max(2)
    private Integer restecg;

    @Min(1)
    @Max(4)
    private Integer cp;

    // Default constructor
    public PatientInput() {
    }

    // Parameterized constructor (for convenience)
    public PatientInput(Double age, Double thalach, Double oldpeak, Double trestbps, Double bmi, Double chol,
                        Integer ca, Integer thal, Integer restecg, Integer cp) {
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
    }

    // Getters
    public Double getAge() {
        return age;
    }

    public Double getThalach() {
        return thalach;
    }

    public Double getOldpeak() {
        return oldpeak;
    }

    public Double getTrestbps() {
        return trestbps;
    }

    public Double getBmi() {
        return bmi;
    }

    public Double getChol() {
        return chol;
    }

    public Integer getCa() {
        return ca;
    }

    public Integer getThal() {
        return thal;
    }

    public Integer getRestecg() {
        return restecg;
    }

    public Integer getCp() {
        return cp;
    }

    // Setters
    public void setAge(Double age) {
        this.age = age;
    }

    public void setThalach(Double thalach) {
        this.thalach = thalach;
    }

    public void setOldpeak(Double oldpeak) {
        this.oldpeak = oldpeak;
    }

    public void setTrestbps(Double trestbps) {
        this.trestbps = trestbps;
    }

    public void setBmi(Double bmi) {
        this.bmi = bmi;
    }

    public void setChol(Double chol) {
        this.chol = chol;
    }

    public void setCa(Integer ca) {
        this.ca = ca;
    }

    public void setThal(Integer thal) {
        this.thal = thal;
    }

    public void setRestecg(Integer restecg) {
        this.restecg = restecg;
    }

    public void setCp(Integer cp) {
        this.cp = cp;
    }

    // equals, hashCode, toString (for debugging/JSON serialization)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PatientInput that = (PatientInput) o;
        return java.util.Objects.equals(age, that.age) &&
                java.util.Objects.equals(thalach, that.thalach) &&
                java.util.Objects.equals(oldpeak, that.oldpeak) &&
                java.util.Objects.equals(trestbps, that.trestbps) &&
                java.util.Objects.equals(bmi, that.bmi) &&
                java.util.Objects.equals(chol, that.chol) &&
                java.util.Objects.equals(ca, that.ca) &&
                java.util.Objects.equals(thal, that.thal) &&
                java.util.Objects.equals(restecg, that.restecg) &&
                java.util.Objects.equals(cp, that.cp);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(age, thalach, oldpeak, trestbps, bmi, chol, ca, thal, restecg, cp);
    }

    @Override
    public String toString() {
        return "PatientInput{" +
                "age=" + age +
                ", thalach=" + thalach +
                ", oldpeak=" + oldpeak +
                ", trestbps=" + trestbps +
                ", bmi=" + bmi +
                ", chol=" + chol +
                ", ca=" + ca +
                ", thal=" + thal +
                ", restecg=" + restecg +
                ", cp=" + cp +
                '}';
    }
}