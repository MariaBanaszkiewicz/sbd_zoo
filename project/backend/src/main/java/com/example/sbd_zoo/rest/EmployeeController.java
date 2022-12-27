package com.example.sbd_zoo.rest;


import com.example.sbd_zoo.model.Employee;
import com.example.sbd_zoo.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class EmployeeController {
    @Autowired
    EmployeeService employeeService;

    @GetMapping("/employees")
    public<T> T getEmployees() {
        try {
            List<Employee> listOfEmployees = employeeService.getAllEmployees();
            return (T) listOfEmployees;
        } catch (Exception e) {
            return (T) ResponseEntity.status(500).body("Failed to obtain employees");
        }

    }

    @GetMapping("/employee/{id}")
    public<T> T getEmployee(@PathVariable(value = "id") Integer id) {
        try {
            Employee employee = employeeService.getEmployee(id);

            return (T) employee;
        } catch (Exception e) {

            return (T) ResponseEntity.status(500).body("Employee with given id does not exist");

        }
    }
    @PostMapping("/employees")
    public ResponseEntity postEmployee(@RequestBody Employee employee) {
        try {
            employeeService.addEmployee(employee);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add employee");
        }
    }

    @PutMapping("/employee/{id}")
    public ResponseEntity updateEmployee(@PathVariable(value = "id") Integer id, @RequestBody Employee employee) {
        try {
            employeeService.updateEmployee(id, employee);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update animal");
        }
    }

    @DeleteMapping("/employee/{id}")
    public ResponseEntity deleteEmployee(@PathVariable(value = "id") Integer id){
        try {
            employeeService.deleteEmployee(id);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete animal");
        }
    }
}
