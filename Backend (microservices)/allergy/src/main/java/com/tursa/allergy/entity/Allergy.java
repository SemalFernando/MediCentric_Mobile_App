package com.tursa.allergy.entity;

import java.util.Date;

public class Allergy {
    private String allergyId;
    private String patientId;
    private String allergen;
    private String reaction;
    private String severity;
    private Date confirmedDate;
    private String notes;
    private String confirmedBy;

    // Constructors
    public Allergy() {}

    public Allergy(String patientId, String allergen, String reaction, String severity, String notes, String confirmedBy) {
        this.patientId = patientId;
        this.allergen = allergen;
        this.reaction = reaction;
        this.severity = severity;
        this.notes = notes;
        this.confirmedBy = confirmedBy;
        this.confirmedDate = new Date();
    }

    // Getters and Setters
    public String getAllergyId() { return allergyId; }
    public void setAllergyId(String allergyId) { this.allergyId = allergyId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getAllergen() { return allergen; }
    public void setAllergen(String allergen) { this.allergen = allergen; }

    public String getReaction() { return reaction; }
    public void setReaction(String reaction) { this.reaction = reaction; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public Date getConfirmedDate() { return confirmedDate; }
    public void setConfirmedDate(Date confirmedDate) { this.confirmedDate = confirmedDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getConfirmedBy() { return confirmedBy; }
    public void setConfirmedBy(String confirmedBy) { this.confirmedBy = confirmedBy; }
}
