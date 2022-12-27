package com.example.sbd_zoo.service;

import com.example.sbd_zoo.model.EmployeeTeam;
import com.example.sbd_zoo.repository.EmployeeTeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmployeeTeamService {

    @Autowired
    EmployeeTeamRepository employeeTeamRepository;


    @Transactional
    public List<EmployeeTeam> getAllEmployeeTeams() {
        return employeeTeamRepository.findAll();
    }


    @Transactional
    public void addEmployeeTeam(EmployeeTeam employeeTeam) {
        employeeTeamRepository.save(employeeTeam);
    }

    @Transactional
    public void updateEmployeeTeam(EmployeeTeam id, EmployeeTeam employeeTeam) {
        EmployeeTeam old = employeeTeamRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("EmployeeTeam not found on :: " + id));
        old.setEmployee(employeeTeam.getEmployee());
        old.setTeam(employeeTeam.getTeam());
        employeeTeamRepository.save(old);

    }

    @Transactional
    public void deleteEmployeeTeam(EmployeeTeam id) {
        employeeTeamRepository.deleteById(id);
    }
}
