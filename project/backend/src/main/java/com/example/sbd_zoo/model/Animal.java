package com.example.sbd_zoo.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "ZWIERZĘTA")
public class Animal {
    @Id
    @GeneratedValue(generator = "zwierzęta_numer_identyfikacyjny_seq")
    @Column(name = "numer_identyfikacyjny")
    private Long id;

    @Column(name = "imię")
    private String name;
    @Column(name = "data_urodzenia")
    private Date birthDate;

    @Column(name = "data_przybycia_do_zoo")
    private Date zooDate;

    @Column(name = "gatunek")
    private String species;

    @Column(name = "zagroda")
    private String run;

    @Column(name = "pracownik")
    private Integer employee;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public Date getZooDate() {
        return zooDate;
    }

    public void setZooDate(Date zooDate) {
        this.zooDate = zooDate;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public String getRun() {
        return run;
    }

    public void setRun(String run) {
        this.run = run;
    }

    public Integer getEmployee() {
        return employee;
    }

    public void setEmployee(Integer employee) {
        this.employee = employee;
    }
}
