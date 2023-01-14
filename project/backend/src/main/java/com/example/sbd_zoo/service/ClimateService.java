package com.example.sbd_zoo.service;

import com.example.sbd_zoo.model.Climate;
import com.example.sbd_zoo.model.Run;
import com.example.sbd_zoo.model.SpeciesClimate;
import com.example.sbd_zoo.repository.ClimateRepository;
import com.example.sbd_zoo.repository.RunRepository;
import com.example.sbd_zoo.repository.SpeciesClimateRepository;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.List;
import java.util.Objects;

@Service
public class ClimateService {

    @Autowired
    ClimateRepository climateRepository;

    @Autowired
    SpeciesClimateRepository speciesClimateRepository;

    @Autowired
    SpeciesClimateService speciesClimateService;

    @Autowired
    RunRepository runRepository;

    @Autowired
    RunService runService;

    @Transactional
    public List<Climate> getAllClimates() {
        return climateRepository.findAll();
    }

    @Transactional
    public Climate getClimate(String id) {
        return climateRepository.findById(id).get();
    }

    @Transactional
    public void addClimate(Climate climate) {
        climate.setName(climate.getName().substring(0,1).toUpperCase()+climate.getName().substring(1).toLowerCase());
        climate.setFlora(climate.getFlora().substring(0,1).toUpperCase()+climate.getFlora().substring(1).toLowerCase());
        if (climateRepository.existsById(climate.getName())){
            throw new DataIntegrityViolationException("Klimat o podanej nazwie już istnieje.");
        } else {
            climateRepository.save(climate);
        }

    }

    @Transactional
    public void updateClimate(String id, Climate climate) {
        climate.setName(climate.getName().substring(0,1).toUpperCase()+climate.getName().substring(1).toLowerCase());
        climate.setFlora(climate.getFlora().substring(0,1).toUpperCase()+climate.getFlora().substring(1).toLowerCase());
        Climate old = climateRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Climate not found on :: " + id));
        if (!Objects.equals(old.getName(), climate.getName())){
            if (climateRepository.existsById(climate.getName())){
                throw new DataIntegrityViolationException("Klimat o podanej nazwie już istnieje.");
            } else {
                climateRepository.save(climate);
                List<SpeciesClimate> speciesClimates = speciesClimateRepository.findSpeciesClimateByClimate(old.getName());
                for (SpeciesClimate speciesClimate : speciesClimates) {
                    speciesClimateService.deleteSpeciesClimate(speciesClimate);
                    speciesClimate.setClimate(climate.getName());
                    speciesClimateService.addSpeciesClimate(speciesClimate);
                }
                List<Run> runs = runRepository.findRunByClimate(old.getName());
                for (Run run : runs) {
                    run.setClimate(climate.getName());
                    runService.updateRun(run.getName(), run);
                }
               climateRepository.deleteById(id);
            }
        } else {
            old.setFlora(climate.getFlora());
            old.setHumidity(climate.getHumidity());
            old.setTemperatur(climate.getTemperatur());
            climateRepository.save(old);
        }

    }

    @Transactional
    public void deleteClimate(String id) throws SQLIntegrityConstraintViolationException {
        List<Run> runs = runRepository.findRunByClimate(id);
        if (runs.isEmpty()) {
            climateRepository.deleteById(id);
        } else {
            throw new SQLIntegrityConstraintViolationException("Nie można usunąć klimatu, ponieważ przypisane są do niego zagrody.");
        }
    }
}

