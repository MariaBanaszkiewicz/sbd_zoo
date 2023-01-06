package com.example.sbd_zoo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.Date;

@Entity
@Table(name = "PRACOWNICY")
public class Employee {
    @Id
    @Column(name = "pesel")
    private String pesel;

    @Column(name = "imię")
    private String fisrtName;

    @Column(name = "nazwisko")
    private String lastName;

    @Column(name = "data_zatrudnienia")
    private Date dateOfEmployment;

    public String getPesel() {
        return pesel;
    }

    public void setPesel(String pesel) {
        this.pesel = pesel;
    }

    public String getFisrtName() {
        return fisrtName;
    }

    public void setFisrtName(String fisrtName) {
        this.fisrtName = fisrtName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Date getDateOfEmployment() {
        return dateOfEmployment;
    }

    public void setDateOfEmployment(Date dateOfEmployment) {
        this.dateOfEmployment = dateOfEmployment;
    }
}
