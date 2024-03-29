package com.example.sbd_zoo.rest;

import com.example.sbd_zoo.model.Animal;
import com.example.sbd_zoo.model.AnimalDetails;
import com.example.sbd_zoo.service.AnimalService;
import com.example.sbd_zoo.service.ServingService;
import com.example.sbd_zoo.service.TreatmentService;
import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.google.gson.Gson;

import java.util.List;

@CrossOrigin
@RestController
public class AnimalController {

    @Autowired
    AnimalService animalService;
    @Autowired
    TreatmentService treatmentService;

    @Autowired
    ServingService servingService;

    @GetMapping("/animals")
    public<T> T getAnimals() {
        try {
            List<Animal> listOfAnimals = animalService.getAllAnimals();
            return (T) listOfAnimals;
        } catch (Exception e) {
            return (T) ResponseEntity.status(500).body("Wystąpił błąd podczas pobierana zwierząt.");
        }

    }

    @GetMapping("/animal/{id}")
    public<T> T getAnimal(@PathVariable(value = "id") Long id) {
        try {
            Animal animal = animalService.getAnimal(id);

            AnimalDetails animalDetails = new AnimalDetails();

            animalDetails.setAnimal(animal);
            animalDetails.setTreatments(treatmentService.getAnimalTreatments(animal.getId()));
            animalDetails.setServings(servingService.getAnimalServings( animal.getId().intValue()));

            return (T) animalDetails;
        } catch (Exception e) {

            e.printStackTrace();
            return (T) ResponseEntity.status(500).body("Wybrane zwierzę nie znajduje się w bazie.");

        }
    }
    @PostMapping("/animals")
    public ResponseEntity postAnimal(@RequestBody Animal animal) {
        try {
            animalService.addAnimal(animal);
            return ResponseEntity.status(200).body("Success");
        }catch (DataIntegrityViolationException e){
            return ResponseEntity.status(500).body(e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body("Podczas dodawania zwierzęcia wystąpił błąd.");
        }
    }

    @PutMapping("/animal/{id}")
    public ResponseEntity updateAnimal(@PathVariable(value = "id") Long id, @RequestBody Animal animal) {
        try {
            animalService.updateAnimal(id, animal);
            return ResponseEntity.status(200).body("Success");
        }catch (ResourceNotFoundException e){
            return ResponseEntity.status(500).body(e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się zaktualizować zwierzęcia.");
        }
    }

    @DeleteMapping("/animal/{id}")
    public ResponseEntity deleteAnimal(@PathVariable(value = "id") Long id){
        try {
            animalService.deleteAnimal(id);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się usunąć zwierzęcia.");
        }
    }
}
