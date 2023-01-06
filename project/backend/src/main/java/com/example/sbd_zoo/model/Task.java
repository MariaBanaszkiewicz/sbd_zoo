package com.example.sbd_zoo.model;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "ZADANIA")
@IdClass(Task.class)
public class Task implements Serializable {

    @Id
    @Column(name = "opis")
    private String description;

    @Id
    @Column(name = "pracownik")
    private String employee;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEmployee() {
        return employee;
    }

    public void setEmployee(String employee) {
        this.employee = employee;
    }
}
