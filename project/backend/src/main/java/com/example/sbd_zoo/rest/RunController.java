package com.example.sbd_zoo.rest;

import com.example.sbd_zoo.model.Run;
import com.example.sbd_zoo.service.RunService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RunController {
    @Autowired
    RunService runService;

    @GetMapping("/runs")
    public<T> T getRuns() {
        try {
            List<Run> listOfRuns = runService.getAllRuns();
            return (T) listOfRuns;
        } catch (Exception e) {
            return (T) ResponseEntity.status(500).body("Failed to obtain runs");
        }

    }

    @GetMapping("/run/{id}")
    public<T> T getRun(@PathVariable(value = "id") String id) {
        try {
            Run run = runService.getRun(id);

            return (T) run;
        } catch (Exception e) {

            return (T) ResponseEntity.status(500).body("Run with given id does not exist");

        }
    }
    @PostMapping("/runs")
    public ResponseEntity postRun(@RequestBody Run run) {
        try {
            runService.addRun(run);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add run");
        }
    }

    @PutMapping("/runs")
    public ResponseEntity updateRun(@RequestBody Run run) {
        try {
            runService.updateRun(run);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update run");
        }
    }

    @DeleteMapping("/run/{id}")
    public ResponseEntity deleteRun(@PathVariable(value = "id") String id){
        try {
            runService.deleteRun(id);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete Run");
        }
    }
}
