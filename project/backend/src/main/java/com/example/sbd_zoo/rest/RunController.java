package com.example.sbd_zoo.rest;

import com.example.sbd_zoo.model.Run;
import com.example.sbd_zoo.service.AnimalService;
import com.example.sbd_zoo.service.RunService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class RunController {
    @Autowired
    RunService runService;

    @Autowired
    AnimalService animalService;

    @GetMapping("/runs")
    public<T> T getRuns() {
        try {
            List<Run> listOfRuns = runService.getAllRuns();
            return (T) listOfRuns;
        } catch (Exception e) {
            return (T) ResponseEntity.status(500).body("Nie udało się pobrać zagród.");
        }

    }

    @GetMapping("/run/{id}")
    public<T> T getRun(@PathVariable(value = "id") String id) {
        try {
            Run run = runService.getRun(id);
            return (T) run;
        } catch (Exception e) {

            return (T) ResponseEntity.status(500).body("Zagroda o podanej nazwie nie istnieje.");

        }
    }
    @PostMapping("/runs")
    public ResponseEntity postRun(@RequestBody Run run) {
        try {
            runService.addRun(run);
            return ResponseEntity.status(200).body("Success");
        } catch (DataIntegrityViolationException e){
            return ResponseEntity.status(500).body(e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się dodać zagrody.");
        }
    }

    @PutMapping("/run/{id}")
    public ResponseEntity updateRun(@PathVariable(value = "id") String id, @RequestBody Run run) {
        try {
            runService.updateRun(id, run);
            return ResponseEntity.status(200).body("Success");
        } catch (DataIntegrityViolationException e){
            return ResponseEntity.status(500).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się zaktualizować zagrody.");
        }
    }

    @DeleteMapping("/run/{id}")
    public ResponseEntity deleteRun(@PathVariable(value = "id") String id){
        try {
            runService.deleteRun(id);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się usunąć zagrody.");
        }
    }
}
