package com.example.sbd_zoo.rest;

import com.example.sbd_zoo.model.Serving;
import com.example.sbd_zoo.model.ServingId;
import com.example.sbd_zoo.service.ServingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class ServingController {

    @Autowired
    ServingService servingService;

    @GetMapping("/servings")
    public <T> T getServings() {
        try {
            List<Serving> listOfServings = servingService.getAllServings();
            return (T) listOfServings;
        } catch (Exception e) {
            return (T) ResponseEntity.status(500).body("Nie udało się pobrać porcji.");
        }

    }

    @GetMapping("/serving/{animal}+{food}")
    public <T> T getServing(@PathVariable(value = "animal") Long animal, @PathVariable(value = "food") String food) {
        try {
            ServingId id = new ServingId();
            id.setAnimal(animal);
            id.setFood(food);
            Serving serving = servingService.getServing(id);

            return (T) serving;
        } catch (Exception e) {

            return (T) ResponseEntity.status(500).body("Szukana porcja nie istnieje.");

        }
    }

    @PostMapping("/servings")
    public ResponseEntity postServing(@RequestBody Serving serving) {
        try {
            servingService.addServing(serving);
            return ResponseEntity.status(200).body("Success");
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(500).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się dodać porcji.");
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
            return ResponseEntity.status(500).body("Nie udało się zaktualizować porcji.");
        }
    }

    @DeleteMapping("/serving/{animal}+{food}")
    public ResponseEntity deleteServing(@PathVariable(value = "animal") Long animal, @PathVariable(value = "food") String food) {
        try {
            ServingId id = new ServingId();
            id.setAnimal(animal);
            id.setFood(food);
            servingService.deleteServing(id);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się usunąć porcji.");
        }
    }
}
