package com.example.sbd_zoo.model;

import com.example.sbd_zoo.serializer.SpeciesSerializer;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "klimaty")
public class Climate {

    @Id
    @Column(name = "nazwa")
    private String name;

    @Column(name = "roślinnność")
    private String flora;

    @Column(name = "średnia_temp_dobowa_c")
    private Integer temperatur;

    @Column(name = "wilgotność_powietrza")
    private Integer humidity;

    @ManyToMany
    @JoinTable(name = "GATUNEK_KLIMAT",joinColumns = @JoinColumn(name = "klimat"), inverseJoinColumns = @JoinColumn(name = "gatunek"))
    @JsonSerialize(using = SpeciesSerializer.class)
    private List<Species> species;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFlora() {
        return flora;
    }

    public void setFlora(String flora) {
        this.flora = flora;
    }

    public Integer getTemperatur() {
        return temperatur;
    }

    public void setTemperatur(Integer temperatur) {
        this.temperatur = temperatur;
    }

    public Integer getHumidity() {
        return humidity;
    }

    public void setHumidity(Integer humidity) {
        this.humidity = humidity;
    }

    public List<Species> getSpecies() {
        return species;
    }
}
