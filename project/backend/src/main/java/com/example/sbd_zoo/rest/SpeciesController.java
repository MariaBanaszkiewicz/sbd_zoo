package com.example.sbd_zoo.rest;


import com.example.sbd_zoo.model.Species;
import com.example.sbd_zoo.service.SpeciesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class SpeciesController {
    @Autowired
    SpeciesService speciesService;

    @GetMapping("/species")
    public<T> T getSpecies() {
        try {
            List<Species> listOfSpecies = speciesService.getAllSpecies();
            return (T) listOfSpecies;
        } catch (Exception e) {
            return (T) ResponseEntity.status(500).body("Nie udało się pobrać gatunków.");
        }

    }

    @GetMapping("/species/{id}")
    public<T> T getSpecies(@PathVariable(value = "id") String id) {
        try {
            Species species = speciesService.getSpecies(id);

            return (T) species;
        } catch (Exception e) {

            return (T) ResponseEntity.status(500).body("Gatunek o podanej nazwie nie istnieje.");

        }
    }
    @PostMapping("/species")
    public ResponseEntity postSpecies(@RequestBody Species species) {
        try {
            speciesService.addSpecies(species);
            return ResponseEntity.status(200).body("Success");
        } catch (DataIntegrityViolationException e){
            return ResponseEntity.status(500).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się dodać gatunku.");
        }
    }

    @PutMapping("/species/{id}")
    public ResponseEntity updateSpecies(@PathVariable(value = "id") String id, @RequestBody Species species) {
        try {
            speciesService.updateSpecies(id, species);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się zaktualizować gatunku.");
        }
    }

    @DeleteMapping("/species/{id}")
    public ResponseEntity deleteSpecies(@PathVariable(value = "id") String id){
        try {
            speciesService.deleteSpecies(id);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się usunąć gatunku.");
        }
    }
}
