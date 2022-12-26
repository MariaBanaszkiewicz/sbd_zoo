package com.example.sbd_zoo.model;

import java.io.Serializable;
import java.util.List;

public class AnimalDetails implements Serializable {

    private Animal animal;

    private List<Treatment> treatments;

    public Animal getAnimal() {
        return animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    public List<Treatment> getTreatments() {
        return treatments;
    }

    public void setTreatments(List<Treatment> treatments) {
        this.treatments = treatments;
    }
}
