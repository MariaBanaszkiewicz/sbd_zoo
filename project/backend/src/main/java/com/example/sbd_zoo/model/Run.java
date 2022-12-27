package com.example.sbd_zoo.model;

import jakarta.persistence.*;

import java.util.List;

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

    @ManyToMany
    @JoinTable(name = "PRACOWNIK_ZAGRODA")
    private List<Employee> employees;

    @OneToMany(mappedBy = "run")
    private List<Animal> animals;
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

    public List<Employee> getEmployees() {
        return employees;
    }

    public List<Animal> getAnimals() {
        return animals;
    }
}
