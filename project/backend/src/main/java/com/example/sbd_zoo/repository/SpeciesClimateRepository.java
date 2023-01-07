package com.example.sbd_zoo.repository;

import com.example.sbd_zoo.model.SpeciesClimate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpeciesClimateRepository extends JpaRepository<SpeciesClimate, SpeciesClimate> {

    List<SpeciesClimate> findSpeciesClimateByClimate(String climate);
}
