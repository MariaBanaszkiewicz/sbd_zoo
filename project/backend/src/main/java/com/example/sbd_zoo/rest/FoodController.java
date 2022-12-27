package com.example.sbd_zoo.rest;

import com.example.sbd_zoo.model.Food;
import com.example.sbd_zoo.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class FoodController {
    @Autowired
    FoodService foodService;

    @GetMapping("/food")
    public<T> T getFood() {
        try {
            List<Food> listOfFood = foodService.getAllFood();
            return (T) listOfFood;
        } catch (Exception e) {
            return (T) ResponseEntity.status(500).body("Failed to obtain food");
        }

    }

    @GetMapping("/food/{id}")
    public<T> T getFood(@PathVariable(value = "id") String id) {
        try {
            Food food = foodService.getFood(id);

            return (T) food;
        } catch (Exception e) {

            return (T) ResponseEntity.status(500).body("Food with given name does not exist");

        }
    }
    @PostMapping("/food")
    public ResponseEntity postFood(@RequestBody Food food) {
        try {
            foodService.addFood(food);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add food");
        }
    }

    @PutMapping("/food/{id}")
    public ResponseEntity updateFood(@PathVariable(value = "id") String id, @RequestBody Food food) {
        try {
            foodService.updateFood(id, food);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update food");
        }
    }

    @DeleteMapping("/food/{id}")
    public ResponseEntity deleteFood(@PathVariable(value = "id") String id){
        try {
            foodService.deleteFood(id);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete food");
        }
    }
}
