package com.example.sbd_zoo.rest;

import com.example.sbd_zoo.model.Team;
import com.example.sbd_zoo.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
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
            return (T) ResponseEntity.status(500).body("Nie udało się pobrać zespołów.");
        }

    }

    @GetMapping("/team/{id}")
    public<T> T getTeam(@PathVariable(value = "id") String id) {
        try {
            Team team = teamService.getTeam(id);

            return (T) team;
        } catch (Exception e) {

            return (T) ResponseEntity.status(500).body("Zespół o podanej nazwie nie istnieje.");

        }
    }
    @PostMapping("/teams")
    public ResponseEntity postTeam(@RequestBody Team team) {
        try {
            teamService.addTeam(team);
            return ResponseEntity.status(200).body("Success");
        } catch (DataIntegrityViolationException e){
            return ResponseEntity.status(500).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się dodać zespołu.");
        }
    }

    @PutMapping("/team/{id}")
    public ResponseEntity updateTeam(@PathVariable(value = "id") String id, @RequestBody Team team) {
        try {
            teamService.updateTeam(id, team);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się zaktualizować zespołu.");
        }
    }

    @DeleteMapping("/team/{id}")
    public ResponseEntity deleteTeam(@PathVariable(value = "id") String id){
        try {
            teamService.deleteTeam(id);
            return ResponseEntity.status(200).body("Success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Nie udało się usunąć zespołu.");
        }
    }
}
