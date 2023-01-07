package com.example.sbd_zoo.service;

import com.example.sbd_zoo.model.Animal;
import com.example.sbd_zoo.model.Species;
import com.example.sbd_zoo.model.SpeciesClimate;
import com.example.sbd_zoo.repository.SpeciesClimateRepository;
import com.example.sbd_zoo.repository.SpeciesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        if (speciesRepository.existsById(species.getName())){
            throw new DataIntegrityViolationException("Podany gatunek znajduje się już w bazie.");
        } else {
            speciesRepository.save(species);
        }
    }

    @Transactional
    public void updateSpecies(String id, Species species) {
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
                List<Animal> animals = animalService.animalRepository.findBySpecies(id);
                for (Animal animal : animals){
                    animal.setSpecies(species.getName());
                    animalService.updateAnimal(animal.getId(),animal);
                }
                deleteSpecies(species.getName());
            }
        } else {
            old.setTheClass(species.getTheClass());
            speciesRepository.save(old);
        }

    }

    @Transactional
    public void deleteSpecies(String id) {
        speciesRepository.deleteById(id);
    }
}
