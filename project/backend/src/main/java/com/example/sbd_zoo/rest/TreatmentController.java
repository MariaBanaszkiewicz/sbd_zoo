package com.example.sbd_zoo.rest;

import com.example.sbd_zoo.model.Treatment;
import com.example.sbd_zoo.model.TreatmentId;
import com.example.sbd_zoo.service.TreatmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@CrossOrigin
@RestController
public class TreatmentController {
    @Autowired
    TreatmentService treatmentService;

    @GetMapping("/treatments")
    public<T> T getTreatments() {
        try {
            List<Treatment> listOfTreatments = treatmentService.getAllTreatments();
            return (T) listOfTreatments;
        } catch (Exception e) {
            return (T) ResponseEntity.status(500).body("Nie udało się otrzymać leczeń.");
        }

    }

    @GetMapping("/treatment/{animal}+{disease}+{date}")
    public<T> T getTreatment(@PathVariable(value = "animal") Long animal, @PathVariable(value = "disease") String disease, @PathVariable(value = "date") @DateTimeFormat(pattern = "yyyy-MM-dd") Date date) {
        try {
            TreatmentId id = new TreatmentId();
            id.setAnimal(animal);
            id.setDisease(disease);
            id.setDate(date);
            Treatment treatment = treatmentService.getTreatment(id);

            return (T) treatment;
        } catch (Exception e) {

            return (T) ResponseEntity.status(500).body("Szukane leczenie nie istnieje.");

        }
    }
    @PostMapping("/treatments")
    public ResponseEntity postTreatment(@RequestBody Treatment treatment) {
        try {
            treatmentService.addTreatment(treatment);
            return ResponseEntity.status(200).body("Success");
        } catch (DataIntegrityViolationException e){
            return ResponseEntity.status(500).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się dodać leczenia.");
        }
    }

    @PutMapping("/treatment/{animal}+{disease}+{date}")
    public ResponseEntity updateTreatment(@PathVariable(value = "animal") Long animal, @PathVariable(value = "disease") String disease, @PathVariable(value = "date") @DateTimeFormat(pattern = "yyyy-MM-dd") Date date, @RequestBody Treatment treatment) {
        try {
            TreatmentId id = new TreatmentId();
            id.setAnimal(animal);
            id.setDisease(disease);
            id.setDate(date);
            treatmentService.updateTreatment(id, treatment);
            return ResponseEntity.status(200).body("Success");
        } catch (DataIntegrityViolationException e){
            return ResponseEntity.status(500).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się zaktualizować leczenia.");
        }
    }

    @DeleteMapping("/treatments")
    public ResponseEntity deleteTreatment(@RequestBody Treatment treatment){
        try {
            treatmentService.deleteTreatment(treatment);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się skasować leczenia.");
        }
    }
}
