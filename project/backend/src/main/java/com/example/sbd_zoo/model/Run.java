package com.example.sbd_zoo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ZAGRODY")
public class Run {

    @Id
    @Column(name = "nazwa_zagrody")
    private String name;

    @Column(name = "rozmiar")
    private Integer size;

    @Column(name = "klimat")
    private String climate;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public String getClimate() {
        return climate;
    }

    public void setClimate(String climate) {
        this.climate = climate;
    }
}
