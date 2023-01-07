package com.example.sbd_zoo.repository;

import com.example.sbd_zoo.model.EmployeeTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeTeamRepository extends JpaRepository<EmployeeTeam, EmployeeTeam> {

    List<EmployeeTeam> findEmployeeTeamByTeam(String team);

    List<EmployeeTeam> findEmployeeTeamByEmployee(String employee);
}
