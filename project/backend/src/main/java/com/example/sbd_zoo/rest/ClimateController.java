package com.example.sbd_zoo.rest;

import com.example.sbd_zoo.model.Climate;
import com.example.sbd_zoo.service.ClimateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ClimateController {
    @Autowired
    ClimateService climateService;

    @GetMapping("/climates")
    public<T> T getClimates() {
        try {
            List<Climate> listOfClimates = climateService.getAllClimates();
            return (T) listOfClimates;
        } catch (Exception e) {
            return (T) ResponseEntity.status(500).body("Failed to obtain climates");
        }

    }

    @GetMapping("/climate/{id}")
    public<T> T getClimate(@PathVariable(value = "id") String id) {
        try {
            Climate climate = climateService.getClimate(id);

            return (T) climate;
        } catch (Exception e) {

            return (T) ResponseEntity.status(500).body("Climate with given id does not exist");

        }
    }
    @PostMapping("/climates")
    public ResponseEntity postClimate(@RequestBody Climate climate) {
        try {
            climateService.addClimate(climate);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add Climate");
        }
    }

    @PutMapping("/climates")
    public ResponseEntity updateClimate(@RequestBody Climate climate) {
        try {
            climateService.updateClimate(climate);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update climate");
        }
    }

    @DeleteMapping("/climate/{id}")
    public ResponseEntity deleteClimate(@PathVariable(value = "id") String id){
        try {
            climateService.deleteClimate(id);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete climate");
        }
    }
}
