package com.medbot.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PredictionResponse {
    @JsonProperty("risk")
    private Integer risk;  // 0 or 1

    @JsonProperty("probability")
    private Double probability;

    @JsonProperty("explanation")
    private String explanation;

    // Default constructor
    public PredictionResponse() {
    }

    // Parameterized constructor
    public PredictionResponse(Integer risk, Double probability, String explanation) {
        this.risk = risk;
        this.probability = probability;
        this.explanation = explanation;
    }

    // Getters
    public Integer getRisk() {
        return risk;
    }

    public Double getProbability() {
        return probability;
    }

    public String getExplanation() {
        return explanation;
    }

    // Setters
    public void setRisk(Integer risk) {
        this.risk = risk;
    }

    public void setProbability(Double probability) {
        this.probability = probability;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    // equals, hashCode, toString
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PredictionResponse that = (PredictionResponse) o;
        return java.util.Objects.equals(risk, that.risk) &&
                java.util.Objects.equals(probability, that.probability) &&
                java.util.Objects.equals(explanation, that.explanation);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(risk, probability, explanation);
    }

    @Override
    public String toString() {
        return "PredictionResponse{" +
                "risk=" + risk +
                ", probability=" + probability +
                ", explanation='" + explanation + '\'' +
                '}';
    }
}