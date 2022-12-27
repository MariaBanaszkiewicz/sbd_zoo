package com.example.sbd_zoo.model;

import java.util.List;

public class EmployeeDetails {

    private Employee employee;

    private List<Task> tasks;

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
}
