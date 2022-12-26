package com.example.sbd_zoo.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "LECZENIA")
@IdClass(TreatmentID.class)
public class Treatment{
    @Id
    @Column(name = "choroba")
    private String disease;

    @Id
    @Column(name = "data")
    private Date date;

    @Column(name = "opis")
    private String description;

    @Id
    @Column(name = "zwierze")
    private Long animal;

    public String getDisease() {
        return disease;
    }

    public void setDisease(String disease) {
        this.disease = disease;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getAnimal() {
        return animal;
    }

    public void setAnimal(Long animal) {
        this.animal = animal;
    }

    public TreatmentID id() {
        TreatmentID treatmentID = new TreatmentID();
        treatmentID.setDisease(disease);
        treatmentID.setAnimal(animal);
        treatmentID.setDate(date);
        return treatmentID;
    }
}



