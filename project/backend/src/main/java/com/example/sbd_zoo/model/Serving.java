package com.example.sbd_zoo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "PORCJE")
public class Serving {

    @Id
    @Column(name = "zwierzę")
    private Long animal;

    @Id
    @Column(name = "jedzenie")
    private String food;

    @Column(name = "ilość")
    private Integer amount;

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

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }
}
