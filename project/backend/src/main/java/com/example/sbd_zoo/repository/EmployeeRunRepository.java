package com.example.sbd_zoo.repository;

import com.example.sbd_zoo.model.EmployeeRun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRunRepository extends JpaRepository<EmployeeRun, EmployeeRun> {
    List<EmployeeRun> findEmployeeRunByRun(String run);

    List<EmployeeRun> findEmployeeRunByEmployee(String employee);
}
