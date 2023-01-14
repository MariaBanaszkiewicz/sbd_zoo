package com.example.sbd_zoo.service;

import com.example.sbd_zoo.model.EmployeeTeam;
import com.example.sbd_zoo.model.Team;
import com.example.sbd_zoo.repository.EmployeeTeamRepository;
import com.example.sbd_zoo.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class TeamService {

    @Autowired
    TeamRepository teamRepository;

    @Autowired
    EmployeeTeamService employeeTeamService;

    @Autowired
    EmployeeTeamRepository employeeTeamRepository;

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
        team.setName(team.getName().substring(0,1).toUpperCase()+team.getName().substring(1).toLowerCase());
        team.setType(team.getType().substring(0,1).toUpperCase()+team.getType().substring(1).toLowerCase());
        if (teamRepository.existsById(team.getName())){
            throw new DataIntegrityViolationException("Zespół o podanej nazwie znajduje się już w bazie.");
        } else {
            teamRepository.save(team);
        }
    }

    @Transactional
    public void updateTeam(String id, Team team) {
        team.setName(team.getName().substring(0,1).toUpperCase()+team.getName().substring(1).toLowerCase());
        team.setType(team.getType().substring(0,1).toUpperCase()+team.getType().substring(1).toLowerCase());
        Team old = teamRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Team not found on :: " + id));
        if (!Objects.equals(old.getName(), team.getName())){
            if (teamRepository.existsById(team.getName())){
                throw new DataIntegrityViolationException("Zespół o podanej nazwie znajduje się już w bazie.");
            } else {
                teamRepository.save(team);
                List<EmployeeTeam> employeeTeams = employeeTeamRepository.findEmployeeTeamByTeam(old.getName());
                for (EmployeeTeam employeeTeam : employeeTeams){
                    employeeTeamService.deleteEmployeeTeam(employeeTeam);
                    employeeTeam.setTeam(team.getName());
                    employeeTeamService.addEmployeeTeam(employeeTeam);
                }
                deleteTeam(id);
            }
        } else {
            old.setType(team.getType());
            teamRepository.save(old);
        }

    }

    @Transactional
    public void deleteTeam(String id) {
        teamRepository.deleteById(id);
    }
}

