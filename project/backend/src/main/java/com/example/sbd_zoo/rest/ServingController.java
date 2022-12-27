package com.example.sbd_zoo.rest;

import com.example.sbd_zoo.model.Serving;
import com.example.sbd_zoo.model.ServingId;
import com.example.sbd_zoo.service.ServingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ServingController {

    @Autowired
    ServingService servingService;

    @GetMapping("/servings")
    public<T> T getServings() {
        try {
            List<Serving> listOfServings = servingService.getAllServings();
            return (T) listOfServings;
        } catch (Exception e) {
            return (T) ResponseEntity.status(500).body("Failed to obtain servings");
        }

    }

    @GetMapping("/serving/{animal}+{food}")
    public<T> T getServing(@PathVariable(value = "animal") Long animal, @PathVariable(value = "food") String food) {
        try {
            ServingId id = new ServingId();
            id.setAnimal(animal);
            id.setFood(food);
            Serving serving = servingService.getServing(id);

            return (T) serving;
        } catch (Exception e) {

            return (T) ResponseEntity.status(500).body("Serving with given id does not exist");

        }
    }
    @PostMapping("/servings")
    public ResponseEntity postServing(@RequestBody Serving serving) {
        try {
            servingService.addServing(serving);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add serving");
        }
    }

    @PutMapping("/serving/{animal}+{food}")
    public ResponseEntity updateServing(@PathVariable(value = "animal") Long animal, @PathVariable(value = "food") String food, @RequestBody Serving serving) {
        try {
            ServingId id = new ServingId();
            id.setAnimal(animal);
            id.setFood(food);
            servingService.updateServing(id, serving);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update Serving");
        }
    }

    @DeleteMapping("/serving/{animal}+{food}")
    public ResponseEntity deleteServing(@PathVariable(value = "animal") Long animal, @PathVariable(value = "food") String food){
        try {
            ServingId id = new ServingId();
            id.setAnimal(animal);
            id.setFood(food);
            servingService.deleteServing(id);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete Serving");
        }
    }
}
