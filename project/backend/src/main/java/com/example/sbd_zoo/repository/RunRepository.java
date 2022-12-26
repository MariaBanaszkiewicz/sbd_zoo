package com.example.sbd_zoo.repository;

import com.example.sbd_zoo.model.Run;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RunRepository extends JpaRepository<Run, String> {
}
