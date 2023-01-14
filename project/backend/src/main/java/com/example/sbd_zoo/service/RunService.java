package com.example.sbd_zoo.service;

import com.example.sbd_zoo.model.Animal;
import com.example.sbd_zoo.model.EmployeeRun;
import com.example.sbd_zoo.model.Run;
import com.example.sbd_zoo.repository.AnimalRepository;
import com.example.sbd_zoo.repository.EmployeeRunRepository;
import com.example.sbd_zoo.repository.RunRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.List;

@Service
public class RunService {

    @Autowired
    RunRepository runRepository;

    @Autowired
    AnimalService animalService;

    @Autowired
    AnimalRepository animalRepository;

    @Autowired
    EmployeeRunService employeeRunService;

    @Autowired
    EmployeeRunRepository employeeRunRepository;

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
        run.setName(run.getName().substring(0,1).toUpperCase()+run.getName().substring(1).toLowerCase());
        if (runRepository.existsById(run.getName())){
            throw new DataIntegrityViolationException("Podana zagroda znajduje się już w bazie.");
        } else {
            runRepository.save(run);
        }
    }

    @Transactional
    public void updateRun(String id, Run run) {
        run.setName(run.getName().substring(0,1).toUpperCase()+run.getName().substring(1).toLowerCase());
        Run old = runRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Run not found on :: " + id));
        if (!old.getName().equals(run.getName())){
            if (runRepository.existsById(run.getName())){
                throw new DataIntegrityViolationException("Podana zagroda znajduje się już w bazie.");
            } else {
                runRepository.save(run);
                List<Animal> animals = animalRepository.findByRun(id);
                for (Animal animal : animals) {
                    animal.setRun(run.getName());
                    animalService.updateAnimal(animal.getId(), animal);
                }
                List<EmployeeRun> employeeRuns = employeeRunRepository.findEmployeeRunByRun(id);
                for (EmployeeRun employeeRun : employeeRuns){
                    employeeRunService.deleteEmployeeRun(employeeRun);
                    employeeRun.setRun(run.getName());
                    employeeRunService.addEmployeeRun(employeeRun);
                }
                runRepository.deleteById(id);
            }
        } else {
            old.setSize(run.getSize());
            old.setClimate(run.getClimate());
            runRepository.save(old);
        }

    }

    @Transactional
    public void deleteRun(String id) throws SQLIntegrityConstraintViolationException {
        List<Animal> animals = animalRepository.findByRun(id);
        if (animals.isEmpty()){
            runRepository.deleteById(id);
        } else {
            throw new SQLIntegrityConstraintViolationException("Nie można usunąć zagrody, ponieważ znajdują się w niej zwierzęta.");
        }

    }
}
