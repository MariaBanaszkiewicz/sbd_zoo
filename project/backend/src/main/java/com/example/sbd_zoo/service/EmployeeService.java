package com.example.sbd_zoo.service;

import com.example.sbd_zoo.model.*;
import com.example.sbd_zoo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    EmployeeTeamService employeeTeamService;

    @Autowired
    EmployeeRunService employeeRunService;

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
                List<Animal> animals = animalService.animalRepository.findAnimalByEmployee(id);
                for (Animal animal : animals){
                    animal.setEmployee(employee.getPesel());
                    animalService.updateAnimal(animal.getId(),animal);
                }
                List<EmployeeTeam> employeeTeams = employeeTeamService.employeeTeamRepository.findEmployeeTeamByEmployee(id);
                for (EmployeeTeam employeeTeam : employeeTeams){
                    employeeTeamService.deleteEmployeeTeam(employeeTeam);
                    employeeTeam.setEmployee(employee.getPesel());
                    employeeTeamService.addEmployeeTeam(employeeTeam);
                }
                List<EmployeeRun> employeeRuns = employeeRunService.employeeRunRepository.findEmployeeRunByEmployee(id);
                for (EmployeeRun employeeRun : employeeRuns){
                    employeeRunService.deleteEmployeeRun(employeeRun);
                    employeeRun.setEmployee(employee.getPesel());
                    employeeRunService.addEmployeeRun(employeeRun);
                }
                deleteEmployee(id);
            }
        } else {

                old.setFisrtName(employee.getFisrtName());
                old.setLastName(employee.getLastName());
                old.setDateOfEmployment(employee.getDateOfEmployment());
                employeeRepository.save(old);
            }

    }

    @Transactional
    public void deleteEmployee(String id) {
        employeeRepository.deleteById(id);
    }
}
