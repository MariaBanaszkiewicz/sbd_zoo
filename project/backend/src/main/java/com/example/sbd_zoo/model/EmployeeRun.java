package com.example.sbd_zoo.model;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "PRACOWNIK_ZAGRODA")
@IdClass(EmployeeRun.class)
public class EmployeeRun implements Serializable {
    @Id
    @Column(name = "pracownik")
    private String employee;

    @Id
    @Column(name = "zagroda")
    private String run;

    public String getEmployee() {
        return employee;
    }

    public void setEmployee(String employee) {
        this.employee = employee;
    }

    public String getRun() {
        return run;
    }

    public void setRun(String run) {
        this.run = run;
    }
}
