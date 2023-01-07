package com.example.sbd_zoo.rest;

import com.example.sbd_zoo.model.Climate;
import com.example.sbd_zoo.service.ClimateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.List;

@CrossOrigin
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
            return (T) ResponseEntity.status(500).body("Nie udało się pobrać klimatów z bazy.");
        }

    }

    @GetMapping("/climate/{id}")
    public<T> T getClimate(@PathVariable(value = "id") String id) {
        try {
            Climate climate = climateService.getClimate(id);

            return (T) climate;
        } catch (Exception e) {

            return (T) ResponseEntity.status(500).body("Klimat o podanej nazwie nie znajduje się w bazie.");

        }
    }
    @PostMapping("/climates")
    public ResponseEntity postClimate(@RequestBody Climate climate) {
        try {
            climateService.addClimate(climate);
            return ResponseEntity.status(200).body("Success");
        } catch (DataIntegrityViolationException e){
            return ResponseEntity.status(500).body(e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się dodać klimatu.");
        }
    }

    @PutMapping("/climate/{id}")
    public ResponseEntity updateClimate(@PathVariable(value = "id") String id, @RequestBody Climate climate) {
        try {
            climateService.updateClimate(id, climate);
            return ResponseEntity.status(200).body("Success");
        } catch (DataIntegrityViolationException e){
            return ResponseEntity.status(500).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się zaktualizować klimatu.");
        }
    }

    @DeleteMapping("/climate/{id}")
    public ResponseEntity deleteClimate(@PathVariable(value = "id") String id){
        try {
            climateService.deleteClimate(id);
            return ResponseEntity.status(200).body("Success");
        } catch (SQLIntegrityConstraintViolationException e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się usunąć klimatu.");
        }
    }
}
