package com.example.sbd_zoo.service;

import com.example.sbd_zoo.model.Team;
import com.example.sbd_zoo.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TeamService {

    @Autowired
    TeamRepository teamRepository;

    @Transactional
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    @Transactional
    public Team getTeam(String id) {
        return teamRepository.findById(id).get();
    }

    @Transactional
    public void addTeam(Team team) {
        teamRepository.save(team);
    }

    @Transactional
    public void updateTeam(Team team) {
        Team old = teamRepository.findById(team.getName()).orElseThrow(() -> new ResourceNotFoundException("Team not found on :: " + team.getName()));
        old.setType(team.getType());
        teamRepository.save(old);

    }

    @Transactional
    public void deleteTeam(String id) {
        teamRepository.deleteById(id);
    }
}

