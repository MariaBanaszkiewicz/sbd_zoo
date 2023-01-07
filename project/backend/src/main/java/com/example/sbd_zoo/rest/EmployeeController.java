package com.example.sbd_zoo.rest;


import com.example.sbd_zoo.model.Employee;
import com.example.sbd_zoo.model.EmployeeDetails;
import com.example.sbd_zoo.service.EmployeeService;
import com.example.sbd_zoo.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class EmployeeController {
    @Autowired
    EmployeeService employeeService;

    @Autowired
    TaskService taskService;

    @GetMapping("/employees")
    public<T> T getEmployees() {
        try {
            List<Employee> listOfEmployees = employeeService.getAllEmployees();
            return (T) listOfEmployees;
        } catch (Exception e) {
            return (T) ResponseEntity.status(500).body("Nie udało się pobrać pracowników z bazy.");
        }

    }

    @GetMapping("/employee/{id}")
    public<T> T getEmployee(@PathVariable(value = "id") String id) {
        try {

            Employee employee = employeeService.getEmployee(id);
            EmployeeDetails employeeDetails = new EmployeeDetails();
            employeeDetails.setEmployee(employee);
            employeeDetails.setTasks(taskService.getEmployeeTasks(employee.getPesel()));

            return (T) employeeDetails;
        } catch (Exception e) {

            return (T) ResponseEntity.status(500).body("Pracownik o takim numerze pesel nie znajduje się w bazie.");

        }
    }
    @PostMapping("/employees")
    public ResponseEntity postEmployee(@RequestBody Employee employee) {
        try {
            employeeService.addEmployee(employee);
            return ResponseEntity.status(200).body("Success");
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się dodać pracownika.");
        }
    }

    @PutMapping("/employee/{id}")
    public ResponseEntity updateEmployee(@PathVariable(value = "id") String id, @RequestBody Employee employee) {
        try {
            employeeService.updateEmployee(id, employee);
            return ResponseEntity.status(200).body("Success");
        }catch (DataIntegrityViolationException e){
            return ResponseEntity.status(500).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się zaktualizować pracownika.");
        }
    }

    @DeleteMapping("/employee/{id}")
    public ResponseEntity deleteEmployee(@PathVariable(value = "id") String id){
        try {
            employeeService.deleteEmployee(id);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się usunąć pracownika.");
        }
    }

    @PutMapping("/employee/transfer/{from}+{to}")
    public ResponseEntity transferTasks(@PathVariable(value = "from") String from, @PathVariable(value = "to") String to){
        try {
            taskService.transferTasks(from, to);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e){
            return ResponseEntity.status(500).body("Nie udało się przekazać zadań pracownika.");
        }
    }
}
