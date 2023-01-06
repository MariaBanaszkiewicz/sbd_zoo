package com.example.sbd_zoo.service;

import com.example.sbd_zoo.model.Animal;
import com.example.sbd_zoo.model.Employee;
import com.example.sbd_zoo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmployeeService {
    @Autowired
    EmployeeRepository employeeRepository;

    @Transactional
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Transactional
    public Employee getEmployee(String id) {
        return employeeRepository.findById(id).get();
    }

    @Transactional
    public void addEmployee(Employee employee) {
        if (employeeRepository.existsById(employee.getPesel())){
            throw new DataIntegrityViolationException("Podany pracownik jest już zatrudniony.");
        } else {
            employeeRepository.save(employee);
        }

    }

    @Transactional
    public void updateEmployee(String id, Employee employee) {
        Employee old = employeeRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Employee not found on :: " + id));
        old.setPesel(employee.getPesel());
        old.setFisrtName(employee.getFisrtName());
        old.setLastName(employee.getLastName());
        old.setDateOfEmployment(employee.getDateOfEmployment());
        employeeRepository.save(old);

    }

    @Transactional
    public void deleteEmployee(String id) {
        employeeRepository.deleteById(id);
    }
}
