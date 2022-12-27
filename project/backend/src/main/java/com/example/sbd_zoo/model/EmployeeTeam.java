package com.example.sbd_zoo.model;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "PRACOWNIK_ZESPOL")
@IdClass(EmployeeTeam.class)
public class EmployeeTeam implements Serializable {

    @Id
    @Column(name = "pracownik")
    private Integer employee;

    @Id
    @Column(name = "zespół")
    private String Team;


    public Integer getEmployee() {
        return employee;
    }

    public void setEmployee(Integer employee) {
        this.employee = employee;
    }

    public String getTeam() {
        return Team;
    }

    public void setTeam(String team) {
        Team = team;
    }
}
