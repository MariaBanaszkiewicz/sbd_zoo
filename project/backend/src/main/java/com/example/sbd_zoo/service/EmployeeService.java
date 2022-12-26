package com.example.sbd_zoo.service;

import com.example.sbd_zoo.model.Animal;
import com.example.sbd_zoo.model.Employee;
import com.example.sbd_zoo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Employee getEmployee(Integer id) {
        return employeeRepository.findById(id).get();
    }

    @Transactional
    public void addEmployee(Employee employee) {
        employeeRepository.save(employee);
    }

    @Transactional
    public void updateEmployee(Employee employee) {
        Employee old = employeeRepository.findById(employee.getPesel()).orElseThrow(() -> new ResourceNotFoundException("Employee not found on :: " + employee.getPesel()));
        old.setFisrtName(employee.getFisrtName());
        old.setLastName(employee.getLastName());
        old.setDateOfEmployment(employee.getDateOfEmployment());
        employeeRepository.save(old);

    }

    @Transactional
    public void deleteEmployee(Integer id) {
        employeeRepository.deleteById(id);
    }
}
