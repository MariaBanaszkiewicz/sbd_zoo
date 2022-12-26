package com.example.sbd_zoo.service;

import com.example.sbd_zoo.model.Species;
import com.example.sbd_zoo.repository.SpeciesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SpeciesService {

    @Autowired
    SpeciesRepository speciesRepository;

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
        speciesRepository.save(species);
    }

    @Transactional
    public void updateSpecies(String id, Species species) {
        Species old = speciesRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Species not found on :: " + id));
        old.setName(species.getName());
        old.setTheClass(species.getTheClass());
        speciesRepository.save(old);

    }

    @Transactional
    public void deleteSpecies(String id) {
        speciesRepository.deleteById(id);
    }
}
