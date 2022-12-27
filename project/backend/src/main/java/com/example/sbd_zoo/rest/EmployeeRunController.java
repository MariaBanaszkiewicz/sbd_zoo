package com.example.sbd_zoo.rest;

import com.example.sbd_zoo.model.EmployeeRun;
import com.example.sbd_zoo.service.EmployeeRunService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class EmployeeRunController {

    @Autowired
    EmployeeRunService employeeRunService;

    @GetMapping("/employeeRuns")
    public<T> T getEmployeeRuns() {
        try {
            List<EmployeeRun> listOfEmployeeRuns = employeeRunService.getAllEmployeeRuns();
            return (T) listOfEmployeeRuns;
        } catch (Exception e) {
            return (T) ResponseEntity.status(500).body("Failed to obtain EmployeeRuns");
        }

    }

    @PostMapping("/employeeRuns")
    public ResponseEntity postEmployeeRun(@RequestBody EmployeeRun employeeRun) {
        try {
            employeeRunService.addEmployeeRun(employeeRun);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add EmployeeRun");
        }
    }

    @PutMapping("/employeeRun/{emp}+{run}")
    public ResponseEntity updateEmployeeRun(@PathVariable(value = "emp") Integer emp, @PathVariable(value = "run") String run, @RequestBody EmployeeRun employeeRun) {
        try {
            EmployeeRun id = new EmployeeRun();
            id.setEmployee(emp);
            id.setRun(run);
            employeeRunService.updateEmployeeRun(id, employeeRun);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update EmployeeRun");
        }
    }

    @DeleteMapping("/employeeRuns")
    public ResponseEntity deleteEmployeeRun(@RequestBody EmployeeRun employeeRun){
        try {
            employeeRunService.deleteEmployeeRun(employeeRun);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete EmployeeRun");
        }
    }
}
