package com.example.sbd_zoo.rest;

import com.example.sbd_zoo.model.SpeciesClimate;
import com.example.sbd_zoo.service.SpeciesClimateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class SpeciesClimateController {

    @Autowired
    SpeciesClimateService speciesClimateService;

    @GetMapping("/speciesClimates")
    public <T> T getSpeciesClimates() {
        try {
            List<SpeciesClimate> listOfSpeciesClimates = speciesClimateService.getAllSpeciesClimates();
            return (T) listOfSpeciesClimates;
        } catch (Exception e) {
            return (T) ResponseEntity.status(500).body("Nie udało się pobrać relacji gatunek klimat");
        }

    }

    @PostMapping("/speciesClimates")
    public ResponseEntity postSpeciesClimate(@RequestBody SpeciesClimate speciesClimate) {
        try {
            speciesClimateService.addSpeciesClimate(speciesClimate);
            return ResponseEntity.status(200).body("Success");
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(500).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się doodać relacji gatunek klimat");
        }
    }

    @PutMapping("/speciesClimate/{sp}+{cl}")
    public ResponseEntity updateSpeciesClimate(@PathVariable(value = "sp") String species, @PathVariable(value = "cl") String climate, @RequestBody SpeciesClimate speciesClimate) {
        try {
            SpeciesClimate id = new SpeciesClimate();
            id.setSpecies(species);
            id.setClimate(climate);
            speciesClimateService.updateSpeciesClimate(id, speciesClimate);
            return ResponseEntity.status(200).body("Success");
        } catch (DataIntegrityViolationException e){
            return ResponseEntity.status(500).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się zaktualizować relacji gatunek klimat.");
        }
    }

    @DeleteMapping("/speciesClimates")
    public ResponseEntity deleteSpeciesClimate(@RequestBody SpeciesClimate speciesClimate) {
        try {
            speciesClimateService.deleteSpeciesClimate(speciesClimate);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się usunąć relacji gatunek klimat.");
        }
    }
}
