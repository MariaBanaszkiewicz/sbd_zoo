package com.example.sbd_zoo.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "GATUNKI")
public class Species {
    @Id
    @Column(name = "nazwa")
    private String name;

    @Column(name = "gromada")
    private String theClass;

    @ManyToMany
    @JoinTable(name = "GATUNEK_KLIMAT")
    private List<Climate> climates;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTheClass() {
        return theClass;
    }

    public void setTheClass(String theClass) {
        this.theClass = theClass;
    }

    public List<Climate> getClimates() {
        return climates;
    }
}
