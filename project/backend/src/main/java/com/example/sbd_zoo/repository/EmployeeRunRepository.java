package com.example.sbd_zoo.repository;

import com.example.sbd_zoo.model.EmployeeRun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRunRepository extends JpaRepository<EmployeeRun, EmployeeRun> {

}
