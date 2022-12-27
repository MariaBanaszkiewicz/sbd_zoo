package com.example.sbd_zoo.rest;

import com.example.sbd_zoo.model.EmployeeTeam;
import com.example.sbd_zoo.service.EmployeeTeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class EmployeeTeamController {

    @Autowired
    EmployeeTeamService employeeTeamService;

    @GetMapping("/employeeTeams")
    public<T> T getEmployeeTeams() {
        try {
            List<EmployeeTeam> listOfEmployeeTeams = employeeTeamService.getAllEmployeeTeams();
            return (T) listOfEmployeeTeams;
        } catch (Exception e) {
            return (T) ResponseEntity.status(500).body("Failed to obtain EmployeeTeams");
        }

    }

    @PostMapping("/employeeTeams")
    public ResponseEntity postEmployeeTeam(@RequestBody EmployeeTeam employeeTeam) {
        try {
            employeeTeamService.addEmployeeTeam(employeeTeam);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add EmployeeTeam");
        }
    }

    @PutMapping("/employeeTeam/{emp}+{team}")
    public ResponseEntity updateEmployeeTeam(@PathVariable(value = "emp") Integer emp, @PathVariable(value = "team") String team, @RequestBody EmployeeTeam employeeTeam) {
        try {
            EmployeeTeam id = new EmployeeTeam();
            id.setEmployee(emp);
            id.setTeam(team);
            employeeTeamService.updateEmployeeTeam(id, employeeTeam);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update EmployeeTeam");
        }
    }

    @DeleteMapping("/employeeTeams")
    public ResponseEntity deleteEmployeeTeam(@RequestBody EmployeeTeam employeeTeam){
        try {
            employeeTeamService.deleteEmployeeTeam(employeeTeam);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete EmployeeTeam");
        }
    }
}
