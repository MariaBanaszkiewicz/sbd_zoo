package com.example.sbd_zoo.repository;

import com.example.sbd_zoo.model.Run;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RunRepository extends JpaRepository<Run, String> {


    List<Run> findRunByClimate(String climate);
}
