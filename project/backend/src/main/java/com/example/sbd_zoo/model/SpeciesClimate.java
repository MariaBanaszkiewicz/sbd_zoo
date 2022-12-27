package com.example.sbd_zoo.model;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "GATUNEK_KLIMAT")
@IdClass(SpeciesClimate.class)
public class SpeciesClimate implements Serializable {

    @Id
    @Column(name = "gatunek")
    private String species;

    @Id
    @Column(name = "klimat")
    private String climate;

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public String getClimate() {
        return climate;
    }

    public void setClimate(String climate) {
        this.climate = climate;
    }
}
