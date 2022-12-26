package com.example.sbd_zoo.rest;

import com.example.sbd_zoo.model.Animal;
import com.example.sbd_zoo.service.AnimalService;
import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.google.gson.Gson;

import java.util.List;

@RestController
public class AnimalController {

    @Autowired
    AnimalService animalService;

    @GetMapping("/animals")
    public<T> T getAnimals() {
        try {
            List<Animal> listOfAnimals = animalService.getAllAnimals();
            return (T) listOfAnimals;
        } catch (Exception e) {
            return (T) ResponseEntity.status(500).body("Failed to obtain animals");
        }

    }

    @GetMapping("/animal/{id}")
    public<T> T getAnimal(@PathVariable(value = "id") Long id) {
        try {
            Animal animal = animalService.getAnimal(id);

            return (T) animal;
        } catch (Exception e) {

            return (T) ResponseEntity.status(500).body("Animal with given id does not exist");

        }
    }
    @PostMapping("/animals")
    public ResponseEntity postAnimal(@RequestBody Animal animal) {
        try {
            animalService.addAnimal(animal);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add animal");
        }
    }

    @PutMapping("/animals")
    public ResponseEntity updateAnimal(@RequestBody Animal animal) {
        try {
            animalService.updateAnimal(animal);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update animal");
        }
    }

    @DeleteMapping("/animal/{id}")
    public ResponseEntity deleteAnimal(@PathVariable(value = "id") Long id){
        try {
            animalService.deleteAnimal(id);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete animal");
        }
    }
}
