package com.example.sbd_zoo.service;

import com.example.sbd_zoo.model.Animal;
import com.example.sbd_zoo.model.Species;
import com.example.sbd_zoo.model.SpeciesClimate;
import com.example.sbd_zoo.repository.AnimalRepository;
import com.example.sbd_zoo.repository.SpeciesClimateRepository;
import com.example.sbd_zoo.repository.SpeciesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.List;
import java.util.Objects;

@Service
public class SpeciesService {

    @Autowired
    SpeciesRepository speciesRepository;

    @Autowired
    SpeciesClimateRepository speciesClimateRepository;

    @Autowired
    SpeciesClimateService speciesClimateService;

    @Autowired
    AnimalService animalService;

    @Autowired
    AnimalRepository animalRepository;

    @Transactional
    public List<Species> getAllSpecies() {
        return speciesRepository.findAll();
    }

    @Transactional
    public Species getSpecies(String id) {
        return speciesRepository.findById(id).get();
    }

    @Transactional
    public void addSpecies(Species species) {
        species.setName(species.getName().substring(0,1).toUpperCase()+species.getName().substring(1).toLowerCase());
        species.setTheClass(species.getTheClass().substring(0,1).toUpperCase()+species.getTheClass().substring(1).toLowerCase());
        if (speciesRepository.existsById(species.getName())){
            throw new DataIntegrityViolationException("Podany gatunek znajduje się już w bazie.");
        } else {
            speciesRepository.save(species);
        }
    }

    @Transactional
    public void updateSpecies(String id, Species species) {
        species.setName(species.getName().substring(0,1).toUpperCase()+species.getName().substring(1).toLowerCase());
        species.setTheClass(species.getTheClass().substring(0,1).toUpperCase()+species.getTheClass().substring(1).toLowerCase());
        Species old = speciesRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Species not found on :: " + id));
        if (!Objects.equals(old.getName(), species.getName())){
            if (speciesRepository.existsById(species.getName())){
                throw new DataIntegrityViolationException("Podany gatunek znajduje się już w bazie.");
            } else {
                speciesRepository.save(species);
                List<SpeciesClimate> speciesClimates = speciesClimateRepository.findSpeciesClimateByClimate(old.getName());
                for (SpeciesClimate speciesClimate : speciesClimates) {
                    speciesClimateService.deleteSpeciesClimate(speciesClimate);
                    speciesClimate.setSpecies(species.getName());
                    speciesClimateService.addSpeciesClimate(speciesClimate);
                }
                List<Animal> animals = animalRepository.findBySpecies(id);
                for (Animal animal : animals){
                    animal.setSpecies(species.getName());
                    animalService.updateAnimal(animal.getId(),animal);
                }
                speciesRepository.deleteById(id);
            }
        } else {
            old.setTheClass(species.getTheClass());
            speciesRepository.save(old);
        }

    }

    @Transactional
    public void deleteSpecies(String id) throws SQLIntegrityConstraintViolationException {
        List<Animal> animals = animalRepository.findBySpecies(id);
        if (animals.isEmpty()) {
            speciesRepository.deleteById(id);
        } else {
            throw new SQLIntegrityConstraintViolationException("Nie można usunąć gatunku, ponieważ jest on przypisany do zwierząt.");
        }
    }
}
