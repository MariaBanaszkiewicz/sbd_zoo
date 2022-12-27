package com.example.sbd_zoo.rest;

import com.example.sbd_zoo.model.Treatment;
import com.example.sbd_zoo.model.TreatmentId;
import com.example.sbd_zoo.service.TreatmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

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
            return (T) ResponseEntity.status(500).body("Failed to obtain treatments");
        }

    }

    @GetMapping("/treatment/{animal}+{disease}+{date}")
    public<T> T getTreatment(@PathVariable(value = "animal") Long animal, @PathVariable(value = "disease") String disease, @PathVariable(value = "date") @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date date) {
        try {
            System.out.println(date);
            TreatmentId id = new TreatmentId();
            id.setAnimal(animal);
            id.setDisease(disease);
            id.setDate(date);
            Treatment treatment = treatmentService.getTreatment(id);

            return (T) treatment;
        } catch (Exception e) {

            return (T) ResponseEntity.status(500).body("Treatment with given id does not exist");

        }
    }
    @PostMapping("/treatments")
    public ResponseEntity postTreatment(@RequestBody Treatment treatment) {
        try {
            treatmentService.addTreatment(treatment);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add treatment");
        }
    }

    @PutMapping("/treatments")
    public ResponseEntity updateTreatment(@RequestBody Treatment Treatment) {
        try {
            treatmentService.updateTreatment(Treatment);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update treatment");
        }
    }

    @DeleteMapping("/treatments")
    public ResponseEntity deleteTreatment(@RequestBody Treatment treatment){
        try {
            treatmentService.deleteTreatment(treatment);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete treatment");
        }
    }
}
