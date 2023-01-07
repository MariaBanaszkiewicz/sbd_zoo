package com.example.sbd_zoo.service;

import com.example.sbd_zoo.model.*;
import com.example.sbd_zoo.repository.AnimalRepository;
import com.example.sbd_zoo.repository.EmployeeRepository;
import com.example.sbd_zoo.repository.EmployeeRunRepository;
import com.example.sbd_zoo.repository.EmployeeTeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.List;
import java.util.Objects;

@Service
public class EmployeeService {
    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    TaskService taskService;

    @Autowired
    AnimalService animalService;

    @Autowired
    AnimalRepository animalRepository;

    @Autowired
    EmployeeTeamService employeeTeamService;

    @Autowired
    EmployeeTeamRepository employeeTeamRepository;

    @Autowired
    EmployeeRunService employeeRunService;

    @Autowired
    EmployeeRunRepository employeeRunRepository;

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
        if (!Objects.equals(old.getPesel(), employee.getPesel())){
            if (employeeRepository.existsById(employee.getPesel())){
                throw new DataIntegrityViolationException("Podany pracownik jest już zatrudniony.");
            } else {
                employeeRepository.save(employee);
                List<Task> tasks = taskService.getEmployeeTasks(id);
                for (Task task : tasks){
                    taskService.deleteTask(task);
                    task.setEmployee(employee.getPesel());
                    taskService.addTask(task);
                }
                List<Animal> animals = animalRepository.findAnimalByEmployee(id);
                for (Animal animal : animals){
                    animal.setEmployee(employee.getPesel());
                    animalService.updateAnimal(animal.getId(),animal);
                }
                List<EmployeeTeam> employeeTeams = employeeTeamRepository.findEmployeeTeamByEmployee(id);
                for (EmployeeTeam employeeTeam : employeeTeams){
                    employeeTeamService.deleteEmployeeTeam(employeeTeam);
                    employeeTeam.setEmployee(employee.getPesel());
                    employeeTeamService.addEmployeeTeam(employeeTeam);
                }
                List<EmployeeRun> employeeRuns = employeeRunRepository.findEmployeeRunByEmployee(id);
                for (EmployeeRun employeeRun : employeeRuns){
                    employeeRunService.deleteEmployeeRun(employeeRun);
                    employeeRun.setEmployee(employee.getPesel());
                    employeeRunService.addEmployeeRun(employeeRun);
                }
                employeeRepository.deleteById(id);
            }
        } else {

                old.setFisrtName(employee.getFisrtName());
                old.setLastName(employee.getLastName());
                old.setDateOfEmployment(employee.getDateOfEmployment());
                employeeRepository.save(old);
            }

    }

    @Transactional
    public void deleteEmployee(String id) throws SQLIntegrityConstraintViolationException {
        List<Animal> animals = animalRepository.findAnimalByEmployee(id);
        if (animals.isEmpty()) {
            employeeRepository.deleteById(id);
        } else {
            throw new SQLIntegrityConstraintViolationException("Nie można usunąć pracownika, ponieważ jest on opiekunem zwierząt.");
        }
    }
}
