package com.example.sbd_zoo.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "ZESPOŁY")
public class Team {

    @Id
    @Column(name = "nazwa" )
    private String name;

    @Column(name = "typ")
    private String type;

    @ManyToMany
    @JoinTable(name = "PRACOWNIK_ZESPOL", joinColumns = @JoinColumn(name = "zespół"), inverseJoinColumns = @JoinColumn(name = "pracownik"))
    private List<Employee> employees;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<Employee> getEmployees() {
        return employees;
    }
}
