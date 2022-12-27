package com.example.sbd_zoo.model;

import java.io.Serializable;

public class ServingId implements Serializable {

    private Long animal;

    private String food;

    public Long getAnimal() {
        return animal;
    }

    public void setAnimal(Long animal) {
        this.animal = animal;
    }

    public String getFood() {
        return food;
    }

    public void setFood(String food) {
        this.food = food;
    }
}
