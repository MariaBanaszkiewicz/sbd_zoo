package com.example.sbd_zoo.service;

import com.example.sbd_zoo.model.EmployeeRun;
import com.example.sbd_zoo.repository.EmployeeRunRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmployeeRunService {

    @Autowired
    EmployeeRunRepository employeeRunRepository;


    @Transactional
    public List<EmployeeRun> getAllEmployeeRuns() {
        return employeeRunRepository.findAll();
    }


    @Transactional
    public void addEmployeeRun(EmployeeRun employeeRun) {

        if (employeeRunRepository.existsById(employeeRun)){
            throw new DataIntegrityViolationException("Pracownik jest już przypisany do tej zagrody.");
        } else {
            employeeRunRepository.save(employeeRun);
        }


    }

    @Transactional
    public void updateEmployeeRun(EmployeeRun id, EmployeeRun employeeRun) {
        EmployeeRun old = employeeRunRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("EmployeeRun not found on :: " + id));
        deleteEmployeeRun(old);
        employeeRunRepository.save(employeeRun);

    }

    @Transactional
    public void deleteEmployeeRun(EmployeeRun id) {
        employeeRunRepository.deleteById(id);
    }
}
