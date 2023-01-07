package com.example.sbd_zoo.service;

import com.example.sbd_zoo.model.Animal;
import com.example.sbd_zoo.model.EmployeeRun;
import com.example.sbd_zoo.model.Run;
import com.example.sbd_zoo.repository.RunRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RunService {

    @Autowired
    RunRepository runRepository;

    @Autowired
    AnimalService animalService;

    @Autowired
    EmployeeRunService employeeRunService;

    @Transactional
    public List<Run> getAllRuns() {
        return runRepository.findAll();
    }

    @Transactional
    public Run getRun(String id) {
        return runRepository.findById(id).get();
    }

    @Transactional
    public void addRun(Run run) {
        if (runRepository.existsById(run.getName())){
            throw new DataIntegrityViolationException("Podana zagroda znajduje się już w bazie.");
        } else {
            runRepository.save(run);
        }
    }

    @Transactional
    public void updateRun(String id, Run run) {
        Run old = runRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Run not found on :: " + id));
        if (!old.getName().equals(run.getName())){
            if (runRepository.existsById(run.getName())){
                throw new DataIntegrityViolationException("Podana zagroda znajduje się już w bazie.");
            } else {
                runRepository.save(run);
                List<Animal> animals = animalService.animalRepository.findByRun(id);
                for (Animal animal : animals) {
                    animal.setRun(run.getName());
                    animalService.updateAnimal(animal.getId(), animal);
                }
                List<EmployeeRun> employeeRuns = employeeRunService.employeeRunRepository.findEmployeeRunByRun(id);
                for (EmployeeRun employeeRun : employeeRuns){
                    employeeRunService.deleteEmployeeRun(employeeRun);
                    employeeRun.setRun(run.getName());
                    employeeRunService.addEmployeeRun(employeeRun);
                }
                deleteRun(run.getName());
            }
        } else {
            old.setSize(run.getSize());
            old.setClimate(run.getClimate());
            runRepository.save(old);
        }

    }

    @Transactional
    public void deleteRun(String id) {
        runRepository.deleteById(id);
    }
}
