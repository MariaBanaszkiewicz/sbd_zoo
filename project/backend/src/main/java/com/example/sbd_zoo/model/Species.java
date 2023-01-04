package com.example.sbd_zoo.model;

import com.example.sbd_zoo.serializer.ClimateSerializer;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
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
    @JoinTable(name = "GATUNEK_KLIMAT",joinColumns = @JoinColumn(name = "gatunek"), inverseJoinColumns = @JoinColumn(name = "klimat"))
    @JsonSerialize(using = ClimateSerializer.class)
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
