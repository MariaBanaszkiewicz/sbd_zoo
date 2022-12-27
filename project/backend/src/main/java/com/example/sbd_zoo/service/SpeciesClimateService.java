package com.example.sbd_zoo.service;

import com.example.sbd_zoo.model.SpeciesClimate;
import com.example.sbd_zoo.repository.SpeciesClimateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SpeciesClimateService {

    @Autowired
    SpeciesClimateRepository speciesClimateRepository;


    @Transactional
    public List<SpeciesClimate> getAllSpeciesClimates() {
        return speciesClimateRepository.findAll();
    }


    @Transactional
    public void addSpeciesClimate(SpeciesClimate speciesClimate) {
        speciesClimateRepository.save(speciesClimate);
    }

    @Transactional
    public void updateSpeciesClimate(SpeciesClimate id, SpeciesClimate speciesClimate) {
        SpeciesClimate old = speciesClimateRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("SpeciesClimate not found on :: " + id));
        old.setClimate(speciesClimate.getClimate());
        old.setSpecies(speciesClimate.getSpecies());
        speciesClimateRepository.save(old);

    }

    @Transactional
    public void deleteSpeciesClimate(SpeciesClimate id) {
        speciesClimateRepository.deleteById(id);
    }
}
