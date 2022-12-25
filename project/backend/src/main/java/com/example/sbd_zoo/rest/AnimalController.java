package com.example.sbd_zoo.rest;

import com.example.sbd_zoo.model.Animal;
import com.example.sbd_zoo.service.AnimalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import com.google.gson.Gson;

import java.util.List;

@RestController
public class AnimalController {
    private final Gson gson = new Gson();

    @Autowired
    AnimalService animalService;

    @GetMapping("/animals")
    public List<Animal> getAnimals() {
        List<Animal> listOfAnimals = animalService.getAllAnimals();
        return listOfAnimals;
    }

    @GetMapping("/animal/{id}")
    public<T> T getAnimal(@PathVariable(value = "id") Long id) {
        try {
            Animal animal = animalService.getAnimal(id);

            return (T) animal;
        } catch (Exception e) {
            return (T) new Error("Animal with given id does not exist");

        }
    }
}
