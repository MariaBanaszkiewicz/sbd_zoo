package com.example.sbd_zoo.model;

import java.io.Serializable;
import java.util.Date;

public class TreatmentId implements Serializable {


    private String disease;

    private Date date;

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

    public Long getAnimal() {
        return animal;
    }

    public void setAnimal(Long animal) {
        this.animal = animal;
    }
}
