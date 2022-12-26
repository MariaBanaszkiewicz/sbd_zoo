package com.example.sbd_zoo.rest;

import com.example.sbd_zoo.model.Team;
import com.example.sbd_zoo.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TeamController {
    @Autowired
    TeamService teamService;

    @GetMapping("/teams")
    public<T> T getTeams() {
        try {
            List<Team> listOfTeams = teamService.getAllTeams();
            return (T) listOfTeams;
        } catch (Exception e) {
            return (T) ResponseEntity.status(500).body("Failed to obtain teams");
        }

    }

    @GetMapping("/team/{id}")
    public<T> T getTeam(@PathVariable(value = "id") String id) {
        try {
            Team team = teamService.getTeam(id);

            return (T) team;
        } catch (Exception e) {

            return (T) ResponseEntity.status(500).body("Team with given id does not exist");

        }
    }
    @PostMapping("/teams")
    public ResponseEntity postTeam(@RequestBody Team team) {
        try {
            teamService.addTeam(team);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add team");
        }
    }

    @PutMapping("/teams")
    public ResponseEntity updateTeam(@RequestBody Team team) {
        try {
            teamService.updateTeam(team);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update team");
        }
    }

    @DeleteMapping("/team/{id}")
    public ResponseEntity deleteTeam(@PathVariable(value = "id") String id){
        try {
            teamService.deleteTeam(id);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete team");
        }
    }
}
